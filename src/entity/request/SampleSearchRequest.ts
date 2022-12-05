import {BasePagerRequest} from "./BasePagerRequest";
import {DateCondition} from "./condition/DateCondition";

export class SampleSearchRequest extends BasePagerRequest {
	
	createdDateCondition ?: DateCondition;
	updatedDateCondition ?: DateCondition;
	keyWord ?: string;

}