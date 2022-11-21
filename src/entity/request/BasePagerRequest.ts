/**
 * 分页请求参数
 */
export class BasePagerRequest {

    static readonly DEFAULT_PAGE_SIZE : number = 10;
    static readonly INITIAL_PAGE_NUM : number = 1;

    pageSize : number = BasePagerRequest.DEFAULT_PAGE_SIZE;
    currentPage : number = BasePagerRequest.INITIAL_PAGE_NUM;

}