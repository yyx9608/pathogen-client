<template>
  <div class="common-layout">
    <el-header class="header">
      <Header/>
    </el-header>

    <el-main style="height: 100%; background-color: lightgrey;">
      <el-container style="text-align: -webkit-center;" direction="vertical">
        <el-row>
          <el-col :span="6">
            <el-select @change="onSelectChanged" v-model="target" :placeholder="SearchTarget.TASK" style="width: 115px">
              <el-option :label="SearchTarget.TASK" :value="SearchTarget.TASK" />
              <el-option :label="SearchTarget.SAMPLE" :value="SearchTarget.SAMPLE" />
            </el-select>
          </el-col>
          <el-col :span="8">
            <el-input v-if="target === SearchTarget.SAMPLE"
                      v-model="keyWord"
                      :placeholder="Notifications.INPUT_KEY_WORD"
                      class="input-with-select"></el-input>
          </el-col>
          <el-col :span="5">
            <el-date-picker
                v-model="selectedDate"
                type="datetimerange"
                :shortcuts="shortcuts"
                @change="onDateChanged"
                range-separator="到"
                :start-placeholder="Notifications.START_DATE_TIME"
                :end-placeholder="Notifications.END_DATE_TIME"/>
          </el-col>
          <el-col :span="5">
            <el-button :onclick="searchInfo" :icon="Search" />
          </el-col>
        </el-row>
        <div style="text-align: -webkit-center;">
          <div style="width: 50%;">
            <el-skeleton v-if="searching" :rows="10" animated />
          </div>
        </div>
      </el-container>
    </el-main>
  </div>
</template>

<script lang="ts" setup>

import {Search} from "@element-plus/icons-vue";
import {ref, Ref} from "vue";
import Header from "./widgets/Header.vue";
import {Notifications} from "../constants/Constants";
import {Task} from "../entity/response/Task";
import {SampleInfo} from "../entity/response/SampleInfo";
import axios from '../dao/interface';
import {SearchRequest} from "../entity/request/SearchRequest";
import {Pager} from "../entity/Pager";
import {BasePagerRequest} from "../entity/request/BasePagerRequest";
import {TaskSearchRequest} from "../entity/request/TaskSearchRequest";
import {DateCondition} from "../entity/request/condition/DateCondition";
import {format} from 'date-fns';

const shortcuts = [
  {
    text: '一周内',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    },
  },
  {
    text: '一个月内',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    },
  },
  {
    text: '3个月内',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      return [start, end]
    },
  },
]

enum SearchTarget {
  PATHOGEN = '病原',
  TASK = '任务',
  SAMPLE = '样本',
  RESULT = '检测结果',
}

const target = ref<SearchTarget>(SearchTarget.TASK) as Ref<SearchTarget>;
const keyWord = ref<string>('') as Ref<string>;
const searching = ref<boolean>(false) as Ref<boolean>;
const showAside = ref<boolean>(true) as Ref<boolean>;

const taskPager = ref<Pager<Task>>(new Pager<Task>()) as Ref<Pager<Task>>;
const sampleList = ref<SampleInfo[]>([]) as Ref<SampleInfo[]>;
const selectedDate = ref<[Date, Date]>([new Date(2022, 0, 1, 0, 0), new Date()]) as Ref<[Date,Date]>;

function onSelectChanged(val : any) {
  showAside.value = true;
}

function onDateChanged(val : any) {
  if(val !== undefined){
    if (val[0] !== undefined && val[1] !== undefined){
      //日期改变
      selectedDate.value[0] = val[0];
      selectedDate.value[1] = val[1];
      taskPager.value = new Pager<Task>();
      searchTask();
    }
  }
}

function searchInfo(){

  if (target.value === SearchTarget.PATHOGEN){
    searchPathogen();
  } else if (target.value === SearchTarget.TASK){
    searchTask();
  } else if (target.value === SearchTarget.SAMPLE){
    if (keyWord.value.length < 1 || keyWord.value.length > 84){
      return;
    }
    searchSample();
  } else if (target.value === SearchTarget.RESULT){
    searchResult();
  }
}

function closeAside() {
  showAside.value = false;
}

function searchPathogen() {
  searching.value = true;
  setTimeout(function (){
    searching.value = false;
  },3000);
}

function searchTask() {
  if (taskPager.value.loading){
    return;
  }
  const request : TaskSearchRequest = new TaskSearchRequest();
  const createdCondition : DateCondition = new DateCondition();
  createdCondition.startTime = format(selectedDate.value[0],Notifications.DATE_TIME_FORMAT);
  createdCondition.endTime = format(selectedDate.value[1],Notifications.DATE_TIME_FORMAT);
  request.createdDateCondition = createdCondition;
  taskPager.value.loading = true;
  axios.taskSearch(request).then(res=>{
    taskPager.value.content = taskPager.value.content.concat(res.result);
    taskPager.value.currentPage += 1;
    taskPager.value.hasMore = (res.result.length === BasePagerRequest.DEFAULT_PAGE_SIZE);
    console.log(res);
  }).catch(e=>{
    console.error(e);
  }).finally(()=>{
    taskPager.value.loading = false;
  });
}

function searchSample() {
  console.log('search sample');
}

function searchResult() {

}

</script>

<style scoped>

.search {

}

</style>