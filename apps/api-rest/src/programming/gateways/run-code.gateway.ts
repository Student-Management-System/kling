import { HttpService, Logger } from "@nestjs/common";
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
import { Server } from "http";
import { timeout } from "rxjs/operators";
import { Socket } from "socket.io";
import { GatewayOutgoing } from "../../gateway-events";
import { SubmissionDto } from "../dto/submission.dto";
import { ReviewServiceProxy, RunCodeRequest } from "../services/review-service-proxy.service";

type PistonResponse = {
	ran: boolean;
	language: string;
	version: string;
	output: string;
	stdout: string;
	stderr: string;
};

@WebSocketGateway({ namespace: "run-code" })
export class RunCodeGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	constructor(private reviewService: ReviewServiceProxy, private http: HttpService) {}

	@WebSocketServer() wss!: Server;
	private logger = new Logger("AppGateway");

	afterInit(server: any): void {
		//this.logger.verbose("Initialized");
	}

	handleConnection(@ConnectedSocket() client: Socket, ...args: any[]): void {
		this.logger.verbose("[CONNECTION] Client connected: " + client.id);
	}

	handleDisconnect(@ConnectedSocket() client: Socket): void {
		this.logger.verbose("[DISCONNECTION] Client disconnected: " + client.id);
	}

	@SubscribeMessage("RUN_CODE")
	async handleMessage(
		@MessageBody() submission: SubmissionDto,
		@ConnectedSocket() client: Socket
	): Promise<void> {
		this.logger.verbose(`[RUN_CODE] Received submission of ${client.id}.`);

		if (!submission.solution) {
			client.emit(GatewayOutgoing.RUN_CODE_RESPONSE, "[ERROR] EMPTY SUBMISSION");
			client.disconnect();
			return;
		}

		client.emit(GatewayOutgoing.RUN_CODE_RESPONSE, "[INFO] Waiting for execution...");

		const request: RunCodeRequest = {
			from: Math.floor(Math.random() * 999999).toString(),
			files: submission.solution?.files,
			language: submission.solution?.language
		};

		this.reviewService
			.test()
			.pipe(timeout(5000))
			.subscribe({
				next: result => {
					console.log("Result:", result);
					client.emit(GatewayOutgoing.RUN_CODE_RESPONSE, result);
				},
				complete: () => {
					this.logger.verbose(
						`[RUN_CODE] Review-Request of ${client.id} completed. Disconnecting client.`
					);
					client.disconnect(true);
				},
				error: error => {
					console.log("Error:", error);
					client.emit(
						GatewayOutgoing.RUN_CODE_RESPONSE,
						"[ERROR] REVIEW_SERVICE FAILURE"
					);
					client.disconnect(true);
				}
			});
	}

	@SubscribeMessage("RUN_TESTS")
	async runTests(
		@MessageBody() submission: SubmissionDto,
		@ConnectedSocket() client: Socket
	): Promise<void> {
		this.logger.verbose(`[RUN_TESTS] Received submission of ${client.id}.`);

		if (!submission.solution) {
			client.emit(GatewayOutgoing.RUN_TESTS_RESPONSE, "[ERROR] EMPTY SUBMISSION");
			client.disconnect();
			return;
		}

		client.emit(GatewayOutgoing.RUN_TESTS_RESPONSE, "[INFO] Waiting for execution...");

		const request: RunCodeRequest = {
			from: Math.floor(Math.random() * 999999).toString(),
			files: submission.solution?.files,
			language: submission.solution?.language
		};

		const { data } = await this.http
			.post<PistonResponse>("https://emkc.org/api/v1/piston/execute", {
				language: "java",
				source: submission.solution.files[0].content
			})
			.toPromise();

		console.log(data);

		if (data.stderr.length > 0) {
			client.emit(GatewayOutgoing.RUN_TESTS_RESPONSE, data.stderr);
		}
	}
}
