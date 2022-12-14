<template>
<!--  <el-row>-->
  <el-row class="head">
<!--    <div><img src="../../assets/logo.png"/></div>-->
<!--    <div><img src="../../assets/logo.png"/></div>-->
<!--    <div><img src="../../assets/logo.png"/></div>-->
<!--    <div><el-icon :onclick="toHome"><House /></el-icon></div>-->
    <el-row class="head1">
      <img src="../../assets/logo.png"/>
      <el-icon :onclick="toHome"><HomeFilled /></el-icon>
<!--      <el-icon :onclick="toHome"><House /></el-icon>-->
    </el-row>
<!--    <el-row><div><el-icon :onclick="toHome"><House /></el-icon></div></el-row>-->
    <el-row>
      <div><el-icon :onclick="toAgents"><User /></el-icon></div>
      <div><el-icon :onclick="toSearch"><Search /></el-icon></div>
      <div><el-icon :onclick="toConfig"><Avatar /></el-icon></div>
    </el-row>
  </el-row>

</template>

<script lang="ts" setup>

import router from "../../router";
import {ComponentConstants} from "../../constants/ComponentConstants";


function toHome() {
  router.push({
    name: ComponentConstants.MAIN,
    replace : false,
    query : {
      timestamp : Date.now()
    }
  });
}

function toConfig() {
  router.push({
    name: ComponentConstants.CONFIG,
    replace : false,
    query : {
      timestamp : Date.now()
    }
  });
}

function toSearch() {
  router.push({
    name: ComponentConstants.SEARCH,
    replace : false,
    query : {
      timestamp : Date.now()
    }
  });
}

function toAgents() {
  router.push({
    name: 'agents',
    replace : false,
    query : {
      timestamp : Date.now()
    }
  });
}

</script>

<style scoped>

.head {
  width: 100%;
  height: 50px;
  justify-content: space-between;
  align-content: center;
  align-items: baseline;
}

.head1 {

  align-items: baseline;
}

</style>