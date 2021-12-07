import {
    ITransport,
    ITransportConstructor,
    ITransportEventMap,
} from "./transport/ITransport";

export class Connection implements ITransport {
    transport: ITransport;
    events: ITransportEventMap = {};

    constructor(transport: ITransportConstructor) {
        this.transport = new transport(this.events);
    }

    send(data: ArrayBuffer | Array<number>): void {
        this.transport.send(data);
    }

    connect(url: string): void {
        this.transport.connect(url);
    }

    close(code?: number, reason?: string): void {
        this.transport.close(code, reason);
    }
}
