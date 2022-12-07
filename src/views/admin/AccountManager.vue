<template>

  <el-table :data="userList.content" @cell-mouse-enter="onMouseEnter">
    <el-table-column prop="username" label="用户名" />
    <el-table-column prop="nickname" label="昵称" />
    <el-table-column prop="department" label="部门"  />
    <el-table-column prop="type" label="用户类型" />
    <el-table-column prop="status" label="用户状态" />
    <el-table-column fixed="right" label="操作">
      <template #default="scope">
        <el-container style="justify-content: center">
          <el-button-group>
            <el-button type="primary" size="small" icon="Edit" @click.prevent="editRow(scope.$index)"/>
          </el-button-group>
        </el-container>
      </template>
    </el-table-column>
  </el-table>
  <el-button v-if="userList.content.length > 0 && userList.hasMore" :loading="userList.loading" @click="queryUserList" type="primary" size="small">{{ Notifications.LOAD_MORE }}</el-button>
  <el-button class="mt-4" style="width: 100%" @click="addUser">{{ Notifications.ADD_USER }}</el-button>

  <el-drawer v-model="showUserEditor" size="100%">
    <UserInfoEditor :action="action" :user="selectedUser" @insert="insertUser" @update="updateUser" @exit="closeUserEditor"/>
  </el-drawer>

</template>

<script lang="ts" setup>


import {ref, Ref} from "vue";
import {User} from "../../entity/response/User";
import {Pager} from "../../entity/Pager";
import axios from '../../dao/interface';
import {BasePagerRequest} from "../../entity/request/BasePagerRequest";
import {Notifications} from "../../constants/Constants";
import {Action} from "../../entity/enums/local/Action";
import UserInfoEditor from "../widgets/UserInfoEditor.vue";
import {AnalysisResult} from "../../entity/response/AnalysisResult";

const userList = ref<Pager<User>>(new Pager<User>()) as Ref<Pager<User>>;
const selectedUser = ref<User|undefined>(undefined) as Ref<User>;
const action = ref<Action>(Action.EDIT) as Ref<Action>;
const showUserEditor = ref<boolean>(false) as Ref<boolean>;

queryUserList();

function onMouseEnter(row: User, column: any, cell: any, event: any) {
  selectedUser.value = row;
}

function insertUser(user : User) {
  userList.value.content.unshift(user);
  closeUserEditor();
}

function updateUser(user : User) {
  userList.value.content.forEach((value,index)=>{
    if (value.id === user.id){
      userList.value.content[index] = user;
    }
  });
  closeUserEditor();
}

function closeUserEditor() {
  showUserEditor.value = false;
}

function addUser(){
  action.value = Action.INSERT;
  selectedUser.value = new User();
  showUserEditor.value = true;
}

function editRow(index : number) {
  action.value = Action.EDIT;
  selectedUser.value = Object.assign(new User(), userList.value.content![index]);
  showUserEditor.value = true;
}

function queryUserList(){
  if (userList.value.loading){
    return;
  }
  const request = new BasePagerRequest();
  request.currentPage = userList.value.currentPage;
  axios.queryUserList(request).then(res=>{
    userList.value.content = userList.value.content.concat(res.result);
    userList.value.currentPage += 1;
    userList.value.hasMore = (res.result.length === BasePagerRequest.DEFAULT_PAGE_SIZE);
  }).catch(e=>{
    console.error(e);
  }).finally(()=>{
    userList.value.loading = false;
  });
}

</script>

<style scoped>

</style>