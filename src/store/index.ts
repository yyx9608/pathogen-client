import { createStore, useStore as baseUseStore, Store } from 'vuex'
import {User} from "../entity/response/User";
import {GlobalData} from "../entity/GlobalData";
import {InjectionKey} from "vue";
import {Pathogen} from "../entity/response/Pathogen";
import axios from '../dao/interface';
import {stringify} from "querystring";

export const key: InjectionKey<Store<GlobalData>> = Symbol()

export function useStore () {
  return baseUseStore(key)
}

const store = createStore<GlobalData>({
  state: {
    user : undefined,
    pathogenMap :  new Map<string,Pathogen>(),
  },
  getters: {

    isLogin(state){
      return state.user === undefined;
    },

    currentUser(state) : User|undefined {
      return state.user;
    },
    
    getPathogenMap(state) : Map<string,Pathogen>{
      return state.pathogenMap;
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