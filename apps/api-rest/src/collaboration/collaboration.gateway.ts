import { Logger } from "@nestjs/common";
import {
	ConnectedSocket,
	MessageBody,
	OnGatewayConnection,
	OnGatewayDisconnect,
	OnGatewayInit,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer
} from "@nestjs/websockets";
import { Socket, Server } from "socket.io";
import {
	ChatMessage,
	JoinMessage,
	LeaveMessage,
	MessageType,
	SelectFileMessage
} from "./messages/messages";

@WebSocketGateway({ namespace: "collaboration" })
export class CollaborationGateway
	implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer() wss!: Server;

	private mappedNames = new Map<string, string>();
	private logger = new Logger(CollaborationGateway.name);

	constructor() {}

	getClientsOfRoom(room: string): string[] {
		console.log(this.wss.clients());
		this.wss.clients().adapter.rooms[room]?.sockets;
		console.log(this.mappedNames);
		return [];
	}

	afterInit(server: any): void {
		//this.logger.verbose("Initialized");
	}

	handleConnection(client: Socket, username: string): void {
		this.logger.verbose("[CONNECTION] Client connected: " + client.id);
		this.mappedNames.set(client.id, username ?? Math.random().toString());
	}

	handleDisconnect(client: Socket): void {
		this.logger.verbose("[DISCONNECTION] Client disconnected: " + client.id);
		this.mappedNames.delete(client.id);
	}

	@SubscribeMessage(MessageType.JOIN)
	join(@MessageBody() message: JoinMessage, @ConnectedSocket() socket: Socket): void {
		socket.join(message.room);
		//socket.in(message.room).emit(MessageType.JOIN, message);

		this.wss.in(message.room).emit(MessageType.JOIN, message);

		this.logger.verbose(`[JOIN] ${message.sender} joined ${message.room}.`);
	}

	@SubscribeMessage("LEAVE")
	leave(@MessageBody() message: LeaveMessage, @ConnectedSocket() socket: Socket): void {
		socket.leave(message.room);
		this.wss.in(message.room).emit(MessageType.LEAVE, message);

		this.logger.verbose(`[LEAVE] ${message.sender} left ${message.room}.`);
	}

	@SubscribeMessage("CHAT")
	chat(@MessageBody() message: ChatMessage, @ConnectedSocket() socket: Socket): void {
		this.logger.verbose(`[CHAT] Message send by ${message.sender}`);
		this.wss.in(message.room).emit(MessageType.CHAT, message);
	}

	@SubscribeMessage("SELECT_FILE")
	selectFile(@MessageBody() message: SelectFileMessage, socket: Socket): void {
		this.logger.verbose("SELECT_FILE");
		this.wss.in(message.room).emit("SELECT_FILE", message.room, message);
	}
}
