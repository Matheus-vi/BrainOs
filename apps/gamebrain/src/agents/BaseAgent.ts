export type AgentStatus =
  | "created"
  | "initialized"
  | "running"
  | "paused"
  | "stopped"
  | "destroyed";

abstract class BaseAgent {
  protected readonly id: string;
  protected readonly name: string;
  protected readonly version: string;
  protected status: AgentStatus;

  constructor(name: string, version = "0.1.0") {
    this.id = crypto.randomUUID();
    this.name = name;
    this.version = version;
    this.status = "created";
  }

  initialize(): void {
    this.status = "initialized";
  }

  start(): void {
    this.status = "running";
  }

  pause(): void {
    this.status = "paused";
  }

  stop(): void {
    this.status = "stopped";
  }

  destroy(): void {
    this.status = "destroyed";
  }

  getInfo() {
    return {
      id: this.id,
      name: this.name,
      version: this.version,
      status: this.status,
    };
  }
}

export default BaseAgent;