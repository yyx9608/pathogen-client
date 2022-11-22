import axios from '../plugin/axios';
import {User} from "../entity/response/User";
import {Response} from "../entity/response/Response";
import {Lab} from "../entity/response/Lab";
import {BasePagerRequest} from "../entity/request/BasePagerRequest";
import {RequestUrl} from "../plugin/axios/RequestUrl";
import {Task} from "../entity/response/Task";
import {TasksPagerRequest} from "../entity/request/TasksPagerRequest";
import {SequenceData} from "../entity/response/SequenceData";
import {Group} from "../entity/response/Group";
import {SampleInfo} from "../entity/response/SampleInfo";
import {QuerySampleInfoRequest} from "../entity/request/QuerySampleInfoRequest";


/**
 * 查询实验室列表
 * @param params
 */
export function queryLabs(params: BasePagerRequest) {
  return axios.post<Response<Lab[]>, Response<Lab[]>, BasePagerRequest>(RequestUrl.QUERY_LABS, params);
}

export function taskList(params: TasksPagerRequest) {
  return axios.post<Response<Task[]>, Response<Task[]>, TasksPagerRequest>(RequestUrl.QUERY_TASK_LIST , params);
}

export function task(params: Task){
  return axios.post<Response<Task>, Response<Task>, Task>(RequestUrl.QUERY_TASK, params);
}

export function login(params: User) {
  return axios.post<Response<User[]>, Response<User[]>, User>(RequestUrl.LOGIN, params, { headers: { 'Content-Type': 'multipart/form-data' } });
}

export function querySeq(params: SequenceData){
  return axios.post<Response<SequenceData>, Response<SequenceData>, SequenceData>(RequestUrl.QUERY_SEQUENCE, params);
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

function sampleInfoGroupByAgent(params: QuerySampleInfoRequest){
  return axios.post<Response<Group<string, SampleInfo[]>>,Response<Group<string, SampleInfo[]>>, QuerySampleInfoRequest>(RequestUrl.QUERY_SAMPLES_GROUP_BY_AGENT, params);
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
export default { queryLabs, login, querySeq, taskList, task, createTask, startTask ,stopTask , sampleResult ,sampleInfo ,sampleInfoGroupByAgent,generateRepo ,sampleVerify ,resultVerify ,submitUpload,resultSearch,sampleSearch,taskSearch,pathogenQuery}