import { createStore, useStore as baseUseStore, Store } from 'vuex'
import {User} from "../entity/response/User";
import {GlobalData} from "../entity/GlobalData";
import {InjectionKey} from "vue";
import {Pathogen} from "../entity/response/Pathogen";
import axios from '../dao/interface';

export const key: InjectionKey<Store<GlobalData>> = Symbol()

export function useStore () {
  return baseUseStore(key)
}

const store = createStore<GlobalData>({
  state: {
    user : undefined,
    pathogenMap : new Map<string,Pathogen>(),
  },
  getters: {

    isLogin(state){
      return state.user === undefined;
    },

    currentUser(state){
      return state.user;
    },
    
    getPathogen(state, pathogenId : string){
      if (state.pathogenMap.has(pathogenId)){
        return new Promise<Pathogen|undefined>((resolve, reject)=>{
          resolve(state.pathogenMap.get(pathogenId));
        })
      } else {
        const pathogen = new Pathogen();
        pathogen.id = pathogenId;
        return axios.pathogenQuery(pathogen).then(res=>{
          if (res.result.id !== undefined){
            state.pathogenMap.set(pathogenId, res.result);
            return new Promise<Pathogen>(resolve => {
              resolve(res.result);
            })
          } else {
            return Promise.reject('id->' + pathogenId + '病原信息为空');
          }
        })
      }
    }

  },
  mutations: {

    signIn(state, user:User){
      state.user = user;
    },

    signOut(state){
      state.user = undefined;
    }

  },
  actions: {},
  modules: {},
});

export default store;