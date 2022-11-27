<template>

  <el-row class="head">
    <div><el-icon :onclick="toHome"><House /></el-icon></div>
    <el-row>
      <div><el-icon :onclick="toSearch"><Search /></el-icon></div>
      <div><el-icon :onclick="toConfig"><User /></el-icon></div>
    </el-row>
  </el-row>

</template>

<script lang="ts" setup>

import router from "../../router";


function toHome() {
  console.log('to homepage');
  router.push({ name: 'main', replace : false });
}

function toConfig() {
  console.log('to config');
  router.push({ name: 'config', replace : false });
}

function toSearch() {
  console.log('to search');
  router.push({ name: 'search', replace : false });
}

</script>

<style scoped>

.head {
  width: 100%;
  height: 50px;
  justify-content: space-between;
  align-content: center;
}

</style>