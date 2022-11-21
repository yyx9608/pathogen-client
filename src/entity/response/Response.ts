// @ts-ignore
import {ResponseEnum} from "../enums/ResponseEnum";

export interface Response<T>  {
    
    /**响应码*/
    code : ResponseEnum,
    /**响应码描述*/
    msg : string,
    /**响应数据*/
    result : T,

}