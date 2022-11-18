import axios from 'axios';
import { ElMessage } from 'element-plus';
import {ResponseEnum} from "../../entity/enums/ResponseEnum";


const str = process.env.NODE_ENV === 'development' ? '/devServer' : 'http://1486641sd0.iask.in:35485'
axios.defaults.baseURL = str;
//响应拦截
axios.interceptors.response.use(res => {
    if (res.data.code === ResponseEnum.LOGIN_FAIL){
        ElMessage.error(res.data.msg)
    } else if (res.data.code === ResponseEnum.LOGIN_SUCCESS){
        ElMessage.info(res.data.msg)
    }
    return res.data;
}, error => {
    return error;
})


export default axios;
