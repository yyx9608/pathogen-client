import {BasePagerRequest} from "./request/BasePagerRequest";

export class Pager<T> {
	
	/**
	 * 当前页码
	 */
	currentPage : number = BasePagerRequest.INITIAL_PAGE_NUM;
	/**
	 * 是否还有下一页数据
	 */
	hasMore : boolean = false;
	/**
	 * 正在加载
	 */
	loading : boolean = false;
	/**
	 * 数据列表
	 */
	content : T[] = [];
	
}