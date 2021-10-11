import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { io, Socket } from "socket.io-client";

@Injectable({ providedIn: "root" })
export class WebSocketService {
	socket: Socket;
	protected readonly url = "http://localhost:3100";

	connect(namespace?: string): void {
		const url = this.url + (namespace ?? "");
		this.socket = io(url);
	}

	disconnect(): void {
		this.socket.disconnect();
	}

	listenTo<T>(event: string): Observable<T> {
		return new Observable(subscriber => {
			this.socket.on(event, data => {
				subscriber.next(data);
			});
		});
	}

	emit(event: string, data: unknown): void {
		this.socket.emit(event, data);
	}
}
