<template>

  <el-scrollbar>
    <el-container direction="vertical">
      <el-container>
        <el-skeleton v-if="fetchingSampleInfo" :rows="10" animated />
        <el-card v-if="!fetchingSampleInfo && dataInSample.sampleInfo.id !== undefined" class="box-card">
          <template #header>
            <div class="card-header">
              <span></span>
              <el-dropdown @command="handleCommand">
                <el-icon><Menu /></el-icon>
                <template #dropdown>
                  <el-dropdown-menu >
                    <el-dropdown-item :command='Command.VERIFY'
                                      :disabled='dataInSample.sampleInfo.status === SampleStatus.APPROVED || dataInSample.sampleInfo.status === SampleStatus.REPORTED
                                      || dataInSample.sampleInfo.status === SampleStatus.RE_SEQ'
                                      icon="Operation">
                      审核
                    </el-dropdown-item>
                    <el-dropdown-item :command='Command.GENERATE_REPORT'
                                      :disabled="dataInSample.sampleInfo.status !== SampleStatus.APPROVED" icon="DocumentAdd">
                      生成报告
                    </el-dropdown-item>
                    <el-dropdown-item :command='Command.POST_REPORT' disabled icon="Message">
                      发送报告
                    </el-dropdown-item>
                    <el-dropdown-item :command='Command.EXPORT_REPORT' :disabled='dataInSample.sampleInfo.reportFile === undefined' icon="Link">
                      导出报告
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </template>
          <el-scrollbar>
            <el-descriptions direction="vertical" :column="14" :title="dataInSample.sampleInfo.name" border size="default">
              <template #extra>
                <el-popover width="200" v-if="associatedSample.length > 0" placement="left" trigger="click">
                  <el-table max-height="600" :data="associatedSample" @row-click="onAssociatedSampleItemClicked" size="small">
                    <el-table-column width="150" property="createdAt" :label="Notifications.HISTORY_RECORDS" />
                  </el-table>
                  <template #reference>
                    <el-icon><Warning /></el-icon>
                  </template>
                </el-popover>
              </template>
              <el-descriptions-item label="样本编号" span="2">{{ dataInSample.sampleInfo.sampleId }}</el-descriptions-item>
              <el-descriptions-item label="报告" span="8">
                {{ dataInSample.sampleInfo.reportFile }}
              </el-descriptions-item>
              <el-descriptions-item label="样本状态" span="2">
                {{ dataInSample.sampleInfo.status }}
              </el-descriptions-item>
              <el-descriptions-item label="性别" span="2">{{ dataInSample.sampleInfo.sex }} </el-descriptions-item>
              <el-descriptions-item label="年龄" span="2">{{ dataInSample.sampleInfo.age }} </el-descriptions-item>
              <el-descriptions-item label="电话" span="2">{{ dataInSample.sampleInfo.phoneNum }} </el-descriptions-item>
              <el-descriptions-item label="身份证" span="2">{{ dataInSample.sampleInfo.identityCardNum }} </el-descriptions-item>
              <el-descriptions-item label="代理商" span="2">{{ dataInSample.sampleInfo.agent }} </el-descriptions-item>
              <el-descriptions-item label="送检单位" span="2">{{ dataInSample.sampleInfo.hospital }} </el-descriptions-item>
              <el-descriptions-item label="送检医生" span="2">{{ dataInSample.sampleInfo.doctor }} </el-descriptions-item>
              <el-descriptions-item label="送检科室" span="2">{{ dataInSample.sampleInfo.office }} </el-descriptions-item>
              <el-descriptions-item label="医院检测结果" span="14">{{ dataInSample.sampleInfo.resultFromHospital }} </el-descriptions-item>
              <el-descriptions-item label="床号" span="2">{{ dataInSample.sampleInfo.sickbedNum }} </el-descriptions-item>
              <el-descriptions-item label="病历号" span="2">{{ dataInSample.sampleInfo.medicalRecordNum }} </el-descriptions-item>
              <el-descriptions-item label="是否付费" span="2">{{ dataInSample.sampleInfo.paymentStatus }} </el-descriptions-item>
              <el-descriptions-item label="样本类型" span="2">{{ dataInSample.sampleInfo.sampleType }} </el-descriptions-item>
              <el-descriptions-item label="检测项目" span="2">{{ dataInSample.sampleInfo.analysisItem }} </el-descriptions-item>
              <el-descriptions-item label="核酸浓度" span="2">{{ dataInSample.sampleInfo.nucleicAcidConcentration }} </el-descriptions-item>
              <el-descriptions-item label="文库浓度" span="2">{{ dataInSample.sampleInfo.libraryConcentration }} </el-descriptions-item>
              <el-descriptions-item label="条码编号" span="2">{{ dataInSample.sampleInfo.barcodeNum }} </el-descriptions-item>
              <el-descriptions-item label="重点关注病原" span="2">{{ dataInSample.sampleInfo.majorPathogen }} </el-descriptions-item>
              <el-descriptions-item label="其他关注病原" span="2">{{ dataInSample.sampleInfo.otherPathogen }} </el-descriptions-item>
              <el-descriptions-item label="WBC 109/L" span="2">{{ dataInSample.sampleInfo.wbc }} </el-descriptions-item>
              <el-descriptions-item label="淋巴细胞 %" span="2">{{ dataInSample.sampleInfo.lymphocyte }} </el-descriptions-item>
              <el-descriptions-item label="中性粒细胞 %" span="2">{{ dataInSample.sampleInfo.neutrophil }} </el-descriptions-item>
              <el-descriptions-item label="CRP mg/L" span="2">{{ dataInSample.sampleInfo.crp }} </el-descriptions-item>
              <el-descriptions-item label="PCT ng/ml" span="2">{{ dataInSample.sampleInfo.pct }} </el-descriptions-item>
              <el-descriptions-item label="实验编号" span="2">{{ dataInSample.sampleInfo.experimentNum }} </el-descriptions-item>
              <el-descriptions-item label="检测内容" span="2">{{ dataInSample.sampleInfo.analysisContent }} </el-descriptions-item>
              <el-descriptions-item label="样本量" span="2">{{ dataInSample.sampleInfo.sampleCapacity }} </el-descriptions-item>
              <el-descriptions-item label="DNA体积" span="2">{{ dataInSample.sampleInfo.dnaVolume }} </el-descriptions-item>
              <el-descriptions-item label="Panel名称" span="2">{{ dataInSample.sampleInfo.panelName }} </el-descriptions-item>
              <el-descriptions-item label="内参批次" span="2">{{ dataInSample.sampleInfo.internalReferenceNum }} </el-descriptions-item>
              <el-descriptions-item label="标准样品批次" span="2">{{ dataInSample.sampleInfo.stdSampleNum }} </el-descriptions-item>
              <el-descriptions-item label="I7Barcode编号" span="2">{{ dataInSample.sampleInfo.i7BarcodeNum }} </el-descriptions-item>
              <el-descriptions-item label="I7Barcode序列" span="2">{{ dataInSample.sampleInfo.i7BarcodeSequence }} </el-descriptions-item>
              <el-descriptions-item label="I5Barcode编号" span="2">{{ dataInSample.sampleInfo.i5BarcodeNum }} </el-descriptions-item>
              <el-descriptions-item label="I5Barcode序列" span="2">{{ dataInSample.sampleInfo.i5BarcodeSequence }} </el-descriptions-item>
              <el-descriptions-item label="提取实验员" span="2">{{ dataInSample.sampleInfo.collectBy }} </el-descriptions-item>
              <el-descriptions-item label="建库实验员" span="2">{{ dataInSample.sampleInfo.labBy }} </el-descriptions-item>
              <el-descriptions-item label="防错标签" span="2">{{ dataInSample.sampleInfo.voidLabel }} </el-descriptions-item>
              <el-descriptions-item label="采样日期" span="2">{{ dataInSample.sampleInfo.samplingAt }} </el-descriptions-item>
            </el-descriptions>
          </el-scrollbar>
        </el-card>
      </el-container>

      <el-divider border-style="dashed" content-position="center">检测结果</el-divider>

      <el-container direction="vertical" v-if="sampleId !== undefined && sampleId !== ''">
        <el-skeleton v-if="fetchingResult" :rows="10" animated />
        <div class="flex justify-content-end margin10">
          <el-popover width="250" trigger="click">
            <template #reference>
              <el-icon><Operation /></el-icon>
            </template>
            <el-checkbox-group min="1" v-model="selectedColumns">
              <el-checkbox label="信号强度" />
              <el-checkbox label="报告区域" />
              <el-checkbox label="初始报告区域" />
              <el-checkbox label="病原" />
              <el-checkbox label="样本类型" />
              <el-checkbox label="报告标签" />
              <el-checkbox label="reads" />
              <el-checkbox label="copy nums" />
              <el-checkbox label="mapping reads" />
              <el-checkbox label="q30 reads" />
              <el-checkbox label="该病原体同批检出数量" />
            </el-checkbox-group>
          </el-popover>
        </div>
        <el-table :row-key="rowKey" :data="dataInSample.results" style="width: 100%" @cell-mouse-enter="showPathogen" highlight-current-row border size="default">
          <el-table-column v-if="selectedColumns.includes('信号强度')" align="center" prop="sign" label="信号强度"/>
          <el-table-column v-if="selectedColumns.includes('报告区域')" align="center" label="报告区域">
            <template #default="scope">
              <el-select v-model="dataInSample.results[scope.$index].status" @change="onStatusChanged(dataInSample.results[scope.$index])" :placeholder="dataInSample.results[scope.$index].status">
                <el-option :key="ResultStatus.MAIN" :label="ResultStatus.MAIN" :value="ResultStatus.MAIN" :disabled="dataInSample.results[scope.$index].status === ResultStatus.MAIN"/>
                <el-option :key="ResultStatus.GRAY" :label="ResultStatus.GRAY" :value="ResultStatus.GRAY" :disabled="dataInSample.results[scope.$index].status === ResultStatus.GRAY"/>
                <el-option :key="ResultStatus.BACKGROUND" :label="ResultStatus.BACKGROUND" :value="ResultStatus.BACKGROUND" :disabled="dataInSample.results[scope.$index].status === ResultStatus.BACKGROUND"/>
                <el-option :key="ResultStatus.HIDE" :label="ResultStatus.HIDE" :value="ResultStatus.HIDE" :disabled="dataInSample.results[scope.$index].status === ResultStatus.HIDE"/>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column v-if="selectedColumns.includes('初始报告区域')" align="center" prop="rawStatus" label="初始报告区域"/>
          <el-table-column v-if="selectedColumns.includes('病原')" align="center" label="病原">
            <template #default="scope">
              <el-popover trigger="click" width="80%">
                <PathogenPanel :pathogen-id="selectedPathogen"></PathogenPanel>
                <template #reference>
                  {{ (pathogenContentMap.get(scope.row.pathogenId) === undefined || pathogenContentMap.get(scope.row.pathogenId).id !== scope.row.pathogenId)
                    ? '病原id:' + scope.row.pathogenId : pathogenContentMap.get(scope.row.pathogenId).name }}
                </template>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column v-if="selectedColumns.includes('样本类型')" align="center" prop="sampleType" label="样本类型" />
          <el-table-column v-if="selectedColumns.includes('报告标签')" align="center" prop="reportTag" label="报告标签" />
          <el-table-column v-if="selectedColumns.includes('reads')" align="center" prop="readsNums" label="reads" />
          <el-table-column v-if="selectedColumns.includes('copy nums')" align="center" prop="copyNums" label="copy nums" />
          <el-table-column v-if="selectedColumns.includes('mapping reads')" align="center" prop="mappingReads" label="mapping reads" />
          <el-table-column v-if="selectedColumns.includes('q30 reads')" align="center" prop="q30Reads" label="q30 reads" />
          <el-table-column v-if="selectedColumns.includes('该病原体同批检出数量')" align="center" prop="pathogensNums" label="该病原体同批检出数量" />
          <el-table-column align="center" fixed="right" label="操作" width="120">
            <template #default="scope">
              <el-container style="justify-content: center">
                <el-button-group>
                  <el-button type="primary" size="small" icon="Edit" @click.prevent="editRow(scope.$index)"/>
                  <el-button type="primary" size="small" icon="DocumentCopy" @click.prevent="copyRow(scope.$index)"/>
                </el-button-group>
              </el-container>
            </template>
          </el-table-column>
        </el-table>
      </el-container>
    </el-container>
  </el-scrollbar>

  <el-drawer v-model="showEditDialog" size="100%" :title="selectedResult.name">
    <Result :action="resultAction" :analysis-result="selectedResult" @insert="insertResult" @update="updateResult" @exit="closeResult"/>
  </el-drawer>

  <el-dialog v-model="showVerifyDialog" title="审核样本">
    <el-form :model="verifyForm">
      <el-form-item label="审核">
        <el-select v-model="verifyForm.status" placeholder="选择样本审核结果">
          <el-option v-if="dataInSample.sampleInfo.status !== SampleStatus.APPROVED" :label="SampleStatus.APPROVED" :value='SampleStatus.APPROVED' />
          <el-option v-if="dataInSample.sampleInfo.status !== SampleStatus.DISCUSS" :label="SampleStatus.DISCUSS" :value="SampleStatus.DISCUSS" />
          <el-option v-if="dataInSample.sampleInfo.status !== SampleStatus.RE_SEQ" :label="SampleStatus.RE_SEQ" :value="SampleStatus.RE_SEQ" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button :onclick="cancelVerify">取消</el-button>
        <el-button type="primary" :onclick="verifySample" :disabled="verifyForm.status === undefined">
          提交
        </el-button>
      </span>
    </template>
  </el-dialog>

</template>

<script lang="ts" setup>

import {Ref, ref, watch} from "vue";
import {DataInSample} from "../../entity/local/DataInSample";
import axios from "../../dao/interface";
import {SampleInfo} from "../../entity/response/SampleInfo";
import {QueryResultRequest} from "../../entity/request/QueryResultRequest";
import {AnalysisResult} from "../../entity/response/AnalysisResult";
import {ExportRequest} from "../../entity/request/ExportRequest";
import {DownloadEntry} from "../../entity/enums/DownloadEntry";
import {DownloadHelper} from "../../utils/DownloadHelper";
import {ElNotification} from "element-plus";
import PathogenPanel from "./PathogenPanel.vue";
import {SampleStatus} from "../../entity/enums/SampleStatus";
import {Loading} from "../../utils/Loading";
import {Notifications} from "../../constants/Constants";
import {ResultStatus} from "../../entity/enums/ResultStatus";
import Result from "./ResultPanel.vue";
import {Action} from "../../entity/enums/local/Action";
import {Pathogen} from "../../entity/response/Pathogen";
import store from "../../store";
import router from "../../router";

const props = defineProps<{ sampleId : string }>();
const dataInSample = ref<DataInSample>(new DataInSample()) as Ref<DataInSample>;
const fetchingSampleInfo = ref<boolean>(false) as Ref<boolean>;
const fetchingResult = ref<boolean>(false) as Ref<boolean>;
const selectedPathogen = ref<string>('') as Ref<string>;
const pathogenContentMap = ref<Map<string,Pathogen>>(store.getters.getPathogenMap) as Ref<Map<string,Pathogen>>;
const associatedSample = ref<SampleInfo[]>([]) as Ref<SampleInfo[]>;

const showVerifyDialog = ref<boolean>(false) as Ref<boolean>;
const verifyForm = ref<SampleInfo>(new SampleInfo()) as Ref<SampleInfo>;

const showEditDialog = ref<boolean>(false) as Ref<boolean>;
const selectedResult = ref<AnalysisResult>(new AnalysisResult()) as Ref<AnalysisResult>;
const resultAction = ref<Action>(Action.VIEW) as Ref<Action>;

const selectedColumns = ref<string[]>([
    '信号强度','报告区域','初始报告区域','病原','样本类型','报告标签','reads','copy nums','mapping reads','q30 reads','该病原体同批检出数量'
]) as Ref<string[]>;

let nis = new DataInSample();
nis.sampleId = props.sampleId;
dataInSample.value = nis;
querySampleInfo();

class Command {
  static readonly GENERATE_REPORT : string = 'generateReport';
  static readonly POST_REPORT : string = 'postReport';
  static readonly EXPORT_REPORT : string = 'exportReport';
  static readonly VERIFY : string = 'verify';
}

const handleCommand = (command: string | number | object) => {
  if (command === Command.EXPORT_REPORT){
    exportReport();
  } else if (command === Command.VERIFY){
    showVerifyDialog.value = true;
  } else if (command === Command.GENERATE_REPORT){
    generateReport();
  }
}

function onAssociatedSampleItemClicked(row : SampleInfo, column : any, event : any){
  router.push({
    name: 'sample',
    replace : false,
    query : {
      id : row.id,
    }
  });
}

function onStatusChanged(val: AnalysisResult) {
  Loading.showSimpleLoading();
  axios.resultVerify(val).then(res=>{
    ElNotification({
      title: Notifications.SUCCESS,
      message: res.msg,
      type: 'success',
    });
  }).catch(e=>{
    ElNotification({
      title: Notifications.FAIL,
      message: Notifications.FAIL,
      type: 'error',
    });
  }).finally(()=>{
    Loading.hideSimpleLoading();
  });
}

function insertResult(r: AnalysisResult) {
  console.log('insertResult ' +r);
  dataInSample.value.results!.unshift(r);
}

function updateResult(r : AnalysisResult) {
  console.log('updateResult ' +r);
  dataInSample.value.results!.forEach((value,index) => {
    if (value.id === r.id){
      dataInSample.value.results![index] = r;
    }
  })
}

function closeResult() {
  console.log('exit');
  showEditDialog.value = false;
}

function rowKey(row : any){
  return row.id;
}

function editRow(index : number) {
  selectedResult.value = Object.assign(new AnalysisResult(), dataInSample.value.results![index]);
  resultAction.value = Action.EDIT;
  showEditDialog.value = true;
}

function copyRow(index : number){
  selectedResult.value = Object.assign(new AnalysisResult(),dataInSample.value.results![index]);
  resultAction.value = Action.INSERT;
  showEditDialog.value = true;
}

function generateReport() {
  Loading.showSimpleLoading();
  const sampleIds = [dataInSample.value.sampleId];
  axios.generateReport(sampleIds).then(res=>{
    let report = undefined;
    res.result.forEach(sampleInfo => {
      if (sampleInfo.id === dataInSample.value.sampleId){
        report = sampleInfo.reportFile;
      }
    })
    if (report !== undefined){
      dataInSample.value.sampleInfo.reportFile = report;
      ElNotification({
        title: Notifications.SUCCESS,
        message: Notifications.SUCCESS,
        type: 'success',
      });
    } else {
      ElNotification({
        title: Notifications.FAIL,
        message: Notifications.FAIL,
        type: 'error',
      });
    }
  }).catch(e=>{
    ElNotification({
      title: Notifications.FAIL,
      message: e.message,
      type: 'error',
    });
  }).finally(()=>{
    Loading.hideSimpleLoading();
  });
}

function cancelVerify() {
  showVerifyDialog.value = false;
}

function verifySample() {
  showVerifyDialog.value = false;
  verifyForm.value.id = props.sampleId;
  axios.sampleVerify(verifyForm.value).then(res=>{
    dataInSample.value.sampleInfo.status = verifyForm.value.status;
    verifyForm.value = new SampleInfo();
    ElNotification({
      title: Notifications.SUCCESS,
      message: res.msg,
      type: 'success',
    })
  }).catch(e=>{
    ElNotification({
      title: Notifications.FAIL,
      message: e.message,
      type: 'error',
    })
  })
}

function exportReport(){
  let downloadRequest = new ExportRequest();
  let sample = new SampleInfo();
  sample.id = dataInSample.value.sampleId;
  downloadRequest.entry = DownloadEntry.REPORT;
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
  })
}

watch(
    () => props.sampleId,
    (newValue, oldValue) => {
      if (newValue !== oldValue){
        let nis = new DataInSample();
        nis.sampleId = newValue;
        dataInSample.value = nis;
        querySampleInfo();
      }
    }, {
      immediate : true,
      deep : true,
    }
)

function showPathogen(row : AnalysisResult, column : any, cell : any, event : any){
  if (column.label === '病原'){
    selectedPathogen.value = row.pathogenId === undefined ? '' : row.pathogenId;
    queryPathogen(selectedPathogen.value);
  }
}

function queryPathogen(id : string){
  if (pathogenContentMap.value.has(id)){
    return;
  }
  const pathogen = new Pathogen();
  pathogen.id = id;
  return axios.pathogenQuery(pathogen).then(res=>{
    if (res.result.id !== undefined){
      pathogenContentMap.value.set(res.result.id, res.result);
    }
  }).catch(e=>{
    console.error(e)
  });
}

function queryResult(){
  fetchingResult.value = true;
  const request = new QueryResultRequest();
  const subParam = new AnalysisResult();
  subParam.sid = dataInSample.value.sampleInfo.sampleId;
  subParam.taskId = dataInSample.value.sampleInfo.task;
  request.result = subParam;
  request.pageSize = 100;
  axios.sampleResult(request).then(res=>{
    console.log(res);
    dataInSample.value.results = res.result;
    res.result.forEach(value => {
      if (value.pathogenId != null) {
        queryPathogen(value.pathogenId);
      }
    });
  }).catch(e=>{
    console.error(e)
  }).finally(()=>{
    fetchingResult.value = false;
  })
}

function querySampleInfo() {
  let sample = new SampleInfo();
  sample.id = dataInSample.value.sampleId;
  fetchingSampleInfo.value = true;
  axios.querySample(sample).then(res=>{
    dataInSample.value.sampleInfo = res.result;
    queryResult();
    queryAssociatedSample();
  }).catch(e=>{
    console.error(e);
  }).finally(()=>{
    fetchingSampleInfo.value = false;
  });
}

function queryAssociatedSample() {
  axios.associatedSample(dataInSample.value.sampleInfo).then(res=>{
    associatedSample.value = res.result;
  }).catch(e=>{
    console.error(e);
  }).finally(()=>{

  });
}

</script>

<style scoped>


</style>