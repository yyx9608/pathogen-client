import {Task} from "../response/Task";
import {SequenceData} from "../response/SequenceData";

export class CreateTaskRequest {

    task : Task = new Task();
    sequenceData : SequenceData = new SequenceData();

}