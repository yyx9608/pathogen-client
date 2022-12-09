<template>
  <div class="loginbackground">
    <div class="login">
      <div style="font-size: 30px; font-weight: 700; margin-top: 20px">

      </div>
      <el-form>
        <el-form-item>
          <el-input class="el-input1" v-model="username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="password" show-password placeholder="请输入密码"></el-input>
        </el-form-item>
      </el-form>
      <div>
        <el-button id="btn" class="center" type="primary" @click="loginBoke" >登       录</el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {ref} from '@vue/reactivity';
import {login} from '../dao/interface';
import {User} from "../entity/response/User";
import router from "../router";
import {UserType} from "../entity/enums/UserType";
import {ComponentConstants} from "../constants/ComponentConstants";

// 用户名
const username = ref('chenjianhua');
const password = ref('123456');
function loginBoke() {
  let user = new User();
  user.username = username.value;
  user.password = password.value;
  login(user).then(res=>{
    //current login user: res.result[0]
    console.log(res)
    if (res.result[0].type === UserType.ENGINEER) {
      router.push({
        name: ComponentConstants.MAIN,
        replace: true,
        query: {
          timestamp: Date.now()
        }
      });
    } else if (res.result[0].type === UserType.ADMINISTRATOR){
      router.push({
        name: ComponentConstants.ADMIN,
        replace: true,
        query: {
          timestamp: Date.now()
        }
      });
    }
  }).catch(e=>{
    console.error(e)
  })

}
</script>

<style lang="scss" scoped>
.loginbackground {
  width: 100%;
  height: 100%;
  background: url(../assets/background.png) no-repeat;
  background-size: 100%;
}
.el-input1{
  border-top-style:hidden;
  //border-right-style:hidden;
  //border-bottom-style:solid;
  //border-left-style:hidden;
}

.login {
  width: 30%;
  height: 500px;
  margin: auto;
  position: fixed;
  left: 50%;
  top: 70%;
  transform: translate(-50%, -50%);
  color: rgb(63, 61, 61);
}
btn.center
{
  text-align:center;
}
#btn {
  /*登录按钮*/
  display: inline-block;
  //text-align: center;

  transform: translate(-50%, -50%);
  /*display:flex;*/
  //padding: 5px;
  width: 100%;
  /*长度*/
  height: 150%;
  margin: auto;
  margin-top: 1px;
  /*边框与上面的距离*/
  //margin-left: 190px;
  //margin-right: 210px;
  background-color: #B32929;
  //color: #B32929;
}

:deep(.el-form) {
  margin-top: 30px;
  margin-bottom: 30px;
  padding: 20px;
}
</style>