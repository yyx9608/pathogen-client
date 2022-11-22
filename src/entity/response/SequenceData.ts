import {BaseEntity} from "./BaseEntity";

export class SequenceData extends BaseEntity {
	
	remotePath ?: string;
	desc ?: string;
	localPath ?: string;
	sequenceType ?: string;
	
}