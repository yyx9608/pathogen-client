import {BaseEntity} from "./BaseEntity";
import {SequenceType} from "../enums/SequenceType";

export class SequenceData extends BaseEntity {
	
	remotePath ?: string;
	desc ?: string;
	localPath ?: string;
	sequenceType ?: string = SequenceType.PE;
	
}