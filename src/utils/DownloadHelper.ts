import {AxiosResponse} from "axios";

export class DownloadHelper {
	
	static download(doc : Document, res : AxiosResponse){
		const b = new Blob([res.data], { type: 'application/octet-stream'});
		const name = res.headers['content-disposition']!.substring(20);
		const a = document.createElement("a");
		a.href = URL.createObjectURL(b);
		a.download = name;
		a.style.display = "none";
		document.body.appendChild(a);
		a.click();
		a.remove();
	}
	
}