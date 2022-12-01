<template>

  <el-row class="head">
    <div><el-icon :onclick="toHome"><House /></el-icon></div>
    <el-row>
      <div><el-icon :onclick="toAgents"><User /></el-icon></div>
      <div><el-icon :onclick="toSearch"><Search /></el-icon></div>
      <div><el-icon :onclick="toConfig"><Avatar /></el-icon></div>
    </el-row>
  </el-row>

</template>

<script lang="ts" setup>

import router from "../../router";


function toHome() {
  router.push({ name: 'main', replace : false });
}

function toConfig() {
  router.push({ name: 'config', replace : false });
}

function toSearch() {
  router.push({ name: 'search', replace : false });
}

function toAgents() {
  router.push({ name: 'agents', replace : false });
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