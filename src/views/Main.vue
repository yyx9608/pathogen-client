<template>
  <el-container class="main-container">
    <el-header class="header">
      <Header/>
    </el-header>
    <el-container class="sub-container">
      <el-aside class="aside list" style="overflow: auto;">
        <el-menu mode="horizontal" style="height: 50px; justify-content: center; align-items: center" :ellipsis="false">
          <el-sub-menu index="1" :disabled="labs.content.length < 1">
            <template #title>{{ selectedLab }}</template>
            <el-menu-item @click="onLabSelect(item.id, item.name)" v-for="(item,index) in labs.content" :key="item.id" :value="item.id" :label="item.name" :id="item.id" index="1-{{String(index)}}">{{item.name}}</el-menu-item>
          </el-sub-menu>
          <el-icon v-if="selectedLab !== Notifications.SELECT_LAB" class="max-h" :onclick="addTask"><CirclePlus /></el-icon>
        </el-menu>
        <el-skeleton v-if="currentLab.taskPager.content.length === 0 && currentLab.taskPager.loading" :rows="5" animated />
        <el-scrollbar v-if="currentLab.taskPager.content.length > 0"  class="tasks">
          <ul v-infinite-scroll="loadMoreTask" class="infinite-list list "
              :infinite-scroll-disabled="currentLab.taskPager.loading || !currentLab.taskPager.hasMore">
            <li @click="onTaskSelect(item.id)" class="infinite-list-item" v-for="item in currentLab.taskPager.content" :key="item" >{{ item.name }}</li>
          </ul>
          <p v-if="currentLab.lab !== undefined && currentLab.taskPager.content.length > 0 && currentLab.taskPager.loading">加载中...</p>
          <p v-if="currentLab.lab !== undefined && currentLab.taskPager.content.length > 0 && !currentLab.taskPager.hasMore">我是有底线的</p>
        </el-scrollbar>
      </el-aside>
      <el-main>
        <TaskPanel v-if="currentTask.taskId !== ''" @delete="deleteTask" :task-id="currentTask.taskId"></TaskPanel>
        <el-empty v-if="currentTask.taskId === ''" description="empty view" />
      </el-main>
    </el-container>
    <el-dialog v-model="showAddTask" destroy-on-close>
      <TaskViewer ref="taskViewer" :action="Action.INSERT" @onTaskCreate="onTaskCreated" :create-task-request="request"/>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="showAddTask = false">{{ Notifications.CANCEL }}</el-button>
        <el-button type="primary" @click="submitNewTask">{{ Notifications.CONFIRM }}</el-button>
      </span>
      </template>
    </el-dialog>
  </el-container>

</template>

<script lang="ts" setup>

import {ref, onMounted, Ref} from 'vue';
import axios from '../dao/interface';
import { ElMessage, genFileId, UploadInstance, UploadProps, UploadRawFile } from 'element-plus';
import {BasePagerRequest} from "../entity/request/BasePagerRequest";
import {Lab} from "../entity/response/Lab";
import {Pager} from "../entity/Pager";
import {Task} from "../entity/response/Task";
import {TasksPagerRequest} from "../entity/request/TasksPagerRequest";
import {Group} from "../entity/response/Group";
import {SampleInfo} from "../entity/response/SampleInfo";
import {RxWebSocket} from "../plugin/message/RxWebSocket";
import TaskPanel from "./widgets/TaskPanel.vue";
import {DataInLab} from "../entity/local/DataInLab";
import {DataInTask} from "../entity/local/DataInTask";
import Header from "./widgets/Header.vue";
import {Notifications} from '../constants/Constants';
import NewTask from "./widgets/CreateTaskPanel.vue";
import TaskViewer from "./widgets/CreateTaskPanel.vue";
import {Action} from "../entity/enums/local/Action";
import {CreateTaskRequest} from '../entity/request/CreateTaskRequest';

/**
 * list of labs
 */
const labs = ref<Pager<Lab>>(new Pager<Lab>()) as Ref<Pager<Lab>>;
const selectedLab = ref<string>(Notifications.SELECT_LAB) as Ref<string>;

/**
 * data in lab
 */

const currentLab = ref<DataInLab>(new DataInLab()) as Ref<DataInLab>;
const request = new CreateTaskRequest();

/**
 * data in task
 */

const currentTask = ref<DataInTask>(new DataInTask()) as Ref<DataInTask>;

const showAddTask = ref<boolean>(false) as Ref<boolean>;
const taskViewer = ref();


RxWebSocket.init();

onMounted(() => {
  queryLabs()
  initWebSocket();
})

function initWebSocket() {
  //todo websocket
}

function queryLabs() {
  axios.queryLabs(new BasePagerRequest()).then(res=>{
    labs.value.content = res.result;
  }).catch(e=>{
    ElMessage.error("获取实验室列表失败")
  })
}

function deleteTask(taskId: string) {
  let i = -1;
  currentLab.value.taskPager.content.forEach((value,index)=>{
    if (value.id === taskId){
      i = index;
    }
  });
  if (i !== -1){
    currentLab.value.taskPager.content.splice(i,1);
    currentTask.value.taskId = '';
  }
}

function addTask() {
  showAddTask.value = true;
}

function onTaskCreated(createTaskRequest: CreateTaskRequest) {
  currentLab.value.taskPager.content.unshift(createTaskRequest.task);
  showAddTask.value = false;
}

function submitNewTask() {
  taskViewer.value.submit();
}

function onLabSelect(labId : string, labName : string) {
  if (labId === currentLab.value.lab){
    return;
  }
  selectedLab.value = labName;
  request.task.lab = labId;
  currentLab.value.lab = labId;
  //clear task array
  currentLab.value.taskPager = new Pager<Task>();
  //clear samples in task
  currentTask.value = new DataInTask();
  //query tasks by lab id
  queryTaskList(currentLab.value.lab, currentLab.value.taskPager.currentPage);
}

/**
 * 任务列表滚动到底部时调用，加载更多数据
 */
function loadMoreTask() {
  if (!currentLab.value.taskPager.hasMore || currentLab.value.taskPager.loading){
    return;
  }
  let labId = currentLab.value.lab;
  let currentPage = currentLab.value.taskPager.currentPage+1;
  queryTaskList(labId, currentPage);
}

/**
 * 分页查询任务列表
 * @param labId 当前实验室id
 * @param pageNum 当前页码
 */
function queryTaskList(labId :string, pageNum : number){
  currentLab.value.taskPager.loading = true;
  let request = new TasksPagerRequest(labId);
  request.currentPage = pageNum;
  axios.taskList(request).then(res=>{
    currentLab.value.taskPager.currentPage = pageNum;
    currentLab.value.taskPager.hasMore = (res.result.length === request.pageSize);
    currentLab.value.taskPager.content = currentLab.value.taskPager.content.concat(res.result);
  }).catch(e=>{
    console.error(e);
  }).finally(()=>{
    currentLab.value.taskPager.loading = false;
  });
}

function onTaskSelect(taskId : string){
  if (taskId === currentTask.value.taskId){
    return;
  }
  //reset current task
  currentTask.value.taskId = taskId;

  //task详情放到TaskPanel组件中处理
  /**
  currentTask.value.task = new Task();
  currentTask.value.samples = new Group<string, SampleInfo[]>();
  //fetch task detail
  let task = new Task();
  task.id = taskId;
  axios.task(task).then(res=>{
    currentTask.value.task = res.result;
  }).catch(e=>{
    console.error(e)
  })
   */
}

</script>

<style lang="scss" scoped>

.main-container {
  width: 100%;
  height: 100%;
}

.sub-container {
  width: 100%;
  height: calc(100% - 50px);
}

.add-task {
  width: 130px;
}

.tasks {
  height: calc(100% - 100px);
}

.aside {
  width: 200px;
  margin-top: 50px;
}

.infinite-list .infinite-list-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  background: var(--el-color-primary-light-9);
  margin: 10px;
  color: var(--el-color-primary);
}

.list {
  padding: 0;
  margin: 0;
  list-style: none;
}

</style>
