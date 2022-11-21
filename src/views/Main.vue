<template>
  <el-container class="main-container">

    <el-header height="50px">
      <el-menu
          :default-active="activeIndex"
          class="el-menu-demo"
          mode="horizontal"
          :ellipsis="false">
        <el-sub-menu index="1" :disabled="labs.content.length < 1">
          <template #title>{{ selectedLab }}</template>
          <el-menu-item @click="onLabSelect(item.id, item.name)" v-for="(item,index) in labs.content" :key="item.id" :value="item.id" :label="item.name" :id="item.id" index="1-{{String(index)}}">{{item.name}}</el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-header>
    <el-container>
      <el-aside width="100px">
        <el-scrollbar>
          <p v-for="item in currentLab.taskPager.content" :key="item.id" @click="onTaskSelect(item.id)" class="infinite-list-item">{{ item.name }}</p>
        </el-scrollbar>

      </el-aside>
      <el-main>Main</el-main>
    </el-container>
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
import {Group} from "../entity/response/SamplesGroupByAgent";
import {SampleInfo} from "../entity/response/SampleInfo";
import TaskPanel from "./TaskPanel.vue";

/**
 * list of labs
 */
let labs = ref<Pager<Lab>>(new Pager<Lab>()) as Ref<Pager<Lab>>;
let selectedLab = ref<string>("选择实验室") as Ref<string>;

/**
 * data in lab
 */
class DataInLab {
  lab : string = '';
  taskPager : Pager<Task> = new Pager<Task>();
}
let currentLab = ref<DataInLab>(new DataInLab()) as Ref<DataInLab>;

/**
 * data in task
 */
class DataInTask {
  taskId : string = '';
  task : Task = new Task();
  samples : Group<string, SampleInfo[]> = new Group<string, SampleInfo[]>();
}
let currentTask = ref<DataInTask>(new DataInTask()) as Ref<DataInTask>;

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

function onLabSelect(labId : string, labName : string) {
  if (labId === currentLab.value.lab){
    return;
  }
  selectedLab.value = labName;
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
  currentLab.value.taskPager.loading = true;
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
}

</script>

<style lang="scss" scoped>

.main-container {
  width: 100%;
  height: 100%;
}

.example-showcase .el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  /*align-items: center;*/
}

.layout-container-demo .el-header {
  position: relative;
  background-color: var(--el-color-primary-light-7);
  color: var(--el-text-color-primary);
}

.layout-container-demo .el-aside {
  color: var(--el-text-color-primary);
  background: var(--el-color-primary-light-8);
}

.layout-container-demo .el-menu {
  border-right: none;
}

.layout-container-demo .el-main {
  padding: 0;
}

.layout-container-demo .toolbar {
  display: inline-flex;
  /*align-items: center;*/
  /*justify-content: center;*/
  height: 100%;
  right: 20px;
}
</style>
