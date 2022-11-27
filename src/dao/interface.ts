import {UserConfig} from "../entity/response/UserConfig";
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
import {ExportRequest} from "../entity/request/ExportRequest";
import {QueryResultRequest} from "../entity/request/QueryResultRequest";
import {AnalysisResult} from "../entity/response/AnalysisResult";
import {Pathogen} from "../entity/response/Pathogen";
import {SearchRequest} from "../entity/request/SearchRequest";
import {CreateTaskRequest} from "../entity/request/CreateTaskRequest";


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

export function querySample(params : SampleInfo){
  return axios.post<Response<SampleInfo>, Response<SampleInfo>, SampleInfo>(RequestUrl.QUERY_SAMPLE, params);
}

export function exportFile(params : ExportRequest){
  return axios.post(RequestUrl.EXPORT_FILE, params, {
    responseType : 'blob'
  });
}

export function createTask(params: CreateTaskRequest) {
  return axios.post<Response<string>,Response<string>, CreateTaskRequest>(RequestUrl.CREATE_TASK, params)
}

function startTask(params: Task) {
  return axios.post<Response<any>, Response<any>, Task>(RequestUrl.START_TASK, params)
}
function stopTask(params: Task) {
  return axios.post<Response<any>, Response<any>, Task>(RequestUrl.STOP_TASK, params)
}

function sampleResult(params: QueryResultRequest) {
  return axios.post<Response<AnalysisResult>[],Response<AnalysisResult[]>, QueryResultRequest>(RequestUrl.QUERY_RESULTS, params)
}

function sampleInfo(params: object) {
  return axios.post('/prj/sample/queryList', params)
}

function sampleInfoGroupByAgent(params: QuerySampleInfoRequest){
  return axios.post<Response<Group<string, SampleInfo[]>[]>,Response<Group<string, SampleInfo[]>[]>, QuerySampleInfoRequest>(RequestUrl.QUERY_SAMPLES_GROUP_BY_AGENT, params);
}

function generateReport(params: string[]) {
  return axios.post<Response<SampleInfo[]>, Response<SampleInfo[]>, string[]>(RequestUrl.GENERATE_REPORT, params)
}

function sampleVerify(params: SampleInfo) {
  return axios.post<Response<boolean>, Response<boolean>, SampleInfo>( RequestUrl.VERIFY_SAMPLE, params)
}
function resultVerify(params: AnalysisResult) {
  return axios.post<Response<any>, Response<any>, AnalysisResult>( RequestUrl.VERIFY_RESULT, params);
}

function addResult(params : AnalysisResult) {
  return axios.post<Response<string>, Response<string>, AnalysisResult>(RequestUrl.INSERT_ANALYSIS_RESULT, params);
}

function fetchConfig() {
  return axios.post<Response<UserConfig>,Response<UserConfig>, any>(RequestUrl.QUERY_USER_CONFIG);
}

function updateConfig(config: UserConfig) {
  return axios.post<Response<any>, Response<any>, UserConfig>(RequestUrl.UPDATE_USER_CONFIG, config);
}

// 上传样本信息
function submitUpload(params: FormData){
  return axios.post<Response<string>, Response<string>, FormData>(RequestUrl.UPLOAD, params, {
  })
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
function pathogenQuery(params: Pathogen) {
  return axios.post<Response<Pathogen>,Response<Pathogen>,Pathogen>(RequestUrl.QUERY_PATHOGEN, params)
}

function pathogenSearch(params : SearchRequest) {
  return axios.post<Response<Pathogen[]>, Response<Pathogen[]>, SearchRequest>(RequestUrl.SEARCH_PATHOGEN, params);
}

export default { queryLabs, login, querySeq, taskList, task,
  querySample, exportFile, createTask, startTask ,stopTask,
  sampleResult, sampleInfo, sampleInfoGroupByAgent, generateReport,
  sampleVerify, resultVerify, submitUpload, resultSearch, fetchConfig, updateConfig,
  sampleSearch, taskSearch, pathogenQuery, pathogenSearch, addResult}