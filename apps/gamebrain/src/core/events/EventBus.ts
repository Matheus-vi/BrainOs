type EventCallback = (payload?: unknown) => void;

class EventBus {
  private listeners: Map<string, EventCallback[]> = new Map();

  on(event: string, callback: EventCallback) {
    const callbacks = this.listeners.get(event) || [];

    callbacks.push(callback);

    this.listeners.set(event, callbacks);
  }

  emit(event: string, payload?: unknown) {
    const callbacks = this.listeners.get(event);

    if (!callbacks) return;

    callbacks.forEach((callback) => callback(payload));
  }
}

export default new EventBus();