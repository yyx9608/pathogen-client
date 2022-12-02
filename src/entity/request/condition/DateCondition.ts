import {format} from "date-fns";

export class DateCondition {
	
	startTime : string = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
	endTime : string = format(new Date(), 'yyyy-MM-dd HH:mm:ss');

}