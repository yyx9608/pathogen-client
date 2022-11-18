import exp from 'constants';
import axios from './index';
import {url} from "inspector";
import {User} from "../../entity/response/User";
import {Response} from "../../entity/response/Response";


// 
export function queryList(params: object) {
  return axios.post('/prj/lab/queryList', params);
}
export function taskList(params: object) {
  return axios.post('/prj/task/queryList', params);
}
export function login(params: User) {
  return axios.post<Response<User>, Response<User>, User>('/login', params, { headers: { 'content-type': 'multipart/form-data' } });
}
export function createTask(params: object) {
  return axios.post('/prj/task/insert', params)
}

function startTask(params: object) {
  return axios.post('/prj/task/start', params)
}
function stopTask(params: object) {
  return axios.post('/prj/task/terminate', params)
}

function sampleResult(params: object) {
  return axios.post('/prj/task/result/queryList', params)
}
function sampleInfo(params: object) {
  return axios.post('/prj/sample/queryList', params)
}
function generateRepo(params: object) {
  return axios.post( '/prj/task/result/report', params)
}

function sampleVerify(params: object) {
  return axios.post( '/prj/sample/verify', params)
}
function resultVerify(params: object) {
  return axios.post( '/prj/task/result/verify', params)
}
// 上传样本信息
function submitUpload(params: object){
  return axios.post( 'http://1486641sd0.iask.in:35485/upload/', params)
}
// 搜索结果
function resultSearch(params: object){
  return axios.post( '/prj/task/result/search', params)
}
function sampleSearch(params: object) {
  return axios.post('/prj/sample/search', params)
}
function taskSearch(params: object) {
  return axios.post('/prj/task/search', params)
}
function pathogenQuery(params: object) {
  return axios.post('/prj/task/pathogen/query', params)
}
export default { queryList, login, taskList, createTask, startTask ,stopTask , sampleResult ,sampleInfo ,generateRepo ,sampleVerify ,resultVerify ,submitUpload,resultSearch,sampleSearch,taskSearch,pathogenQuery}