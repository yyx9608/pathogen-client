import axios from 'axios';
import {ElMessage, ElNotification} from 'element-plus';
import {ResponseEnum} from "../../entity/enums/ResponseEnum";
import store from '../../store/index';
import {Notifications} from "../../constants/Constants";
import router from "../../router";


const str = process.env.NODE_ENV === 'development' ? '/devServer' : 'http://1486641sd0.iask.in:35485'
axios.defaults.baseURL = str;
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
    } else if (res.data.code === ResponseEnum.FAIL ||
        res.data.code === ResponseEnum.CONFIG_NOT_FOUND ||
        res.data.code === ResponseEnum.DELETE_FAIL ||
        res.data.code === ResponseEnum.INVALID_PARAM ||
        res.data.code === ResponseEnum.INSERT_FAIL ||
        res.data.code === ResponseEnum.MKDIR_TMP_FAIL ||
        res.data.code === ResponseEnum.FILE_NOT_FOUND ||
        res.data.code === ResponseEnum.QUERY_FAIL ||
        res.data.code === ResponseEnum.SAMPLE_STATUS_ERROR ||
        res.data.code === ResponseEnum.TASK_NOT_FOUND ||
        res.data.code === ResponseEnum.USER_NOT_FOUND ||
        res.data.code === ResponseEnum.SAMPLE_NOT_FOUND ||
        res.data.code === ResponseEnum.UPDATE_FAIL ||
        res.data.code === ResponseEnum.UPLOAD_FAIL){
        return Promise.reject(res.data.msg);
    }
    if (res.headers['content-type']!.match('application/octet-stream')){
        return res;
    }
    return res.data[0];
}, error => {
    return error;
})


export default axios;
