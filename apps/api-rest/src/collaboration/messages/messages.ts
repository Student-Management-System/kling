import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export enum MessageType {
	JOIN = "JOIN",
	LEAVE = "LEAVE",
	CHAT = "CHAT",
	SELECT_FILE = "SELECT_FILE"
}

export abstract class Message {
	@ApiProperty({ enum: MessageType }) readonly type: MessageType;
	@ApiProperty() readonly sender: string;
	@ApiPropertyOptional() readonly room?: string;
}

export class JoinMessage extends Message {
	@ApiProperty({ enum: MessageType }) readonly type = MessageType.JOIN;
	@ApiProperty() readonly username: string;
}

export class LeaveMessage extends Message {
	@ApiProperty({ enum: MessageType }) readonly type = MessageType.LEAVE;
	@ApiProperty() readonly username: string;
}

export class ChatMessage extends Message {
	@ApiProperty({ enum: MessageType }) readonly type = MessageType.CHAT;
	@ApiProperty() content: string;
}

export class SelectFileMessage extends Message {
	@ApiProperty({ enum: MessageType }) readonly type = MessageType.SELECT_FILE;
	@ApiProperty() readonly path: string;
}
