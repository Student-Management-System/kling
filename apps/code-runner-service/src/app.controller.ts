import { Controller, Logger } from "@nestjs/common";
import { Ctx, MessagePattern, NatsContext, Payload } from "@nestjs/microservices";
import * as Dockerode from "dockerode";
import { promises as fs } from "fs";
import * as streams from "memory-streams";
import { from, Observable, Subject } from "rxjs";
const rmdir = require("rimraf");

type RunCodePayload = {
	files: { path: string; directoryPath: string; content: string }[];
	from: any;
};

async function createDirectoriesWithFiles(request: RunCodePayload): Promise<void> {
	const parentDir = `${__dirname}/submissions/${request.from}`;
	await fs.mkdir(parentDir, { recursive: true });

	const createdDirs = new Set<string>();

	request.files.forEach(async file => {
		if (!createdDirs.has(file.directoryPath)) {
			await fs.mkdir(`${parentDir}/${file.directoryPath}`, { recursive: true });
			createdDirs.add(file.directoryPath);
		}

		await fs.writeFile(`${parentDir}/${file.path}`, file.content);
	});

	rmdir(`${parentDir}`, () => {
		console.log("Deleted directory: " + request.from);
	});
}

@Controller()
export class AppController {
	private logger = new Logger(AppController.name);

	constructor() {}

	@MessagePattern("RUN_CODE")
	async runCode(@Payload() request: any, @Ctx() context: NatsContext): Promise<any> {
		this.logger.verbose(`[RUN_CODE] Received message of ${request.from}`);

		await createDirectoriesWithFiles(request);

		console.log("Starting container...");
		const docker = new Dockerode();
		const stdout = new streams.WritableStream();
		const stderr = new streams.WritableStream();
		const subject = new Subject<string>();

		const image = "hello-world-container";
		const cmd = []; // Use CMD from Dockerfile
		const outputStreams = [stdout, stderr];
		const createOptions = {
			Tty: false, // https://stackoverflow.com/questions/59959647/how-can-i-capture-stdout-from-dockerode-when-using-promises
			HostConfig: {
				AutoRemove: true
			}
		};
		const startOptions = {};

		docker
			.run(image, cmd, outputStreams, createOptions, startOptions)
			.then(([res, container]) => {
				const stdoutStr = stdout.toString().trim();
				const stderrStr = stderr.toString().trim();

				console.log("stdout: ", stdoutStr);
				console.log("stderr: ", stderrStr);

				if (stdoutStr?.length > 0) {
					subject.next(stdoutStr);
				}

				if (stderrStr?.length > 0) {
					subject.next(stderrStr);
				}

				if (!(stdoutStr?.length > 0) && !(stderrStr?.length > 0)) {
					subject.next("No stdout/stderr.");
				}

				subject.complete();
				stdout.end();
				stderr.end();
			})
			.catch(error => console.log(error));

		return subject.asObservable();
	}
}
