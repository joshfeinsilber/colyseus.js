import { Manager, Socket } from "socket.io-client";
import { ITransport, ITransportEventMap } from "./ITransport";

export class WebSocketTransport implements ITransport {
    io: Socket;
    protocols?: string | string[];

    constructor(public events: ITransportEventMap) {}

    public send(data: ArrayBuffer | Array<number>): void {
        if (data instanceof ArrayBuffer) {
            this.io.send(data);
        } else if (Array.isArray(data)) {
            this.io.send(new Uint8Array(data).buffer);
        }
    }

    public connect(url: string) {
        const manager = new Manager(url.replace("ws", "http"), {
            autoConnect: false,
        });
        this.io = manager.socket("/");

        manager.open((err) => {
            if (err) {
                if (this.events.onerror) {
                    this.events.onerror(err);
                }
            } else {
                if (this.events.onopen) {
                    this.events.onopen(null);
                }
            }
        });

        this.io.onAny(this.events.onmessage);

        this.io.io.engine.on("close", this.events.onclose);
        this.io.on("error", this.events.onerror);
    }

    public close(code?: number, reason?: string) {
        this.io.close();
    }
}
