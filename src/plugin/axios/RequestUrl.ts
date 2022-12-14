export class RequestUrl {
    
    static readonly BASE_URL : string = '/api';

    static readonly LOGIN : string = '/login';
    static readonly QUERY_LABS : string = '/prj/lab/queryList';
    static readonly QUERY_TASK_LIST : string = '/prj/task/queryList';
    static readonly QUERY_TASK : string = '/prj/task/query';
    static readonly QUERY_SEQUENCE : string = '/prj/task/sequence/query';
    static readonly QUERY_SAMPLES_GROUP_BY_AGENT : string = '/prj/sample/group';
    static readonly QUERY_SAMPLE : string = '/prj/sample/query';
    static readonly EXPORT_FILE : string = '/prj/sample/export';
    static readonly QUERY_RESULTS : string = '/prj/task/result/queryList';
    static readonly QUERY_PATHOGEN : string = '/prj/task/pathogen/query';
    static readonly VERIFY_SAMPLE : string = '/prj/sample/verify';
    static readonly GENERATE_REPORT : string = '/prj/task/result/report';
    static readonly VERIFY_RESULT : string = '/prj/task/result/verify';
    static readonly SEARCH_PATHOGEN : string = '/prj/task/pathogen/search';
    static readonly INSERT_ANALYSIS_RESULT : string = '/prj/task/result/insert';
    static readonly UPLOAD : string = '/upload/';
    static readonly CREATE_TASK : string = '/prj/task/insert';
    static readonly START_TASK : string = '/prj/task/start';
    static readonly STOP_TASK : string = '/prj/task/terminate';
    static readonly QUERY_USER_CONFIG : string = '/prj/config/query';
    static readonly UPDATE_USER_CONFIG : string = '/prj/config/update';
    static readonly QUERY_AGENTS : string = '/prj/agents/queryList';
    static readonly INSERT_AGENT : string = '/prj/agents/insert';
    static readonly REMOVE_ERROR_TASK : string = '/prj/task/delete';
    static readonly SEARCH_TASK : string = '/prj/task/search';
    static readonly SEARCH_SAMPLE : string = '/prj/sample/search';
    static readonly ASSOCIATED_SAMPLE : string = '/prj/sample/associated';
    
    
    static readonly QUERY_USER_LIST : string = '/admin/queryList';
    static readonly UPDATE_USER : string = '/admin/update';
    static readonly INSERT_USER : string = '/admin/insert';

}