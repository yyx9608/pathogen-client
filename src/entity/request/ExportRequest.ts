import {DownloadEntry} from "../enums/DownloadEntry";
import {SampleInfo} from "../response/SampleInfo";

export class ExportRequest {
	
	entry : DownloadEntry = DownloadEntry.VERIFY;
	payload : SampleInfo = new SampleInfo();

}