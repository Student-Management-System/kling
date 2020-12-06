import { Module } from "@nestjs/common";
import { CollaborationGateway } from "./collaboration.gateway";

@Module({
	imports: [],
	providers: [CollaborationGateway]
})
export class CollaborationModule {}
