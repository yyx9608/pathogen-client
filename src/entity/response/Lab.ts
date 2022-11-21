import {BaseEntity} from "./BaseEntity";
import {AgentType} from "../enums/AgentType";

export class Lab extends BaseEntity {
    
    /**
     * 实验室名
     */
    name ?: string;

}