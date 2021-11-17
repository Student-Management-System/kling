import { AssignmentDto, GroupDto, ParticipantDto } from "@student-mgmt/api-client";

export const ASSIGNMENT_INPROGRESS_GROUP: AssignmentDto = {
	id: "176dc168-8b26-4b07-9826-a445a5beb6e0",
	name: "Assignment 1",
	state: "IN_PROGRESS",
	type: "HOMEWORK",
	points: 16,
	collaboration: "GROUP",
	endDate: new Date(2021, 7, 7, 7, 7, 7).toString()
};

export const USER_MMUSTERMANN: ParticipantDto = {
	displayName: "Max Mustermann",
	username: "mmustermann",
	userId: "123",
	role: ParticipantDto.RoleEnum.STUDENT,
	email: "mmustermann@example.email",
	matrNr: 123456
};

export const USER_JDOE: ParticipantDto = {
	displayName: "John Doe",
	username: "jdoe",
	userId: "321",
	role: ParticipantDto.RoleEnum.STUDENT,
	email: "jdoe@example.email",
	matrNr: 654321
};

export const GROUP_JAVA001: GroupDto = {
	name: "JAVA-001",
	hasPassword: false,
	isClosed: false,
	size: 2,
	members: [USER_MMUSTERMANN, USER_JDOE]
};
