import {BaseEntity} from "../response/BaseEntity";
import {MessageStatus} from "../enums/MessageStatus";

export class BaseMessage<T> extends BaseEntity {

	code ?: string;
	desc ?: string;
	status ?: MessageStatus;
	payload ?: T;

}