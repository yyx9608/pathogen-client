<template>

  <div class="common-layout">
    <el-container>

      <el-header class="header">
        <Header/>
      </el-header>

      <el-main style="height: 100%; background-color: lightgrey;">

        <SamplePanel :sample-id="sampleId"></SamplePanel>

      </el-main>

    </el-container>
  </div>

</template>

<script lang="ts" setup>
import SamplePanel from "./widgets/SamplePanel.vue";
import {onMounted, Ref, ref} from "vue";
import Header from "./widgets/Header.vue";
import {useRouter} from "vue-router";

const sampleId = ref(useRouter().currentRoute.value.query.id) as Ref<string>;

</script>

<style scoped>

</style>