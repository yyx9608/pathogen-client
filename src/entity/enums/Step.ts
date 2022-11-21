/**
 * 当前任务步骤
 */
export enum Step {
    RESOLVE_SAMPLE_INFO = "解析样本信息",
    DOWNLOAD_SEQUENCE_DATA = "下载测序数据",
    RUN_SCRIPT = "脚本处理",
    RESOLVE_RESULT = "解析分析结果"
}