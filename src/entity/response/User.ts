import {UserType} from "../enums/UserType";
import {UserStatus} from "../enums/UserStatus";

export class User {

     username ?: string;
     password ?: string;
     nickname ?: string;
     department ?: string;
     type ?: UserType;
     status ?: UserStatus;

}