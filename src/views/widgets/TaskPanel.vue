<template>

  <!-- 加载中显示骨架 -->
  <el-skeleton v-if="fetchingTask" :rows="10" animated />
  <!-- 加载成功显示 -->
  <el-container direction="vertical" v-if="currentTask.task.id !== undefined">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>{{ currentTask.task.name }}</span>
          <el-dropdown @command="handleCommand">
            <el-icon><Menu /></el-icon>
            <template #dropdown>
              <el-dropdown-menu >
                <el-dropdown-item icon="SwitchButton" :command='Command.START_TASK' :disabled='currentTask.task.status !== TaskStatus.INIT && currentTask.task.status !== TaskStatus.STOP'>
                  启动任务
                </el-dropdown-item>
                <el-dropdown-item icon="Warning" :command='Command.TERMINATE_TASK' :disabled='currentTask.task.status !== TaskStatus.RUNNING'>
                  中止任务
                </el-dropdown-item>
                <el-dropdown-item icon="Edit" :command='Command.EDIT_TASK' disabled>
                  编辑任务
                </el-dropdown-item>
                <el-dropdown-item icon="Document" divided :command='Command.SHOW_SAMPLES' :disabled='currentTask.task.status !== TaskStatus.COMPLETE'>
                  查看结果
                </el-dropdown-item>
                <el-dropdown-item icon="Link" :command='Command.EXPORT_RESULT' :disabled='downloading || currentTask.task.status !== TaskStatus.COMPLETE'>
                  导出审核表
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </template>
      <el-scrollbar max-height="400px">
        <el-descriptions
            direction="vertical"
            :column="4"
            border>
          <el-descriptions-item label="任务名" span="2">
            {{currentTask.task.name}}
          </el-descriptions-item>
          <el-descriptions-item label="任务状态" span="1">
            {{ currentTask.task.status }}
          </el-descriptions-item>
          <el-descriptions-item label="当前步骤" span="1">
            {{ currentTask.task.step }}
          </el-descriptions-item>
          <el-descriptions-item label="测序数据" span="4">
            <el-popover placement="bottom" trigger="hover" width="50%" v-show="showSequence()">
              <template #reference>
                <div>{{ currentTask.task.sequenceId }}</div>
              </template>
              <el-descriptions
                  v-loading="fetchingSequenceData"
                  direction="vertical"
                  :column="4"
                  border>
                <el-descriptions-item label="描述" span="2">
                  {{ sequenceData.desc }}
                </el-descriptions-item>
                <el-descriptions-item label="测序类型" span="2">
                  {{ sequenceData.sequenceType }}
                </el-descriptions-item>
                <el-descriptions-item label="远程路径" span="4">
                  {{ sequenceData.remotePath }}
                </el-descriptions-item>
                <el-descriptions-item label="本地路径" span="4">
                  {{ sequenceData.localPath }}
                </el-descriptions-item>
              </el-descriptions>
            </el-popover>
          </el-descriptions-item>
          <el-descriptions-item label="样本信息表" :span="4">
            {{ currentTask.task.sampleInfoFile }}
          </el-descriptions-item>
          <el-descriptions-item label="工作目录" :span="4">
            {{ currentTask.task.workDir }}
          </el-descriptions-item>
          <!--  todo  下载进度，接入消息推送后再写
          <el-descriptions-item v-if="currentTask.task.status === TaskStatus.RUNNING && currentTask.task.step === Step.DOWNLOAD_SEQUENCE_DATA" label="当前步骤" :span="4">
            {{ currentTask.task.step }}
            <el-progress :percentage="50"/>
          </el-descriptions-item>
          -->
        </el-descriptions>
      </el-scrollbar>
    </el-card>

    <el-drawer v-model="showDrawer" title="样本列表" :with-header="true">
      <el-skeleton v-if="fetchingSamples" :rows="10" animated />
      <el-collapse v-if="!fetchingSamples" accordion>
        <el-collapse-item v-for='item in currentTask.samples' :title='item.tag'>
          <ul>
            <li v-for='subItem in item.content' @mousedown="selectSample(subItem.id)">{{ subItem.name }} -- {{ subItem.status }}</li>
          </ul>
        </el-collapse-item>
      </el-collapse>
    </el-drawer>

    <el-divider v-if="selectedSample !== undefined && selectedSample !== ''" border-style="dashed" content-position="center">样本信息</el-divider>

    <SamplePanel v-if="selectedSample !== undefined && selectedSample !== ''" :sample-id='selectedSample'></SamplePanel>

  </el-container>

  <!-- 加载错误显示 -->
  <el-empty v-if="error" description="加载错误" />

</template>

<script lang="ts" setup>

import {TaskStatus} from "../../entity/enums/TaskStatus";
import {Ref, ref, watch} from "vue";
import {DataInTask} from "../../entity/local/DataInTask";
import axios from "../../dao/interface";
import {Task} from "../../entity/response/Task";
import {SequenceData} from "../../entity/response/SequenceData";
import {QuerySampleInfoRequest} from "../../entity/request/QuerySampleInfoRequest";
import {ElMessage, ElNotification} from "element-plus";
import SamplePanel from "./SamplePanel.vue";
import {ExportRequest} from "../../entity/request/ExportRequest";
import {DownloadEntry} from "../../entity/enums/DownloadEntry";
import {SampleInfo} from "../../entity/response/SampleInfo";
import {DownloadHelper} from "../../utils/DownloadHelper";
import {Notifications} from "../../constants/Constants";

const props = defineProps<{ taskId : string }>();
const currentTask = ref<DataInTask>(new DataInTask()) as Ref<DataInTask>;
const fetchingTask = ref<boolean>(false) as Ref<boolean>;
const error = ref<boolean>(false) as Ref<boolean>;
const sequenceData = ref<SequenceData>(new SequenceData()) as Ref<SequenceData>;
const fetchingSequenceData = ref<boolean>(false) as Ref<boolean>;
class Command {
  static readonly START_TASK : string = 'startTask';
  static readonly TERMINATE_TASK : string = 'terminateTask';
  static readonly EDIT_TASK : string = 'editTask';
  static readonly SHOW_SAMPLES : string = 'showSamples';
  static readonly EXPORT_RESULT : string = 'exportResult';
}
const fetchingSamples = ref<boolean>(false) as Ref<boolean>;
const showDrawer = ref<boolean>(false) as Ref<boolean>;
const downloading = ref<boolean>(false) as Ref<boolean>;

const selectedSample = ref<string>('') as Ref<string>;




currentTask.value.taskId = props.taskId;
queryTask();

watch(
    () => props.taskId,
    (newValue, oldValue) => {
      if (newValue !== oldValue){
        let nt = new DataInTask();
        nt.taskId = newValue;
        currentTask.value = nt;
        sequenceData.value = new SequenceData();
        queryTask();
      }
    }, {
      immediate : true,
      deep : true,
    }
)

const handleCommand = (command: string | number | object) => {
  if (command === Command.SHOW_SAMPLES){
    showSamples();
  } else if (command === Command.EDIT_TASK){
    editTask();
  } else if (command === Command.START_TASK){
    startTask();
  } else if (command === Command.TERMINATE_TASK){
    terminateTask();
  } else if (command === Command.EXPORT_RESULT){
    exportResult();
  }
}

function exportResult(){
  downloading.value = true;
  let downloadRequest = new ExportRequest();
  let sample = new SampleInfo();
  sample.task = currentTask.value.taskId;
  downloadRequest.entry = DownloadEntry.VERIFY;
  downloadRequest.payload = sample;
  axios.exportFile(downloadRequest).then(res=>{
    DownloadHelper.download(document, res);
  }).catch(e=>{
    console.error(e)
    ElNotification({
      title: Notifications.FAIL,
      message: e.message,
      type: 'error',
    })
  }).finally(()=>{
    downloading.value = false;
  })
}

function editTask() {
  console.log('edit task')
}

function terminateTask() {
  console.log('terminate task')
  const request = new Task();
  request.id = currentTask.value.taskId;
  axios.stopTask(request).then(res=>{
    ElNotification({
      title: Notifications.SUCCESS,
      message: res.result,
      type: 'success',
    });
    currentTask.value.task.status = TaskStatus.STOP;
  }).catch(e=>{
    ElNotification({
      title: Notifications.FAIL,
      message: Notifications.FAIL,
      type: 'error',
    });
    console.error(e);
  }).finally(()=>{

  });
}

function startTask() {
  console.log('start task')
  const request = new Task();
  request.id = currentTask.value.taskId;
  axios.startTask(request).then(res=>{
    ElNotification({
      title: Notifications.SUCCESS,
      message: res.result,
      type: 'success',
    });
    currentTask.value.task.status = TaskStatus.RUNNING;
  }).catch(e=>{
    ElNotification({
      title: Notifications.FAIL,
      message: Notifications.FAIL,
      type: 'error',
    });
    console.error(e);
  }).finally(()=>{

  });
}

function selectSample(sampleId : string){
  selectedSample.value = sampleId;
  showDrawer.value = false;
}

function showSamples() {
  if (currentTask.value.samples.length > 0){
    showDrawer.value = true;
    return;
  }
  fetchingSamples.value = true;
  showDrawer.value = true;
  let request = new QuerySampleInfoRequest();
  request.info.task = currentTask.value.taskId;
  axios.sampleInfoGroupByAgent(request).then(res=>{
    currentTask.value.samples = res.result;
  }).catch(e=>{
    ElMessage.error('加载样本信息失败')
  }).finally(()=>{
    fetchingSamples.value = false;
  });
}

/**
 * 获取测序数据
 */
function showSequence() {
  if (sequenceData.value.id !== undefined){
    return
  }
  fetchingSequenceData.value = true;
  let request = new SequenceData();
  request.id = currentTask.value.task.sequenceId;
  axios.querySeq(request).then(res=>{
    sequenceData.value = res.result;
  }).catch(e=>{
    console.error(e)
  }).finally(()=>{
    fetchingSequenceData.value = false;
  });
}

/**
 * 获取任务详情
 */
function queryTask(){
  fetchingTask.value = true;
  error.value = false;
  let task = new Task();
  task.id = currentTask.value.taskId;
  axios.task(task).then(res=>{
    currentTask.value.task = res.result;
  }).catch(e=>{
    error.value = true;
    console.error(e)
  }).finally(() => {
    fetchingTask.value = false;
  });
}

</script>

<style scoped>


</style>