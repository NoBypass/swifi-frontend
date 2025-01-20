export class SwifiEvent<T extends (...args: any[]) => any> {
  private listeners: T[] = [];

  public addListener(listener: T): void {
    this.listeners.push(listener);
  }

  public emit(...args: Parameters<T>): void {
    for (let listener of this.listeners) {
      listener(...args);
    }
  }
}
