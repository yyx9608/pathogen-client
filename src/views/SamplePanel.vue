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
                    <el-dropdown-item :command='Command.GENERATE_REPORT' disabled icon="DocumentAdd">
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
          <el-scrollbar max-height="500px">
            <el-descriptions direction="vertical" :column="10" :title="dataInSample.sampleInfo.name" border size="small">
              <el-descriptions-item label="样本编号" span="2">{{ dataInSample.sampleInfo.sampleId }}</el-descriptions-item>
              <el-descriptions-item label="报告" span="8">
                <div v-if="dataInSample.sampleInfo.reportFile !== undefined">{{ dataInSample.sampleInfo.reportFile }}</div>
                <button v-if="dataInSample.sampleInfo.reportFile === undefined">生成报告</button>
              </el-descriptions-item>
              <el-descriptions-item label="样本状态" span="2">{{ dataInSample.sampleInfo.status }} </el-descriptions-item>
              <el-descriptions-item label="性别" span="2">{{ dataInSample.sampleInfo.sex }} </el-descriptions-item>
              <el-descriptions-item label="年龄" span="2">{{ dataInSample.sampleInfo.age }} </el-descriptions-item>
              <el-descriptions-item label="电话" span="2">{{ dataInSample.sampleInfo.phoneNum }} </el-descriptions-item>
              <el-descriptions-item label="身份证" span="2">{{ dataInSample.sampleInfo.identityCardNum }} </el-descriptions-item>
              <el-descriptions-item label="代理商" span="2">{{ dataInSample.sampleInfo.agent }} </el-descriptions-item>
              <el-descriptions-item label="送检单位" span="2">{{ dataInSample.sampleInfo.hospital }} </el-descriptions-item>
              <el-descriptions-item label="送检医生" span="2">{{ dataInSample.sampleInfo.doctor }} </el-descriptions-item>
              <el-descriptions-item label="送检科室" span="2">{{ dataInSample.sampleInfo.office }} </el-descriptions-item>
              <el-descriptions-item label="床号" span="2">{{ dataInSample.sampleInfo.sickbedNum }} </el-descriptions-item>
              <el-descriptions-item label="病历号" span="2">{{ dataInSample.sampleInfo.medicalRecordNum }} </el-descriptions-item>
              <el-descriptions-item label="是否付费" span="2">{{ dataInSample.sampleInfo.paymentStatus }} </el-descriptions-item>
              <el-descriptions-item label="医院检测结果" span="2">{{ dataInSample.sampleInfo.resultFromHospital }} </el-descriptions-item>
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
      <el-container>
        <el-skeleton v-if="fetchingResult" :rows="10" animated />
        <el-table :data="dataInSample.results" style="width: 100%" @cell-mouse-enter="showPathogen">
          <el-table-column prop="sign" label="信号强度"/>
          <el-table-column prop="status" label="报告区域"/>
          <el-table-column prop="rawStatus" label="初始报告区域"/>
          <el-table-column label="病原">
            <template #default="scope">
              <el-popover trigger="click" width="80%">
                <PathogenPanel :pathogen-id="selectedPathogen"></PathogenPanel>
                <template #reference>
                  {{ scope.row.pathogenId }}
                </template>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column prop="sampleType" label="样本类型" />
          <el-table-column prop="reportTag" label="报告标签" />
          <el-table-column prop="readsNums" label="reads" />
          <el-table-column prop="copyNums" label="copy nums" />
          <el-table-column prop="mappingReads" label="mapping reads" />
          <el-table-column prop="q30Reads" label="q30 reads" />
          <el-table-column prop="pathogensNums" label="该病原体同批检出数量" />
        </el-table>
      </el-container>
    </el-container>
  </el-scrollbar>
</template>

<script lang="ts" setup>

import {Ref, ref, watch} from "vue";
import {DataInSample} from "../entity/local/DataInSample";
import axios from "../dao/interface";
import {SampleInfo} from "../entity/response/SampleInfo";
import {QueryResultRequest} from "../entity/request/QueryResultRequest";
import {AnalysisResult} from "../entity/response/AnalysisResult";
import {ExportRequest} from "../entity/request/ExportRequest";
import {DownloadEntry} from "../entity/enums/DownloadEntry";
import {DownloadHelper} from "../utils/DownloadHelper";
import {ElNotification} from "element-plus";
import PathogenPanel from "./PathogenPanel.vue";

const props = defineProps<{ sampleId : string }>();
const dataInSample = ref<DataInSample>(new DataInSample()) as Ref<DataInSample>;
const fetchingSampleInfo = ref<boolean>(false) as Ref<boolean>;
const fetchingResult = ref<boolean>(false) as Ref<boolean>;
const selectedPathogen = ref<string|undefined>('') as Ref<string|undefined>;

class Command {
  static readonly GENERATE_REPORT : string = 'generateReport';
  static readonly POST_REPORT : string = 'postReport';
  static readonly EXPORT_REPORT : string = 'exportReport';
  static readonly VERIFY : string = 'verify';
}

const handleCommand = (command: string | number | object) => {
  if (command === Command.EXPORT_REPORT){
    exportReport();
  }
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
      title: 'Error',
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
    }
)

function showPathogen(row : AnalysisResult, column : any, cell : any, event : any){
  if (column.label === '病原'){
    selectedPathogen.value = row.pathogenId;
  }
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
    dataInSample.value.results = res.result;
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
  }).catch(e=>{
    console.error(e);
  }).finally(()=>{
    fetchingSampleInfo.value = false;
  });
}

</script>

<style scoped>

</style>