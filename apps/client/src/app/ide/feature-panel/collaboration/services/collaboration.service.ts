import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { io, Socket } from "socket.io-client";
import {
	ChatMessage as ChatMessageDto,
	LeaveMessage,
	JoinMessage,
	Message
} from "@kling/shared/data-access/api-rest-ng-client";

export type ChatMessageType = "INFO" | "EVENT" | "MESSAGE";

export class ChatMessage {
	readonly type: ChatMessageType;
	readonly content: string;
	readonly from?: string;
	readonly date: Date;
}

@Injectable()
export class CollaborationService {
	private socket: Socket;
	private collaboratorsSubject = new BehaviorSubject<string[]>([]);
	private chatMessagesSubject = new BehaviorSubject<ChatMessage[]>([]);

	private room = "hello-world-room";
	private sender = Math.random().toString();

	collaborators$ = this.collaboratorsSubject.asObservable();
	chatMessages$ = this.chatMessagesSubject.asObservable();

	constructor() {}

	joinRoom(): void {
		this.socket = io("http://localhost:3100/collaboration");
		this.registerEventHandlers();

		this.emitJoinMessage({
			type: Message.TypeEnum.JOIN,
			username: "Max Mustermann",
			sender: this.sender,
			room: this.room
		});
	}

	/**
	 * Sends a chat message to the current room.
	 * @throws `Error` if message is empty.
	 */
	sendChatMessage(content: string): void {
		if (!(content?.length > 0)) {
			throw new Error("Message was empty.");
		}

		const message: ChatMessageDto = {
			type: Message.TypeEnum.CHAT,
			content,
			room: this.room,
			sender: this.sender
		};

		this.socket.emit(Message.TypeEnum.CHAT, message);
	}

	private registerEventHandlers() {
		this.socket.on(Message.TypeEnum.JOIN, message => this.handleJoin(message));
		this.socket.on(Message.TypeEnum.LEAVE, message => this.handleLeave(message));
		this.socket.on(Message.TypeEnum.CHAT, message => this.handleChat(message));
	}

	private emitJoinMessage(message: JoinMessage) {
		this.socket.emit(message.type, message);
	}

	private handleJoin(message: JoinMessage): void {
		console.log(message);
		let usernames = this.collaboratorsSubject.getValue();
		usernames = [...usernames, message.username];
		this.collaboratorsSubject.next(usernames);

		this.addChatMessage("EVENT", `${message.username} has joined this room.`);
	}

	private handleLeave(message: LeaveMessage): void {
		console.log(message);
		let usernames = this.collaboratorsSubject.getValue();
		usernames = usernames.filter(name => name === message.username);
		this.collaboratorsSubject.next(usernames);

		this.addChatMessage("EVENT", `${message.username} has left this room.`);
	}

	private handleChat(message: ChatMessageDto): void {
		//console.log(message);

		this.addChatMessage("MESSAGE", message.content, message.sender);
	}

	private addChatMessage(type: ChatMessageType, content: string, from?: string) {
		const newMessage: ChatMessage = {
			type,
			from,
			content,
			date: new Date()
		};

		let messages = this.chatMessagesSubject.getValue();
		messages = [...messages, newMessage];
		this.chatMessagesSubject.next(messages);
	}
}
