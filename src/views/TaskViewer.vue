<template>

  <div style="text-align: -webkit-center">

    <el-form :model="createTaskRequest" :disabled="action===Action.VIEW" label-position="right">

      <el-form-item class="form-item" label="任务名称" label-width="200px" :prop='createTaskRequest.task.name'>
        <el-input v-model="createTaskRequest.task.name"/>
      </el-form-item>

      <el-form-item class="form-item" label="样本信息表" label-width="200px">
        <el-upload drag limit='1' action="#" :http-request="upload">
          <div class="el-upload__text">
            拖拽文件到此处或<em>点击上传</em>
          </div>
        </el-upload>
      </el-form-item>

      <el-form-item class="form-item" label="测序数据路径" label-width="200px">
        <el-input v-model="remotePath" class="input-with-select">
          <template #prepend>
            <el-select v-model="source" :placeholder="Source.LOCAL" style="width: 80px">
              <el-option :label="Source.HTTP" :value="Source.HTTP" />
              <el-option :label="Source.HTTPS" :value="Source.HTTPS" />
              <el-option :label="Source.FTP" :value="Source.FTP" />
              <el-option :label="Source.LOCAL" :value="Source.LOCAL" />
            </el-select>
          </template>
        </el-input>
      </el-form-item>

      <el-form-item class="form-item" label="测序数据类型" label-width="200px">
          <el-select v-model="createTaskRequest.sequenceData.sequenceType" :placeholder="createTaskRequest.sequenceData.sequenceType" style="width: 120px">
              <el-option :label="SequenceType.PE" :value="SequenceType.PE" />
              <el-option :label="SequenceType.SE" :value="SequenceType.SE" />
              <el-option :label="SequenceType.MP" :value="SequenceType.MP" />
          </el-select>
      </el-form-item>

      <el-form-item class="form-item" label="测序数据描述" label-width="200px">
        <el-input v-model="createTaskRequest.sequenceData.desc"/>
      </el-form-item>

    </el-form>

  </div>

</template>

<script lang="ts" setup>

import {Action} from "../entity/enums/local/Action";
import {Task} from "../entity/response/Task";
import {ref} from "@vue/reactivity";
import {Ref, watch} from "vue";
import {SequenceData} from "../entity/response/SequenceData";
import {Source} from "../entity/enums/Source";
import {RequestUrl} from "../plugin/axios/RequestUrl";
import {ElNotification, UploadFile, UploadFiles, UploadRequestOptions} from "element-plus";
import {Response} from "../entity/response/Response";
import {SequenceType} from "../entity/enums/SequenceType";
import {CreateTaskRequest} from "../entity/request/CreateTaskRequest";
import axios from '../dao/interface';
import {Notifications} from "../constants/Constants";
import {Loading} from "../utils/Loading";

const props = defineProps<{ createTaskRequest : CreateTaskRequest, action : Action}>();
const emits = defineEmits(['onTaskCreate']);
defineExpose({submit});


const createTaskRequest = ref<CreateTaskRequest>(new CreateTaskRequest()) as Ref<CreateTaskRequest>;
const action = ref<Action>(Action.VIEW) as Ref<Action>;
const loading = ref<boolean>(false) as Ref<boolean>;
const source = ref<Source>(Source.LOCAL) as Ref<Source>;
const remotePath = ref<string>('') as Ref<string>;

watch(
    () => props.createTaskRequest,
    (newValue, oldValue) => {
      createTaskRequest.value = newValue;
    },{
      deep : true,
      immediate : true
    }
)

watch(
    () => props.action,
    (newValue, oldValue) => {
      action.value = newValue;
    },{
      deep : true,
      immediate : true
    }
)

function submit(){
  if (loading.value){
    return;
  }
  Loading.showSimpleLoading();
  loading.value = true;
  createTaskRequest.value.sequenceData.remotePath = source.value + remotePath.value;
  axios.createTask(createTaskRequest.value).then(res=>{
    ElNotification({
      title: Notifications.SUCCESS,
      message: res.result,
      type: 'success',
    });
    createTaskRequest.value.task.id = res.result;
    emits('onTaskCreate', createTaskRequest.value);
  }).catch(e=>{
    ElNotification({
      title: Notifications.FAIL,
      message: Notifications.FAIL,
      type: 'error',
    });
    console.error(e);
  }).finally(()=>{
    loading.value = false;
    Loading.hideSimpleLoading();
  })
}

function upload(options: UploadRequestOptions) {
  const form = new FormData();
  form.append('file', options.file);
  return axios.submitUpload(form).then(res=>{
    createTaskRequest.value.task.sampleInfoFile = res.result;
    console.log(res);
    return new Promise(resolve => {
      resolve(res);
    })
  }).catch(e=>{
    console.error(e);
    return Promise.reject(e);
  }).finally(()=>{
    loading.value = false;
  })
}


</script>

<style scoped>

</style>