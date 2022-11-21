import {BaseEntity} from "./BaseEntity";
import {TaskStatus} from "../enums/TaskStatus";
import {Step} from "../enums/Step";

export class Task extends BaseEntity {
	
	/**任务名*/
	name ?: string;
	/**工作目录*/
	workDir ?: string;
	/**样本信息表路径*/
	sampleInfoFile ?: string;
	/**测序数据id*/
	sequenceId ?: string;
	/**实验室id*/
	lab ?: string;
	/**任务状态*/
	status ?: TaskStatus;
	/**任务步骤*/
	step ?: Step;
	

}