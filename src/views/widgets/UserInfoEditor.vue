<template>

  <el-form :model="user">
    <el-form-item label="用户名" :prop="user.username">
      <el-input :disabled="action !== Action.INSERT" v-model="user.username" />
    </el-form-item>
    <el-form-item label="密码" :prop="user.password">
      <el-input v-model="user.password" />
    </el-form-item>
    <el-form-item label="昵称" :prop="user.nickname">
      <el-input v-model="user.nickname" />
    </el-form-item>
    <el-form-item label="部门" :prop="user.department">
      <el-input v-model="user.department" />
    </el-form-item>
    <el-form-item label="用户类型">
      <el-select v-model="user.type" :placeholder="user.type">
        <el-option :key="UserType.ENGINEER" :label="UserType.ENGINEER" :value="UserType.ENGINEER" :disabled="user.type === UserType.ENGINEER"/>
        <el-option :key="UserType.AGENT" :label="UserType.AGENT" :value="UserType.AGENT" :disabled="user.type === UserType.AGENT"/>
      </el-select>
    </el-form-item>
    <el-form-item v-if="action !== Action.INSERT" label="用户状态">
      <el-select v-model="user.status" :placeholder="user.status">
        <el-option :key="UserStatus.ENABLE" :label="UserStatus.ENABLE" :value="UserStatus.ENABLE" :disabled="user.status === UserStatus.ENABLE"/>
        <el-option :key="UserStatus.DISABLE" :label="UserStatus.DISABLE" :value="UserStatus.DISABLE" :disabled="user.status === UserStatus.DISABLE"/>
      </el-select>
    </el-form-item>
  </el-form>

  <el-button v-if="action === Action.EDIT || action === Action.INSERT" :loading="loading" :onclick="clickBtn">{{ Notifications.SAVE }}</el-button>

</template>

<script lang="ts" setup>

import {Action} from "../../entity/enums/local/Action";
import {User} from "../../entity/response/User";
import {Ref, ref, watch} from "vue";
import {UserType} from "../../entity/enums/UserType";
import {Notifications} from "../../constants/Constants";
import {UserStatus} from "../../entity/enums/UserStatus";
import axios from '../../dao/interface';
import {ElNotification} from "element-plus";

const props = defineProps<{ user : User, action : Action}>();
const emits = defineEmits(['update','insert','exit']);
const action = ref<Action>(Action.EDIT) as Ref<Action>;
const user = ref<User|undefined>(undefined) as Ref<User>;
const loading = ref<boolean>(false) as Ref<boolean>;

function notifyUpdate() {
  emits('update', user.value);
}

function notifyInsert() {
  emits('insert', user.value);
}

function clickBtn() {
  if (loading.value){
    return;
  }
  if (action.value === Action.EDIT){
    //修改
    loading.value = true;
    axios.updateUser(user.value).then(res=>{
      ElNotification({
        title: Notifications.SUCCESS,
        message: res.result,
        type: 'success',
      });
      notifyUpdate();
    }).catch(e=>{
      ElNotification({
        title: Notifications.FAIL,
        message: e,
        type: 'error',
      });
      console.error(e);
    }).finally(()=>{
      loading.value = false;
    })
  } else if (action.value === Action.INSERT){
    //添加
    loading.value = true;
    axios.insertUser(user.value).then(res=>{
      ElNotification({
        title: Notifications.SUCCESS,
        message: res.result,
        type: 'success',
      });
      user.value.id = res.result;
      user.value.status = UserStatus.ENABLE;
      notifyInsert();
    }).catch(e=>{
      ElNotification({
        title: Notifications.FAIL,
        message: e,
        type: 'error',
      });
      console.error(e);
    }).finally(()=>{
      loading.value = false;
    })
  }
}

watch(
    () => props.user,
    (newValue, oldValue) => {
      user.value = newValue;
    },{
      deep : true,
      immediate : true
    }
)

watch(
    () => props.action,
    (newValue, oldValue) => {
      action.value = newValue;
    },
    {
      deep : true,
      immediate : true
    }
)

</script>

<style scoped>

</style>