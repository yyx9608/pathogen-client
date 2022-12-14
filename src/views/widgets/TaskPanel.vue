<template>

  <!-- 加载中显示骨架 -->
  <el-skeleton v-if="fetchingTask" :rows="10" animated />
  <!-- 加载成功显示 -->
  <el-scrollbar direction="vertical" v-if="currentTask.task.id !== undefined">
    <el-collapse v-model="activeCollapseItem" accordion>
      <el-collapse-item name="1">
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
                    <el-dropdown-item icon="Edit" :command='Command.REMOVE_TASK' :disabled="currentTask.task.status !== TaskStatus.ERROR">
                      删除任务
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

      </el-collapse-item>


<!--
      <el-collapse-item v-if="selectedSample !== undefined && selectedSample !== ''" name="2">
-->
        <el-divider v-if="selectedSample !== undefined && selectedSample !== ''" border-style="dashed" content-position="center"></el-divider>
        <SamplePanel v-if="selectedSample !== undefined && selectedSample !== ''" :sample-id='selectedSample'></SamplePanel>
<!--
      </el-collapse-item>
-->

    </el-collapse>

  </el-scrollbar>

  <!-- 加载错误显示 -->
  <el-empty v-if="error" description="加载错误" />

</template>

<script lang="ts" setup>

import {ElMessage, ElNotification} from "element-plus";
import {Ref, ref, watch} from "vue";
import {Notifications} from "../../constants/Constants";
import axios from "../../dao/interface";
import {DownloadEntry} from "../../entity/enums/DownloadEntry";
import {TaskStatus} from "../../entity/enums/TaskStatus";
import {DataInTask} from "../../entity/local/DataInTask";
import {BaseMessage} from "../../entity/message/BaseMessage";
import {MessageCode} from "../../entity/message/MessageCode";
import {Payload} from "../../entity/message/Payload";
import {SingleValuePayload} from "../../entity/message/SingleValuePayload";
import {UpdateTaskStepPayload} from "../../entity/message/UpdateTaskStepPayload";
import {ExportRequest} from "../../entity/request/ExportRequest";
import {QuerySampleInfoRequest} from "../../entity/request/QuerySampleInfoRequest";
import {SampleInfo} from "../../entity/response/SampleInfo";
import {SequenceData} from "../../entity/response/SequenceData";
import {Task} from "../../entity/response/Task";
import {RxWebSocket} from "../../plugin/message/RxWebSocket";
import {DownloadHelper} from "../../utils/DownloadHelper";
import SamplePanel from "./SamplePanel.vue";

const props = defineProps<{ taskId : string }>();
const emits = defineEmits(['delete']);
const currentTask = ref<DataInTask>(new DataInTask()) as Ref<DataInTask>;
const fetchingTask = ref<boolean>(false) as Ref<boolean>;
const error = ref<boolean>(false) as Ref<boolean>;
const sequenceData = ref<SequenceData>(new SequenceData()) as Ref<SequenceData>;
const fetchingSequenceData = ref<boolean>(false) as Ref<boolean>;
class Command {
  static readonly START_TASK : string = 'startTask';
  static readonly TERMINATE_TASK : string = 'terminateTask';
  static readonly REMOVE_TASK : string = 'removeTask';
  static readonly SHOW_SAMPLES : string = 'showSamples';
  static readonly EXPORT_RESULT : string = 'exportResult';
}
const fetchingSamples = ref<boolean>(false) as Ref<boolean>;
const showDrawer = ref<boolean>(false) as Ref<boolean>;
const downloading = ref<boolean>(false) as Ref<boolean>;

const selectedSample = ref<string>('') as Ref<string>;

const activeCollapseItem = ref<string>('1') as Ref<string>;

const subscription = RxWebSocket.register({
  next(msg :BaseMessage<any>){
    console.log('receive message [code] => ' + msg.code + ' payload =>' + msg.payload);
    if (msg.code === MessageCode.TASK_STEP_UPDATE){
      const updateMsg : Payload<UpdateTaskStepPayload> = JSON.parse(msg.payload);
      if (updateMsg.content!.taskId === currentTask.value.taskId){
        currentTask.value.task.step = updateMsg.content!.step;
      }
    } else if (msg.code === MessageCode.TASK_COMPLETE){
      const completeMsg : Payload<SingleValuePayload<string>> = JSON.parse(msg.payload);
      if (completeMsg.content!.value === currentTask.value.taskId){
        currentTask.value.task.status = TaskStatus.COMPLETE;
      }
    } else if (msg.code === MessageCode.TASK_ERROR){
      const errorMsg : Payload<SingleValuePayload<string>> = JSON.parse(msg.payload);
      if (errorMsg.content!.value === currentTask.value.taskId){
        currentTask.value.task.status = TaskStatus.ERROR;
      }
    } else if (msg.code === MessageCode.TASK_DOWNLOAD_SEQUENCE){
      //开始下载
    } else if (msg.code === MessageCode.TASK_DOWNLOAD_SEQUENCE_UPDATE){
      //下载进度更新
    } else if (msg.code === MessageCode.TASK_DOWNLOAD_COMPLETE){
      //下载完成
    }
  }
});

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
        currentTask.value.samples = [];
        selectedSample.value = '';
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
  } else if (command === Command.REMOVE_TASK){
    removeTask();
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

function removeTask() {
  axios.removeTask(currentTask.value.task).then(res=>{
    ElNotification({
      title: Notifications.SUCCESS,
      message: res.msg,
      type: 'success',
    });
    emits('delete', currentTask.value.taskId);
  }).catch(e=>{
    ElNotification({
      title: Notifications.FAIL,
      message: Notifications.FAIL,
      type: 'error',
    });
  }).finally(()=>{

  });
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
  activeCollapseItem.value = '2';
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
    activeCollapseItem.value = '1';
  }).catch(e=>{
    error.value = true;
    console.error(e)
  }).finally(() => {
    fetchingTask.value = false;
  });
}

</script>

<style scoped>


:deep(.el-card__header){
  background-color: #3E3F3F;
  font-weight: bolder;
  font-family: AlibabaSans;
  width: 100%;
  height: 40px;

}


</style>