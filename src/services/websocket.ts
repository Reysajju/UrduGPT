import { Message } from '../types';

export class WebSocketService {
  private ws: WebSocket | null = null;
  private messageHandlers: ((message: Message) => void)[] = [];

  constructor() {
    this.connect();
  }

  private connect() {
    // In production, replace with your actual WebSocket server URL
    this.ws = new WebSocket('wss://api.urdugpt.stackblitz.io/ws');

    this.ws.onmessage = (event) => {
      const message = JSON.parse(event.data) as Message;
      this.messageHandlers.forEach(handler => handler(message));
    };

    this.ws.onclose = () => {
      // Attempt to reconnect after 3 seconds
      setTimeout(() => this.connect(), 3000);
    };
  }

  public onMessage(handler: (message: Message) => void) {
    this.messageHandlers.push(handler);
  }

  public sendMessage(message: Message) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }

  public disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}