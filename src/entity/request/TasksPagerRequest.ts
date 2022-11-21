import {BasePagerRequest} from "./BasePagerRequest";

export class TasksPagerRequest extends BasePagerRequest {
	
	labId : string;
	
	constructor(labId: string) {
		super();
		this.labId = labId;
	}
}