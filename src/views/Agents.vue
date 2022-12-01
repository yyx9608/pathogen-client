<template>

  <el-container class="main-container">

    <el-header class="header">
      <Header/>
    </el-header>

    <el-main>
      <el-table :data="agents" border style="width: 100%">
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="account" label="账户名" />
        <el-table-column prop="fullName" label="全名"  />
        <el-table-column prop="mail" label="邮箱"  />
        <el-table-column prop="agentType" label="代理商类型" />
      </el-table>
      <el-button v-if="hasMore && agents.length > 0 && !loading" v-on:click="fetchAgents">加载更多</el-button>
      <div v-if="hasMore && loading">加载中</div>
      <el-button style="width: 100%" v-on:click="showAgentDialog">添加代理商</el-button>
    </el-main>

    <el-dialog v-model="showDialog" title="添加代理商">
      <el-form :model="agentCache">
        <el-form-item label="名称" >
          <el-input v-model="agentCache.name"/>
        </el-form-item>
        <el-form-item label="全名" >
          <el-input v-model="agentCache.fullName"/>
        </el-form-item>
        <el-form-item label="账户名" >
          <el-input v-model="agentCache.account"/>
        </el-form-item>
        <el-form-item label="邮箱" >
          <el-input v-model="agentCache.mail"/>
        </el-form-item>
        <el-form-item label="代理商类型" >
          <el-select v-model="agentCache.agentType">
          <el-option :label="AgentType.GENERAL_AGENT" :value="AgentType.GENERAL_AGENT" />
          <el-option :label="AgentType.PROVINCE_AGENT" :value="AgentType.PROVINCE_AGENT" />
          <el-option :label="AgentType.OEM" :value="AgentType.OEM" />
        </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="showDialog = false">{{ Notifications.CANCEL }}</el-button>
        <el-button type="primary" :loading="submitting" v-on:click="insertAgent">{{ Notifications.CONFIRM }}</el-button>
      </span>
      </template>
    </el-dialog>

  </el-container>

</template>

<script lang="ts" setup>

import axios from '../dao/interface';
import {Ref, ref} from "vue";
import {Agent} from "../entity/response/Agent";
import {BasePagerRequest} from "../entity/request/BasePagerRequest";
import {AgentType} from "../entity/enums/AgentType";
import {Notifications} from "../constants/Constants";
import {Loading} from "../utils/Loading";
import {ElNotification} from "element-plus";
import Header from './widgets/Header.vue';

const agents = ref<Agent[]>([]) as Ref<Agent[]>;
const currentPage = ref<number>(1) as Ref<number>;
const hasMore = ref<boolean>(true) as Ref<boolean>;
const loading = ref<boolean>(false) as Ref<boolean>;
const showDialog = ref<boolean>(false) as Ref<boolean>;
const submitting = ref<boolean>(false) as Ref<boolean>;


const agentCache = ref<Agent>(new Agent()) as Ref<Agent>;

fetchAgents();

function fetchAgents(){
  if (!hasMore){
    return;
  }
  loading.value = true;
  const pagerRequest = new BasePagerRequest();
  pagerRequest.currentPage = currentPage.value;
  axios.fetchAgents(pagerRequest).then(res=>{
    hasMore.value = res.result.length >= BasePagerRequest.DEFAULT_PAGE_SIZE;
    currentPage.value = currentPage.value + 1;
    agents.value = agents.value.concat(res.result);
  }).catch(e=>{

  }).finally(()=>{
    loading.value = false;
  });
}

function showAgentDialog(){
  showDialog.value = true;
}

function insertAgent() {
  agentCache.value.id = undefined;
  submitting.value = true;
  axios.insertAgent(agentCache.value).then(res=>{
    agentCache.value.id = res.result;
    agents.value.unshift(agentCache.value);
    ElNotification({
      title: Notifications.SUCCESS,
      message: Notifications.SUCCESS,
      type: 'success',
    });
    showDialog.value = false;
  }).catch(e=>{
    ElNotification({
      title: Notifications.FAIL,
      message: Notifications.FAIL,
      type: 'error',
    });
  }).finally(()=>{
    submitting.value = false;
  });
}

</script>

<style scoped>

</style>