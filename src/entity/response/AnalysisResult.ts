import {BaseEntity} from "./BaseEntity";
import {Sign} from "../enums/Sign";
import {ResultStatus} from "../enums/ResultStatus";

export class AnalysisResult extends BaseEntity {

    taskId ?: string;
    sid ?: string;
    pathogenId ?: string;
    sampleType ?: string;
    agent ?: string;
    hospital ?: string;
    office ?: string;
    name ?: string;
    sex ?: string;
    age ?: string;
    nucleicAcidConcentration ?: string;
    libraryConcentration ?: string;
    clinicalInformation ?: string;
    reportTag ?: string;
    readsNums ?: string;
    copyMums ?: string; //后台变量写错了应该是copyNums
    mappingReads ?: string;
    q30Reads ?: string;
    pathogensNums ?: string;
    sign ?: Sign;
    status ?: ResultStatus;
    rawStatus ?: ResultStatus;


}