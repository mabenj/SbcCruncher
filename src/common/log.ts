export default class Log {
  constructor(private readonly name: string) {}

  private get timestamp() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  debug(message: string) {
    console.log(`${this.timestamp} [DEBUG] ${this.getName()}: ${message}`);
  }

  info(message: string) {
    console.log(`${this.timestamp} [INFO] ${this.getName()}: ${message}`);
  }

  warn(message: string) {
    console.log(`${this.timestamp} [WARN] ${this.getName()}: ${message}`);
  }

  error(message: string, error?: Error | unknown) {
    console.log(
      `${this.timestamp} [ERROR] ${this.getName()}: ${message}`,
      error || ""
    );
  }

  private getName() {
    return `[${this.name}]`;
  }
}
