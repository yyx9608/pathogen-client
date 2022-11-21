import {UserType} from "../enums/UserType";
import {UserStatus} from "../enums/UserStatus";
import {BaseEntity} from "./BaseEntity";

export class User extends BaseEntity {

     /**用户名*/
     username ?: string;
     /**用户密码*/
     password ?: string;
     /**用户昵称*/
     nickname ?: string;
     /**部门*/
     department ?: string;
     /**用户类型*/
     type ?: UserType;
     /**用户状态*/
     status ?: UserStatus;

}