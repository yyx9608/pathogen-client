import {BaseEntity} from "../response/BaseEntity";
import {MessageStatus} from "../enums/MessageStatus";
import {MessageCode} from "./MessageCode";

export class BaseMessage<T> extends BaseEntity {

	code ?: MessageCode;
	desc ?: string;
	status ?: MessageStatus;
	payload ?: T;

}