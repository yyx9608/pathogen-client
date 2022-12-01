<template>

  <div style="text-align: -webkit-center">
      <el-form :model="result" :disabled="action===Action.VIEW" label-position="right">
        <el-form-item class="form-item" label="报告区域" label-width="150px" :prop="result.status">
          <el-select v-model="result.status" :placeholder="result.status">
            <el-option :key="ResultStatus.MAIN" :label="ResultStatus.MAIN" :value="ResultStatus.MAIN" :disabled="result.status === ResultStatus.MAIN"/>
            <el-option :key="ResultStatus.GRAY" :label="ResultStatus.GRAY" :value="ResultStatus.GRAY" :disabled="result.status === ResultStatus.GRAY"/>
            <el-option :key="ResultStatus.BACKGROUND" :label="ResultStatus.BACKGROUND" :value="ResultStatus.BACKGROUND" :disabled="result.status === ResultStatus.BACKGROUND"/>
            <el-option :key="ResultStatus.HIDE" :label="ResultStatus.HIDE" :value="ResultStatus.HIDE" :disabled="result.status === ResultStatus.HIDE"/>
          </el-select>
        </el-form-item>
        <el-form-item class="form-item" label="初始报告区域" label-width="150px" :prop='result.rawStatus'>
          <el-input v-model="result.rawStatus" disabled/>
        </el-form-item>
        <el-form-item class="form-item" label="信号强度" label-width="150px" :prop='result.sign'>
          <el-select v-model="result.sign" :placeholder="result.sign">
            <el-option :key="Sign.HIGH" :label="Sign.HIGH" :value="Sign.HIGH" :disabled="result.sign === Sign.HIGH"/>
            <el-option :key="Sign.MID" :label="Sign.MID" :value="Sign.MID" :disabled="result.sign === Sign.MID"/>
            <el-option :key="Sign.LOW" :label="Sign.LOW" :value="Sign.LOW" :disabled="result.sign === Sign.LOW"/>
          </el-select>
        </el-form-item>
        <el-form-item class="form-item" label="病原" label-width="150px">
          <el-autocomplete
              v-model="selectedPathogen.name"
              :fetch-suggestions="searchPathogen"
              @select="handleSelect"/>
          <el-popover trigger="hover" width="80%">
            <template #reference>
              <el-icon class="margin-left-10"><InfoFilled /></el-icon>
            </template>
            <PathogenPanel :pathogen-id="selectedPathogen.id"></PathogenPanel>
          </el-popover>
        </el-form-item>
        <el-form-item class="form-item" label="样本类型" label-width="150px" :prop='result.sampleType'>
          <el-input v-model="result.sampleType" />
        </el-form-item>
        <el-form-item class="form-item" label="报告标签" label-width="150px" :prop='result.reportTag'>
          <el-input v-model="result.reportTag" />
        </el-form-item>
        <el-form-item class="form-item" label="reads" label-width="150px" :prop='result.readsNums'>
          <el-input v-model="result.readsNums" />
        </el-form-item>
        <el-form-item class="form-item" label="copy nums" label-width="150px" :prop='result.copyNums'>
          <el-input v-model="result.copyNums" />
        </el-form-item>
        <el-form-item class="form-item" label="mapping reads" label-width="150px" :prop='result.mappingReads'>
          <el-input v-model="result.mappingReads" />
        </el-form-item>
        <el-form-item class="form-item" label="q30 reads" label-width="150px" :prop='result.q30Reads'>
          <el-input v-model="result.q30Reads" />
        </el-form-item>
        <el-form-item class="form-item" label="该病原同批检出数" label-width="150px" :prop='result.pathogensNums'>
          <el-input v-model="result.pathogensNums" />
        </el-form-item>
      </el-form>
    <el-button v-if="action === Action.EDIT || action === Action.INSERT" :loading="submitForm" :onclick="clickBtn">保存</el-button>
    <el-button v-if="action === Action.VIEW" :loading="submitForm" :onclick="clickBtn">返回</el-button>
  </div>

</template>

<script lang="ts" setup>

import {AnalysisResult} from "../../entity/response/AnalysisResult";
import {ResultStatus} from "../../entity/enums/ResultStatus";
import {Ref, watch} from "vue";
import {ref} from "@vue/reactivity";
import {Action} from "../../entity/enums/local/Action";
import {Sign} from "../../entity/enums/Sign";
import {Pathogen} from "../../entity/response/Pathogen";
import axios from "../../dao/interface";
import {SearchRequest} from "../../entity/request/SearchRequest";
import PathogenPanel from "./PathogenPanel.vue";
import {ElNotification} from "element-plus";
import {Notifications} from "../../constants/Constants";

const props = defineProps<{ analysisResult : AnalysisResult, action : Action}>();
const emits = defineEmits(['update','insert','exit']);

const result = ref<AnalysisResult>(new AnalysisResult()) as Ref<AnalysisResult>;
const action = ref<Action>(Action.VIEW) as Ref<Action>;
const selectedPathogen = ref<Pathogen>(new Pathogen()) as Ref<Pathogen>;
const recommendPathogenList = ref<Pathogen[]>([]) as Ref<Pathogen[]>;
const submitForm = ref<boolean>(false) as Ref<boolean>;

watch(
    () => props.analysisResult,
    (newValue, oldValue) => {
      result.value = newValue;
      queryPathogen();
    },{
      deep : true,
      immediate : true
    }
)

watch(
    () => props.action,
    (newValue, oldValue) => {
      action.value = newValue;
    },
    {
      deep : true,
      immediate : true
    }
)

const handleSelect = (item: Pathogen) => {
  selectedPathogen.value = item;
}

function queryPathogen() {
  if (result.value.pathogenId !== undefined){
    const request = new Pathogen();
    request.id = result.value.pathogenId;
    axios.pathogenQuery(request).then(res=>{
      selectedPathogen.value = res.result;
    }).catch((e)=>{
      console.error(e);
    })
  }
}

function searchPathogen(queryString: string, cb : any) {
  if (queryString.length < 1 || queryString.length > 84){
    return;
  }
  const searchRequest = new SearchRequest();
  searchRequest.keyWord = queryString;
  axios.pathogenSearch(searchRequest).then((res)=>{
    const convertedPathogenList = res.result.map((v) => {
      const tmp : any = v;
      tmp.value = v.name;
      return tmp;
    })
    recommendPathogenList.value = res.result;
    cb(convertedPathogenList);
  }).catch(e=>{
    console.error(e)
  }).finally(()=>{

  })
}

function clickBtn() {
  result.value.pathogenId = selectedPathogen.value.id;
  if (action.value === Action.VIEW){
    //直接退出
    close();
  } else if (action.value === Action.EDIT) {
    //审核
    verifyResult();
  } else if (action.value === Action.INSERT){
    insertResult();
  }
}

function insertResult() {
  const copyResult = Object.assign(new AnalysisResult(),result.value);
  copyResult.id = undefined;
  submitForm.value = true;
  axios.addResult(copyResult).then(res=>{
    copyResult.id = res.result;
    ElNotification({
      title: Notifications.SUCCESS,
      message: res.result,
      type: 'success',
    });
    notifyInsert(copyResult);
    close();
  }).catch(e=>{
    ElNotification({
      title: Notifications.FAIL,
      message: Notifications.FAIL,
      type: 'error',
    });
    console.error(e);
  }).finally(()=>{
    submitForm.value = false;
  });
}

function notifyUpdate() {
  emits('update', result.value);
}

function notifyInsert(r : AnalysisResult) {
  emits('insert', r);
}

function close() {
  emits('exit');
}

function verifyResult() {
  submitForm.value = true;
  axios.resultVerify(result.value).then(res=>{
    ElNotification({
      title: Notifications.SUCCESS,
      message: res.msg,
      type: 'success',
    });
    notifyUpdate();
    close();
  }).catch(e=>{
    ElNotification({
      title: Notifications.FAIL,
      message: Notifications.FAIL,
      type: 'error',
    });
    console.error(e);
  }).finally(()=>{
    submitForm.value = false;
  });
}

</script>

<style scoped>

</style>