import axios from 'axios';
import {ElMessage, ElNotification} from 'element-plus';
import {ResponseEnum} from "../../entity/enums/ResponseEnum";
import store from '../../store/index';


const str = process.env.NODE_ENV === 'development' ? '/devServer' : 'http://1486641sd0.iask.in:35485'
axios.defaults.baseURL = str;
//响应拦截
axios.interceptors.response.use(res => {
    if (res.data.code === ResponseEnum.LOGIN_FAIL){
        ElMessage.error(res.data.msg);
    } else if (res.data.code === ResponseEnum.LOGIN_SUCCESS){
        ElMessage.success(res.data.msg);
        store.commit("signIn",res.data.result[0]);
        console.log(res.data)
        return res.data;
    } else if (res.data.code === ResponseEnum.NOT_LOGIN){
        store.commit("signOut");
    }
    console.log(res.data[0])
    return res.data[0];
}, error => {
    return error;
})


export default axios;
