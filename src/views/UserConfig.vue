<template>

    <div class="common-layout">
      <el-header class="header">
        <Header/>
      </el-header>

      <el-main style="text-align: -webkit-center">
        <el-descriptions class="half-w" title="用户配置" direction="horizontal" :column="1" size="large" border>
          <template #extra>
            <el-button size="default" :onclick="toggleAction" type="primary">{{ action === Action.VIEW ? Notifications.EDIT : Notifications.SAVE }}</el-button>
            <el-button v-if="action === Action.EDIT" size="default" :onclick="cancel" type="primary">{{ Notifications.CANCEL }}</el-button>
          </template>
          <el-descriptions-item :span="1" label="工作目录">
            <el-input v-model="config.workDir" :disabled="action === Action.VIEW" />
          </el-descriptions-item>
          <el-descriptions-item :span="1" label="邮箱" >
            <el-input v-model="config.mail" :disabled="action === Action.VIEW" />
          </el-descriptions-item>
          <el-descriptions-item :span="1" label="邮箱token">
            <el-input v-model="config.mailToken" :disabled="action === Action.VIEW" />
          </el-descriptions-item>
        </el-descriptions>
      </el-main>

    </div>

</template>

<script lang="ts" setup>

import {ElNotification} from "element-plus";
import {ref, Ref} from "vue";
import {Notifications} from "../constants/Constants";
import axios from '../dao/interface';
import {Action} from "../entity/enums/local/Action";
import {UserConfig} from "../entity/response/UserConfig";
import {Loading} from "../utils/Loading";
import Header from "./widgets/Header.vue";

const config = ref<UserConfig>(new UserConfig()) as Ref<UserConfig>;
const action = ref<Action>(Action.VIEW) as Ref<Action>;
const btnLoading = ref<boolean>(false) as Ref<boolean>;

fetchUserConfig();

function toggleAction() {
  if (action.value === Action.VIEW){
    action.value = Action.EDIT;
  } else {
    save();
  }
}

function cancel(){
  action.value = Action.VIEW;
}

function save() {
  if (btnLoading.value){
    return;
  }
  btnLoading.value = true;
  axios.updateConfig(config.value).then(res=>{
    ElNotification({
      title: Notifications.SUCCESS,
      message: Notifications.SUCCESS,
      type: 'success',
    });
    cancel();
  }).catch(e=>{
    ElNotification({
      title: Notifications.FAIL,
      message: Notifications.FAIL,
      type: 'error',
    })
  }).finally(()=>{
    btnLoading.value = false;
  });
}

function fetchUserConfig() {
  Loading.showSimpleLoading()
  axios.fetchConfig().then(res=>{
    config.value = res.result;
  }).catch(e=>{
    ElNotification({
      title: Notifications.FAIL,
      message: e,
      type: 'error',
    })
  }).finally(()=>{
    Loading.hideSimpleLoading();
  })
}

</script>

<style scoped>

</style>