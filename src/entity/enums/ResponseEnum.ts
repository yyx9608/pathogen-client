export enum ResponseEnum {

    SUCCESS = 0, //操作成功
    FAIL, //操作失败
    INVALID_PARAM,//参数异常
    LOGIN_SUCCESS = 1000,//登录成功
    LOGIN_FAIL,//登录失败
    NOT_LOGIN,//用户未登录
    USER_NOT_FOUND,
    SAMPLE_NOT_FOUND,
    SAMPLE_STATUS_ERROR,
    TASK_NOT_FOUND,
    FILE_NOT_FOUND,
    MKDIR_TMP_FAIL,

    INSERT_SUCCESS = 2000,
    INSERT_FAIL,
    UPDATE_SUCCESS,
    UPDATE_FAIL,
    DELETE_SUCCESS,
    DELETE_FAIL,
    QUERY_SUCCESS,
    QUERY_FAIL,

    UPLOAD_SUCCESS,
    UPLOAD_FAIL,

    CONFIG_NOT_FOUND = 3001

}