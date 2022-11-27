<template>
  <div class="common-layout">
    <el-header class="header">
      <Header/>
    </el-header>

    <el-main>
      <el-input
          v-model="keyWord" placeholder="输入关键字">
        <template #append>
          <el-button :onclick="searchInfo" :icon="Search" />
        </template>
      </el-input>

      <el-radio-group v-model="target">
        <el-radio :label="SearchTarget.PATHOGEN" size="large">{{ SearchTarget.PATHOGEN }}</el-radio>
        <el-radio :label="SearchTarget.TASK" size="large">{{ SearchTarget.TASK }}</el-radio>
        <el-radio :label="SearchTarget.SAMPLE" size="large">{{ SearchTarget.SAMPLE }}</el-radio>
        <el-radio :label="SearchTarget.RESULT" size="large">{{ SearchTarget.RESULT }}</el-radio>
      </el-radio-group>
    </el-main>

  </div>>
</template>

<script lang="ts" setup>

import {Search} from "@element-plus/icons-vue";
import {ref} from "@vue/reactivity";
import {Ref} from "vue";
import Header from "./widgets/Header.vue";

enum SearchTarget {
  PATHOGEN = '病原',
  TASK = '任务',
  SAMPLE = '样本',
  RESULT = '检测结果',
}

const target = ref<SearchTarget>(SearchTarget.PATHOGEN) as Ref<SearchTarget>;
const keyWord = ref<string>('') as Ref<string>;

function searchInfo(){
  console.log('target => ' + target.value);
  console.log('key word => ' + keyWord.value);
}


</script>

<style scoped>

</style>