<template>

  <el-container direction="vertical">
    <el-container>
      <el-skeleton v-if="fetchingSampleInfo" :rows="10" animated />
      <el-card v-if="!fetchingSampleInfo" class="box-card">
        <template #header>
          <div class="card-header">
            <span>{{ dataInSample.sampleInfo.name }}</span>
            <el-dropdown @command="handleCommand">
              <el-icon>
                <Tools />
              </el-icon>
              <template #dropdown>
                <el-dropdown-menu >
                  <el-dropdown-item icon="SwitchButton">
                    启动任务
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </template>
        <el-scrollbar max-height="500px">
          <el-descriptions
              direction="vertical"
              :column="4"
              border>
            <el-descriptions-item label="任务名" span="2">
              哈哈
            </el-descriptions-item>
          </el-descriptions>
        </el-scrollbar>
      </el-card>
    </el-container>
  </el-container>

</template>

<script lang="ts" setup>

import {Ref, ref, watch} from "vue";
import {DataInSample} from "../entity/local/DataInSample";
import axios from "../dao/interface";
import {SampleInfo} from "../entity/response/SampleInfo";

const props = defineProps<{ sampleId : string }>();
const dataInSample = ref<DataInSample>(new DataInSample()) as Ref<DataInSample>;
const fetchingSampleInfo = ref<boolean>(false) as Ref<boolean>;
const fetchingResult = ref<boolean>(false) as Ref<boolean>;

class Command {
  static readonly GENERATE_REPORT : string = 'generateReport';
  static readonly POST_REPORT : string = 'postReport';
  static readonly EXPORT_REPORT : string = 'exportReport';
  static readonly VERIFY : string = 'verify';
}

const handleCommand = (command: string | number | object) => {

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

function querySampleInfo() {
  let sample = new SampleInfo();
  sample.id = dataInSample.value.sampleId;
  fetchingSampleInfo.value = true;
  axios.querySample(sample).then(res=>{
    dataInSample.value.sampleInfo = res.result;
  }).catch(e=>{
    console.error(e);
  }).finally(()=>{
    fetchingSampleInfo.value = false;
  });
}

</script>

<style scoped>

</style>