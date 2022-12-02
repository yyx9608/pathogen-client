import {BasePagerRequest} from "./BasePagerRequest";
import {DateCondition} from "./condition/DateCondition";

export class TaskSearchRequest extends BasePagerRequest {
	
	createdDateCondition ?: DateCondition;
	updatedDateCondition ?: DateCondition;

}