<template>
  <div class="common-layout">
    <el-header class="header">
      <Header/>
    </el-header>

    <el-main>
      <el-container style="text-align: -webkit-center;" direction="vertical">
        <el-row>
          <el-col :span="24">
            <el-input style="width: 50%;" v-model="keyWord" placeholder="输入关键字">
              <template #append>
                <el-button :onclick="searchInfo" :icon="Search" />
              </template>
            </el-input>
          </el-col>
          <el-col :span="24">
            <el-radio-group style="width: 50%;" v-model="target">
              <el-radio :label="SearchTarget.PATHOGEN" size="large">{{ SearchTarget.PATHOGEN }}</el-radio>
              <el-radio :label="SearchTarget.TASK" size="large">{{ SearchTarget.TASK }}</el-radio>
              <el-radio :label="SearchTarget.SAMPLE" size="large">{{ SearchTarget.SAMPLE }}</el-radio>
              <el-radio :label="SearchTarget.RESULT" size="large">{{ SearchTarget.RESULT }}</el-radio>
            </el-radio-group>
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

enum SearchTarget {
  PATHOGEN = '病原',
  TASK = '任务',
  SAMPLE = '样本',
  RESULT = '检测结果',
}

const target = ref<SearchTarget>(SearchTarget.PATHOGEN) as Ref<SearchTarget>;
const keyWord = ref<string>('') as Ref<string>;
const searching = ref<boolean>(false) as Ref<boolean>;

function searchInfo(){
  if (keyWord.value.length < 1 || keyWord.value.length > 84){
    return;
  }
  if (target.value === SearchTarget.PATHOGEN){
    searchPathogen();
  } else if (target.value === SearchTarget.TASK){
    searchTask();
  } else if (target.value === SearchTarget.SAMPLE){
    searchSample();
  } else if (target.value === SearchTarget.RESULT){
    searchResult();
  }
}

function searchPathogen() {
  searching.value = true;
  setTimeout(function (){
    searching.value = false;
  },3000);
}

function searchTask() {

}

function searchSample() {

}

function searchResult() {

}

</script>

<style scoped>

.search {

}

</style>