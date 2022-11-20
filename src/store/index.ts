import { createStore, useStore as baseUseStore, Store } from 'vuex'
import {User} from "../entity/response/User";
import {GlobalData} from "../entity/GlobalData";
import {InjectionKey} from "vue";

export const key: InjectionKey<Store<GlobalData>> = Symbol()

export function useStore () {
  return baseUseStore(key)
}

const store = createStore<GlobalData>({
  state: {
    user : undefined,
  },
  getters: {

    isLogin(state){
      return state.user === undefined;
    },

    currentUser(state){
      return state.user;
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