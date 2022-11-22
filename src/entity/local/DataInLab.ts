import {Pager} from "../Pager";
import {Task} from "../response/Task";

export class DataInLab {
	lab : string = '';
	taskPager : Pager<Task> = new Pager<Task>();
}