import {AnalysisResult} from "../response/AnalysisResult";
import {SampleInfo} from "../response/SampleInfo";

export class DataInSample {

    sampleId : string = '';
    sampleInfo : SampleInfo = new SampleInfo();
    results ?: AnalysisResult[] = [];

}