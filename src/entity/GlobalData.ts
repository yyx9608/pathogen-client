import {User} from "./response/User";
import {Pathogen} from "./response/Pathogen";

export interface GlobalData {
    user : User|undefined,
    pathogenMap : Map<string,Pathogen>
}