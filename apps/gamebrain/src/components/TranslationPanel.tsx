import { useState } from "react";
import {
  isTranslationModelLoaded,
  translateToBrazilianPortuguese,
  type TranslationProgress,
  type TranslationProgressStage,
} from "../services/TranslationService";

const INITIAL_PROGRESS: TranslationProgress = {
  stage: "importing-library",
};

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Não foi possível traduzir o texto. Tente novamente.";
}

function getStageMessage(progress: TranslationProgress): string {
  switch (progress.stage) {
    case "importing-library":
      return "Preparando biblioteca de IA...";
    case "loading-tokenizer":
      return progress.file
        ? `Carregando tokenizer: ${progress.file}`
        : "Carregando tokenizer...";
    case "downloading":
      return progress.file
        ? `Baixando modelo: ${progress.file}`
        : "Baixando modelo...";
    case "creating-pipeline":
      return "Preparando modelo...";
    case "model-ready":
      return "Modelo pronto.";
    case "translating":
      return "Traduzindo...";
    case "success":
      return "Tradução concluída.";
    case "error":
      return progress.message ?? "A tradução falhou.";
  }
}

function isBusyStage(stage: TranslationProgressStage): boolean {
  return [
    "importing-library",
    "loading-tokenizer",
    "downloading",
    "creating-pipeline",
    "model-ready",
    "translating",
  ].includes(stage);
}

export default function TranslationPanel() {
  const [text, setText] = useState("");
  const [originalText, setOriginalText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [progress, setProgress] =
    useState<TranslationProgress | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const stage = progress?.stage;
  const isBusy = stage ? isBusyStage(stage) : false;
  const isButtonDisabled = text.trim().length === 0 || isBusy;
  const showDownloadProgress =
    progress?.percentage !== undefined &&
    (stage === "downloading" || stage === "loading-tokenizer");

  async function handleTranslate() {
    const normalizedText = text.trim();

    if (!normalizedText || isBusy) {
      return;
    }

    setOriginalText(normalizedText);
    setTranslatedText("");
    setErrorMessage("");
    setProgress(
      isTranslationModelLoaded()
        ? { stage: "translating" }
        : INITIAL_PROGRESS,
    );

    try {
      const translation = await translateToBrazilianPortuguese(
        normalizedText,
        setProgress,
      );

      setTranslatedText(translation);
    } catch (error: unknown) {
      const message = getErrorMessage(error);

      setErrorMessage(message);
      setProgress({ stage: "error", message });
    }
  }

  return (
    <section className="panel translation-panel">
      <h2>🌍 Tradutor</h2>

      <label className="translation-label" htmlFor="translation-input">
        Texto em inglês
      </label>

      <textarea
        className="translation-input"
        id="translation-input"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="Type something in English..."
        rows={5}
      />

      <button
        className="translation-button"
        type="button"
        onClick={handleTranslate}
        disabled={isButtonDisabled}
      >
        Traduzir
      </button>

      {progress && progress.stage !== "error" && (
        <div className="translation-progress" role="status">
          <p className="translation-message">
            {getStageMessage(progress)}
          </p>

          {progress.fileCompleted && progress.file && (
            <p className="translation-file-complete">
              Arquivo concluído: {progress.file}
            </p>
          )}

          {showDownloadProgress && (
            <>
              <progress
                className="translation-progress-bar"
                value={progress.percentage}
                max={100}
                aria-label="Progresso do carregamento do modelo"
              />
              <p>Carregamento: {Math.round(progress.percentage ?? 0)}%</p>
            </>
          )}
        </div>
      )}

      {progress?.stage === "error" && (
        <div className="translation-error" role="alert">
          <p>{errorMessage}</p>
          <button
            className="translation-retry-button"
            type="button"
            onClick={handleTranslate}
            disabled={text.trim().length === 0}
          >
            Tentar novamente
          </button>
        </div>
      )}

      {(progress?.stage === "success" ||
        progress?.stage === "error") &&
        originalText && (
          <div className="translation-results">
            <div className="translation-result">
              <h3>Original</h3>
              <p>{originalText}</p>
            </div>

            {progress.stage === "success" && (
              <div className="translation-result translation-result-output">
                <h3>Tradução</h3>
                <p>{translatedText}</p>
              </div>
            )}
          </div>
        )}
    </section>
  );
}
