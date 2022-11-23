import {BasePagerRequest} from "./BasePagerRequest";
import {AnalysisResult} from "../response/AnalysisResult";

export class QueryResultRequest extends BasePagerRequest {
	
	result : AnalysisResult = new AnalysisResult();
	
}