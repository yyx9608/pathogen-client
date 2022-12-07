<template>

</template>

<script lang="ts" setup>


import {ref, Ref} from "vue";
import {User} from "../../entity/response/User";
import {Pager} from "../../entity/Pager";
import axios from '../../dao/interface';

const userList = ref<Pager<User>>(new Pager<User>()) as Ref<Pager<User>>;


function queryUserList(){

}

</script>

<style scoped>

</style>