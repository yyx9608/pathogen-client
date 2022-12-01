import {BaseEntity} from "./BaseEntity";
import {AgentType} from "../enums/AgentType";

export class Agent extends BaseEntity {
	
	name ?: string;
	account ?: string;
	fullName ?: string;
	mail ?: string;
	agentType ?: AgentType;

}