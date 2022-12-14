<template>
  <div class="common-layout">
    <el-header class="header">
      <Header/>
    </el-header>

    <el-main style="height: 100%; background-color: lightgrey;">
      <el-container style="text-align: -webkit-center;" direction="vertical">
        <el-row>
          <el-col :span="6">
            <el-select class="select" @change="onSelectChanged" v-model="target" :placeholder="SearchTarget.TASK" style="width: 115px">
              <el-option :label="SearchTarget.TASK" :value="SearchTarget.TASK" />
              <el-option :label="SearchTarget.SAMPLE" :value="SearchTarget.SAMPLE" />
            </el-select>
          </el-col>
          <el-col :span="8">
            <el-input v-if="target === SearchTarget.SAMPLE"
                      v-model="keyWord"
                      @change="onKeyWordChanged"
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
          <div v-if="(taskPager.loading && taskPager.content.length === 0) || (samplePager.loading && samplePager.content.length === 0)" style="width: 50%;">
            <el-skeleton :rows="10" animated />
          </div>

          <div v-if="target === SearchTarget.SAMPLE">
            <!--    样本信息展示区        -->
            <el-table @row-click="onTableItemClick" :data="samplePager.content" style="width: 100%">
              <el-table-column prop="id" label="id" width="180"/>
              <el-table-column prop="name" label="名称" width="180" />
              <el-table-column prop="sampleId" label="样本编号" width="180" />
            </el-table>
            <el-button v-if="samplePager.content.length > 0 && samplePager.hasMore" :loading="samplePager.content.length > 0 && samplePager.loading" :onclick="searchSample">加载更多</el-button>
          </div>

          <div v-if="target === SearchTarget.TASK">
            <!--    任务信息展示区        -->
            <el-table @row-click="onTableItemClick" :data="taskPager.content" style="width: 100%">
              <el-table-column prop="id" label="id" width="180"/>
              <el-table-column prop="name" label="名称" width="180" />
              <el-table-column prop="status" label="任务状态" width="180" />
            </el-table>
            <el-button v-if="taskPager.content.length > 0 && taskPager.hasMore" :loading="taskPager.content.length> 0 && taskPager.loading" :onclick="searchTask">加载更多</el-button>
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
import {SampleSearchRequest} from "../entity/request/SampleSearchRequest";
import router from "../router";
import {ComponentConstants} from "../constants/ComponentConstants";

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
const selectedDate = ref<[Date, Date]>([new Date(2022, 0, 1, 0, 0), new Date()]) as Ref<[Date,Date]>;

const samplePager = ref<Pager<SampleInfo>>(new Pager<SampleInfo>()) as Ref<Pager<SampleInfo>>;

function onSelectChanged(val : any) {
  showAside.value = true;
}

function onDateChanged(val : any) {
  if(val !== undefined){
    if (val[0] !== undefined && val[1] !== undefined){
      //日期改变
      selectedDate.value[0] = val[0];
      selectedDate.value[1] = val[1];
      if (target.value === SearchTarget.TASK) {
        taskPager.value = new Pager<Task>();
        //searchTask();
      } else if (target.value === SearchTarget.SAMPLE){
        samplePager.value = new Pager<SampleInfo>();
        //searchSample();
      }
    }
  }
}

function onKeyWordChanged(value : string|number){
  console.log('onKeyWordChanged ' + value);
  samplePager.value = new Pager<SampleInfo>();
}

function onTableItemClick(row : any, column : any, event : any){
  console.log('row ' + row + ' column ' + column + ' event ' + event);
  if (target.value === SearchTarget.TASK){
    router.push({
      name: ComponentConstants.TASK,
      replace : false,
      query : {
        id : row.id,
        timestamp : Date.now(),
      }
    });
  } else if (target.value === SearchTarget.SAMPLE){
    router.push({
      name: ComponentConstants.SAMPLE,
      replace : false,
      query : {
        id : row.id,
        timestamp : Date.now(),
      }
    });
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
  request.currentPage = taskPager.value.currentPage;
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
  if (samplePager.value.loading){
    return;
  }
  const request : SampleSearchRequest = new SampleSearchRequest();
  const createdCondition : DateCondition = new DateCondition();
  createdCondition.startTime = format(selectedDate.value[0],Notifications.DATE_TIME_FORMAT);
  createdCondition.endTime = format(selectedDate.value[1],Notifications.DATE_TIME_FORMAT);
  request.createdDateCondition = createdCondition;
  request.keyWord = keyWord.value;
  request.currentPage = samplePager.value.currentPage;
  samplePager.value.loading = true;
  axios.sampleSearch(request).then(res=>{
    samplePager.value.content = samplePager.value.content.concat(res.result);
    samplePager.value.currentPage += 1;
    samplePager.value.hasMore = (res.result.length === BasePagerRequest.DEFAULT_PAGE_SIZE);
    console.log(res);
  }).catch(e=>{
    console.error(e);
  }).finally(()=>{
    samplePager.value.loading = false;
  });

}

function searchResult() {

}

</script>

<style scoped>

.select{
  background-color: #B32929;
  color: #B32929;
}

</style>