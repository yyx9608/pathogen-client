<template>
  <el-scrollbar max-height="300px">
    <el-skeleton v-if="fetchingPathogen" :rows="5" animated />
    <el-descriptions v-if="!fetchingPathogen" direction="vertical" :column="9" border size="small">
      <el-descriptions-item label="病原id" span="3">
        {{ pathogenEntity.id }}
      </el-descriptions-item>
      <el-descriptions-item label="中文名" span="3">
        {{ pathogenEntity.name }}
      </el-descriptions-item>
      <el-descriptions-item label="拉丁名" span="3">
        {{ pathogenEntity.latinName }}
      </el-descriptions-item>
      <el-descriptions-item label="耐药监测" span="3">
        {{ pathogenEntity.tolerance }}
      </el-descriptions-item>
      <el-descriptions-item label="传染病" span="3">
        {{ pathogenEntity.infectious }}
      </el-descriptions-item>
      <el-descriptions-item label="低拷贝" span="3">
        {{ pathogenEntity.lowCopy }}
      </el-descriptions-item>
      <el-descriptions-item label="背景菌" span="3">
        {{ pathogenEntity.background }}
      </el-descriptions-item>
      <el-descriptions-item label="分类1" span="3">
        {{ pathogenEntity.classify1 }}
      </el-descriptions-item>
      <el-descriptions-item label="分类2" span="3">
        {{ pathogenEntity.classify2 }}
      </el-descriptions-item>
      <el-descriptions-item label="描述" span="9">
        {{ pathogenEntity.note }}
      </el-descriptions-item>
    </el-descriptions>
  </el-scrollbar>
</template>

<script lang="ts" setup>

import {Ref, ref, watch} from "vue";
import {Pathogen} from "../../entity/response/Pathogen";
import axios from "../../dao/interface";
import store from "../../store";

const props = defineProps<{ pathogenId : string }>();
const pathogenEntity = ref<Pathogen>(new Pathogen()) as Ref<Pathogen>;
const fetchingPathogen = ref<boolean>(false) as Ref<boolean>;

watch(
    () => props.pathogenId,
    (newValue, oldValue) => {
      if (newValue !== oldValue && newValue !== ''){
        pathogenEntity.value = new Pathogen();
        pathogenEntity.value.id = newValue;
        queryPathogen();
      }
    },{
      immediate : true,
      deep : true,
    }
)

function queryPathogen(){
  if (store.getters.getPathogenMap.has(pathogenEntity.value.id)){
    pathogenEntity.value = store.getters.getPathogenMap.get(pathogenEntity.value.id);
  } else {
    fetchingPathogen.value = true;
    const pathogen = new Pathogen();
    pathogen.id = pathogenEntity.value.id;
    return axios.pathogenQuery(pathogen).then(res=>{
      if (res.result.id !== undefined){
        store.getters.getPathogenMap.set(res.result.id, res.result);
        if (pathogenEntity.value.id === res.result.id) {
          pathogenEntity.value = res.result;
        }
      }
    }).catch(e=>{
      console.error(e)
    }).finally(()=>{
      fetchingPathogen.value = false;
    })
  }
}

</script>

<style scoped>

</style>