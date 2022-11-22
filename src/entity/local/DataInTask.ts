import {Task} from "../response/Task";
import {SampleInfo} from "../response/SampleInfo";
import {Group} from "../response/Group";

export class DataInTask {
	taskId : string = '';
	task : Task = new Task();
	samples : Group<string, SampleInfo[]> = new Group<string, SampleInfo[]>();
}