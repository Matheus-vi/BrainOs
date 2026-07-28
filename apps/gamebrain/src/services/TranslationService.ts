import type {
  ProgressInfo,
  TranslationPipeline,
} from "@huggingface/transformers";

const MODEL_NAME = "Xenova/opus-mt-en-ROMANCE";
const MODEL_LOAD_TIMEOUT_MS = 180_000;
const INFERENCE_TIMEOUT_MS = 60_000;

export type TranslationProgressStage =
  | "importing-library"
  | "loading-tokenizer"
  | "downloading"
  | "creating-pipeline"
  | "model-ready"
  | "translating"
  | "success"
  | "error";

export type TranslationProgress = {
  stage: TranslationProgressStage;
  file?: string;
  percentage?: number;
  fileCompleted?: boolean;
  message?: string;
};

export type TranslationProgressCallback = (
  progress: TranslationProgress,
) => void;

let translator: TranslationPipeline | null = null;
let translatorPromise: Promise<TranslationPipeline> | null = null;

export class TranslationError extends Error {
  readonly cause?: unknown;

  constructor(message: string, cause?: unknown) {
    super(message);
    this.name = "TranslationError";
    this.cause = cause;
  }
}

export function isTranslationModelLoaded(): boolean {
  return translator !== null;
}

function clampPercentage(value: number): number {
  return Math.min(100, Math.max(0, value));
}

function isTokenizerFile(file: string): boolean {
  const normalizedFile = file.toLowerCase();

  return [
    "tokenizer",
    "vocab",
    "sentencepiece",
    "source.spm",
    "target.spm",
  ].some((part) => normalizedFile.includes(part));
}

function reportProgress(
  callback: TranslationProgressCallback | undefined,
  progress: TranslationProgress,
): void {
  callback?.(progress);
}

function getProgressFile(event: ProgressInfo): string | undefined {
  return "file" in event ? event.file : undefined;
}

function getProgressPercentage(
  event: ProgressInfo,
): number | undefined {
  return "progress" in event
    ? clampPercentage(event.progress)
    : undefined;
}

function normalizeProgressEvent(
  event: ProgressInfo,
): TranslationProgress {
  const file = getProgressFile(event);
  const percentage = getProgressPercentage(event);
  const stage =
    file && isTokenizerFile(file)
      ? "loading-tokenizer"
      : "downloading";

  return {
    stage,
    ...(file ? { file } : {}),
    ...(percentage !== undefined ? { percentage } : {}),
    ...(event.status === "done"
      ? { fileCompleted: true, percentage: 100 }
      : {}),
  };
}

function getProgressLogEvent(event: ProgressInfo): object {
  const file = getProgressFile(event);
  const percentage = getProgressPercentage(event);

  return {
    status: event.status,
    ...(file ? { file } : {}),
    ...(percentage !== undefined ? { percentage } : {}),
  };
}

function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  message: string,
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timeoutId = window.setTimeout(() => {
      reject(new TranslationError(message));
    }, timeoutMs);

    promise.then(
      (value) => {
        window.clearTimeout(timeoutId);
        resolve(value);
      },
      (error: unknown) => {
        window.clearTimeout(timeoutId);
        reject(error);
      },
    );
  });
}

type LoadAttemptState = {
  active: boolean;
};

async function createTranslatorAttempt(
  onProgress?: TranslationProgressCallback,
  attemptState: LoadAttemptState = { active: true },
): Promise<TranslationPipeline> {
  reportProgress(onProgress, { stage: "importing-library" });

  try {
    const { pipeline } = await import("@huggingface/transformers");

    console.info("[Translation] Biblioteca importada");
    reportProgress(onProgress, { stage: "creating-pipeline" });

    const pipelinePromise = pipeline("translation", MODEL_NAME, {
      dtype: "q8",
      progress_callback: (event: ProgressInfo) => {
        if (!attemptState.active) {
          return;
        }

        console.info(
          "[Translation] Progresso",
          getProgressLogEvent(event),
        );
        reportProgress(onProgress, normalizeProgressEvent(event));
      },
    });

    const loadedTranslator = await pipelinePromise;

    if (attemptState.active) {
      console.info("[Translation] Pipeline pronta");
      reportProgress(onProgress, { stage: "model-ready" });
    }

    return loadedTranslator;
  } catch (error: unknown) {
    if (error instanceof TranslationError) {
      throw error;
    }

    throw new TranslationError(
      "Não foi possível carregar o modelo de tradução local.",
      error,
    );
  }
}

async function createTranslator(
  onProgress?: TranslationProgressCallback,
): Promise<TranslationPipeline> {
  const attemptState: LoadAttemptState = { active: true };

  try {
    return await withTimeout(
      createTranslatorAttempt(onProgress, attemptState),
      MODEL_LOAD_TIMEOUT_MS,
      "O carregamento do modelo excedeu o limite de 180 segundos. Verifique a conexão e tente novamente.",
    );
  } finally {
    attemptState.active = false;
  }
}

async function loadTranslator(
  onProgress?: TranslationProgressCallback,
): Promise<TranslationPipeline> {
  if (translator) {
    reportProgress(onProgress, { stage: "model-ready" });
    return translator;
  }

  if (!translatorPromise) {
    translatorPromise = createTranslator(onProgress)
      .then((loadedTranslator) => {
        translator = loadedTranslator;
        return loadedTranslator;
      })
      .catch((error: unknown) => {
        translatorPromise = null;
        throw error;
      });
  }

  return translatorPromise;
}

function isUnknownArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

function describeValue(value: unknown): string {
  if (value === null) {
    return "null";
  }

  if (isUnknownArray(value)) {
    return `array com ${value.length} item(ns)`;
  }

  if (typeof value === "object") {
    const keys = Object.keys(value).slice(0, 5);
    return `objeto com chaves: ${keys.join(", ") || "nenhuma"}`;
  }

  return typeof value;
}

function extractTranslation(result: unknown): string {
  if (!isUnknownArray(result)) {
    throw new TranslationError(
      `Formato inesperado: esperado array, recebido ${describeValue(result)}.`,
    );
  }

  if (result.length === 0) {
    throw new TranslationError(
      "Formato inesperado: o resultado foi um array vazio.",
    );
  }

  const firstItem = result[0];

  if (
    typeof firstItem !== "object" ||
    firstItem === null ||
    !("translation_text" in firstItem)
  ) {
    throw new TranslationError(
      `Formato inesperado no primeiro item: ${describeValue(firstItem)}.`,
    );
  }

  const translatedText = firstItem.translation_text;

  if (
    typeof translatedText !== "string" ||
    translatedText.trim().length === 0
  ) {
    throw new TranslationError(
      `translation_text inválido: recebido ${describeValue(translatedText)}.`,
    );
  }

  return translatedText;
}

export async function translateToBrazilianPortuguese(
  text: string,
  onProgress?: TranslationProgressCallback,
): Promise<string> {
  const normalizedText = text.trim();

  if (!normalizedText) {
    throw new TranslationError("Digite um texto em inglês para traduzir.");
  }

  try {
    const translationPipeline = await loadTranslator(onProgress);

    reportProgress(onProgress, { stage: "translating" });
    console.info("[Translation] Iniciando inferência");

    const result: unknown = await withTimeout(
      translationPipeline(`>>pt_BR<< ${normalizedText}`),
      INFERENCE_TIMEOUT_MS,
      "A tradução excedeu o limite de 60 segundos. Tente novamente.",
    );

    console.info("[Translation] Resultado bruto", result);

    const translatedText = extractTranslation(result);

    reportProgress(onProgress, { stage: "success" });
    return translatedText;
  } catch (error: unknown) {
    const translationError =
      error instanceof TranslationError
        ? error
        : new TranslationError(
            "Não foi possível traduzir o texto. Tente novamente.",
            error,
          );

    reportProgress(onProgress, {
      stage: "error",
      message: translationError.message,
    });

    throw translationError;
  }
}
