import {SampleInfo} from "../response/SampleInfo";
import {BasePagerRequest} from "./BasePagerRequest";

export class QuerySampleInfoRequest extends BasePagerRequest {

	info : SampleInfo = new SampleInfo();
	
}