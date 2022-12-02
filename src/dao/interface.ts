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
import {Agent} from "../entity/response/Agent";
import {TaskSearchRequest} from "../entity/request/TaskSearchRequest";


/**
 * 查询实验室列表
 * @param params
 */
export function queryLabs(params: BasePagerRequest) {
  return axios.post<Response<Lab[]>, Response<Lab[]>, BasePagerRequest>(RequestUrl.QUERY_LABS, params);
}

/**
 * 查询任务列表
 * @param params
 */
export function taskList(params: TasksPagerRequest) {
  return axios.post<Response<Task[]>, Response<Task[]>, TasksPagerRequest>(RequestUrl.QUERY_TASK_LIST , params);
}

/**
 * 查询任务详情
 * @param params
 */
export function task(params: Task){
  return axios.post<Response<Task>, Response<Task>, Task>(RequestUrl.QUERY_TASK, params);
}

/**
 * 登录
 * @param params
 */
export function login(params: User) {
  return axios.post<Response<User[]>, Response<User[]>, User>(RequestUrl.LOGIN, params, { headers: { 'Content-Type': 'multipart/form-data' } });
}

/**
 * 查询测序数据详情
 * @param params
 */
export function querySeq(params: SequenceData){
  return axios.post<Response<SequenceData>, Response<SequenceData>, SequenceData>(RequestUrl.QUERY_SEQUENCE, params);
}

/**
 * 查询样本详情
 * @param params
 */
export function querySample(params : SampleInfo){
  return axios.post<Response<SampleInfo>, Response<SampleInfo>, SampleInfo>(RequestUrl.QUERY_SAMPLE, params);
}

/**
 * 导出文件
 * @param params
 */
export function exportFile(params : ExportRequest){
  return axios.post(RequestUrl.EXPORT_FILE, params, {
    responseType : 'blob'
  });
}

/**
 * 创建任务
 * @param params
 */
export function createTask(params: CreateTaskRequest) {
  return axios.post<Response<string>,Response<string>, CreateTaskRequest>(RequestUrl.CREATE_TASK, params)
}


/**
 * 启动任务
 * @param params
 */
function startTask(params: Task) {
  return axios.post<Response<any>, Response<any>, Task>(RequestUrl.START_TASK, params)
}

/**
 * 中止任务
 * @param params
 */
function stopTask(params: Task) {
  return axios.post<Response<any>, Response<any>, Task>(RequestUrl.STOP_TASK, params)
}

/**
 * 删除错误的任务
 * @param param
 */
function removeTask(param : Task) {
  return axios.post<Response<boolean>, Response<boolean>, Task>(RequestUrl.REMOVE_ERROR_TASK, param);
}

/**
 * 查询样本结果
 * @param params
 */
function sampleResult(params: QueryResultRequest) {
  return axios.post<Response<AnalysisResult[]>,Response<AnalysisResult[]>, QueryResultRequest>(RequestUrl.QUERY_RESULTS, params)
}

/**
 *
 * @param params
 */
function sampleInfo(params: object) {
  return axios.post('/prj/sample/queryList', params)
}

/**
 * 根据代理商分组获取样本列表
 * @param params
 */
function sampleInfoGroupByAgent(params: QuerySampleInfoRequest){
  return axios.post<Response<Group<string, SampleInfo[]>[]>,Response<Group<string, SampleInfo[]>[]>, QuerySampleInfoRequest>(RequestUrl.QUERY_SAMPLES_GROUP_BY_AGENT, params);
}

/**
 * 批量生成报告
 * @param params
 */
function generateReport(params: string[]) {
  return axios.post<Response<SampleInfo[]>, Response<SampleInfo[]>, string[]>(RequestUrl.GENERATE_REPORT, params)
}

/**
 * 审核某个样本
 * @param params
 */
function sampleVerify(params: SampleInfo) {
  return axios.post<Response<boolean>, Response<boolean>, SampleInfo>( RequestUrl.VERIFY_SAMPLE, params)
}

/**
 * 修改某个检测结果
 * @param params
 */
function resultVerify(params: AnalysisResult) {
  return axios.post<Response<any>, Response<any>, AnalysisResult>( RequestUrl.VERIFY_RESULT, params);
}

/**
 * 分页获取代理商列表
 * @param params
 */
function fetchAgents(params : BasePagerRequest) {
  return axios.post<Response<Agent[]>, Response<Agent[]>, BasePagerRequest>(RequestUrl.QUERY_AGENTS, params);
}

/**
 * 新增一条检测结果
 * @param params
 */
function addResult(params : AnalysisResult) {
  return axios.post<Response<string>, Response<string>, AnalysisResult>(RequestUrl.INSERT_ANALYSIS_RESULT, params);
}


/**
 * 获取用户配置
 */
function fetchConfig() {
  return axios.post<Response<UserConfig>,Response<UserConfig>, any>(RequestUrl.QUERY_USER_CONFIG);
}


/**
 * 更新用户配置
 * @param config
 */
function updateConfig(config: UserConfig) {
  return axios.post<Response<any>, Response<any>, UserConfig>(RequestUrl.UPDATE_USER_CONFIG, config);
}

/**
 * 上传样本信息表
 * @param params
 */
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

/**
 * 搜任务
 * @param params
 */
function taskSearch(params: TaskSearchRequest) {
  return axios.post<Response<Task[]>, Response<Task[]>, TaskSearchRequest>(RequestUrl.SEARCH_TASK, params);
}

/**
 * 获取某个病原详情
 * @param params
 */
function pathogenQuery(params: Pathogen) {
  return axios.post<Response<Pathogen>,Response<Pathogen>,Pathogen>(RequestUrl.QUERY_PATHOGEN, params)
}

/**
 * 搜索病原
 * @param params
 */
function pathogenSearch(params : SearchRequest) {
  return axios.post<Response<Pathogen[]>, Response<Pathogen[]>, SearchRequest>(RequestUrl.SEARCH_PATHOGEN, params);
}

/**
 * 添加代理商
 * @param params
 */
function insertAgent(params : Agent){
  return axios.post<Response<string>, Response<string>, Agent>(RequestUrl.INSERT_AGENT, params);
}

export default { queryLabs, login, querySeq, taskList, task,removeTask,
  querySample, exportFile, createTask, startTask ,stopTask,fetchAgents,insertAgent,
  sampleResult, sampleInfo, sampleInfoGroupByAgent, generateReport,
  sampleVerify, resultVerify, submitUpload, resultSearch, fetchConfig, updateConfig,
  sampleSearch, taskSearch, pathogenQuery, pathogenSearch, addResult}