import {ElLoading} from "element-plus";

export class Loading {


    static showSimpleLoading(){
        ElLoading.service({ fullscreen: true })
    }

    static hideSimpleLoading(){
        ElLoading.service({ fullscreen: true }).close();
    }


}