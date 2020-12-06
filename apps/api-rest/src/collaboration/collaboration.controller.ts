import { Controller, Get, Param } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CollaborationGateway } from "./collaboration.gateway";

@ApiTags("collaboration")
@Controller("collaboration")
export class CollaborationController {
	constructor(private collaborationGateway: CollaborationGateway) {}

	@Get("rooms/:room/users")
	getUserInRoom(@Param("room") room: string): { names: string[] } {
		const names = this.collaborationGateway.getClientsOfRoom(room);
		return { names };
	}
}
