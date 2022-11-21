import {BaseEntity} from "./BaseEntity";
import {SampleStatus} from "../enums/SampleStatus";

export class SampleInfo extends BaseEntity {
	
	/**报告文档路径*/
	reportFile ?: string;
	/**实验室*/
	lab ?: string;
	/**患者名*/
	name ?: string;
	/**代理商*/
	agent ?: string;
	/**送检医院*/
	hospital ?: string;
	/**科室*/
	office ?: string;
	/**送检医生*/
	doctor ?: string;
	/**样本信息表中的样本编号*/
	sampleId ?: string;
	sex ?: string;
	/**送检科目*/
	analysisItem ?: string;
	/**样本类型*/
	sampleType ?: string;
	/**核酸浓度*/
	nucleicAcidConcentration ?: string;
	/**文库浓度*/
	libraryConcentration ?: string;
	/**收样时间*/
	receiveSampleDate ?: Date;
	/**是否付费*/
	paymentStatus ?: string;
	/**床号*/
	sickbedNum ?: string;
	/**病历id*/
	medicalRecordNum ?: string;
	age ?: string;
	phoneNum ?: string;
	/**身份证*/
	identityCardNum ?: string;
	/**条码编号*/
	barcodeNum ?: string;
	/**医院送检结果*/
	resultFromHospital ?: string;
	/**主要关注病原*/
	majorPathogen ?: string;
	/**其他病原*/
	otherPathogen ?: string;
	/**wbc*/
	wbc ?: string;
	/**淋巴细胞*/
	lymphocyte ?: string;
	/**中性细胞粒*/
	neutrophil ?: string;
	/**crp*/
	crp ?: string;
	/**pct*/
	pct ?: string;
	/**检测内容*/
	analysisContent ?: string;
	/**试验编号*/
	experimentNum ?: string;
	/**样本量*/
	sampleCapacity ?: string;
	/**dna体积*/
	dnaVolume ?: string;
	/**panel名*/
	panelName ?: string;
	/**内参批次*/
	internalReferenceNum ?: string;
	/**标准样本批次*/
	stdSampleNum ?: string;
	/**i7barcode编号*/
	i7BarcodeNum ?: string;
	/**i7 barcode序列*/
	i7BarcodeSequence ?: string;
	/**i5 barcode编号*/
	i5BarcodeNum ?: string;
	/**i5barcode序列*/
	i5BarcodeSequence ?: string;
	/**提取实验人*/
	collectBy ?: string;
	/**建库人*/
	labBy ?: string;
	/**防错标签*/
	voidLabel ?: string;
	/**采样日期*/
	samplingAt ?: Date;
	/**样本状态*/
	status ?: SampleStatus;
	/**task id*/
	task ?: string;
	
}