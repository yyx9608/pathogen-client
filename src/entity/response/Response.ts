// @ts-ignore
import {ResponseEnum} from "../enums/ResponseEnum";

export interface Response<T>  {

    code : ResponseEnum,
    msg : string,
    result : T,

}