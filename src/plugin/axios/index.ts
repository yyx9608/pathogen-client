import axios from 'axios';
import {ElMessage, ElNotification} from 'element-plus';
import {ResponseEnum} from "../../entity/enums/ResponseEnum";
import store from '../../store/index';
import {Notifications} from "../../constants/Constants";
import router from "../../router";


const str = process.env.NODE_ENV === 'development' ? '/devServer' : 'http://1486641sd0.iask.in:35485'
axios.defaults.baseURL = str;
axios.defaults.withCredentials = true;
//响应拦截
axios.interceptors.response.use(res => {
    if (res.data.code === ResponseEnum.LOGIN_FAIL){
        ElMessage.error(res.data.msg);
        return Promise.reject(res.data.msg);
    } else if (res.data.code === ResponseEnum.LOGIN_SUCCESS){
        ElMessage.success(res.data.msg);
        store.commit("signIn",res.data.result[0]);
        return res.data;
    } else if (res.data.code === ResponseEnum.NOT_LOGIN){
        store.commit("signOut");
        const notification = ElNotification({
            title: Notifications.NOT_LOGIN,
            message: Notifications.TO_LOGIN,
            type: 'error',
            duration : 0,
            onClick() {
                notification.close();
                router.push({ name: 'login', replace : true }).then((res)=>{

                }).catch(e=>{

                }).finally(()=>{

                });
            }
        });
        return Promise.reject(res.data.msg);
    } else if (res.data[0].code === ResponseEnum.FAIL ||
        res.data[0].code === ResponseEnum.CONFIG_NOT_FOUND ||
        res.data[0].code === ResponseEnum.DELETE_FAIL ||
        res.data[0].code === ResponseEnum.INVALID_PARAM ||
        res.data[0].code === ResponseEnum.INSERT_FAIL ||
        res.data[0].code === ResponseEnum.MKDIR_TMP_FAIL ||
        res.data[0].code === ResponseEnum.FILE_NOT_FOUND ||
        res.data[0].code === ResponseEnum.QUERY_FAIL ||
        res.data[0].code === ResponseEnum.SAMPLE_STATUS_ERROR ||
        res.data[0].code === ResponseEnum.TASK_NOT_FOUND ||
        res.data[0].code === ResponseEnum.USER_NOT_FOUND ||
        res.data[0].code=== ResponseEnum.SAMPLE_NOT_FOUND ||
        res.data[0].code === ResponseEnum.UPDATE_FAIL ||
        res.data[0].code=== ResponseEnum.UPLOAD_FAIL){
        console.log('error ' + res.data.code);
        return Promise.reject(res.data[0].msg);
    }
    if (res.headers['content-type']!.match('application/octet-stream')){
        return res;
    }
    return res.data[0];
}, error => {
    return error;
})


export default axios;
