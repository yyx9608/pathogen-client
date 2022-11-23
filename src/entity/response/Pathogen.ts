import {BaseEntity} from "./BaseEntity";

export class Pathogen extends BaseEntity {
	
	name ?: string;
	/**
	 * 耐药监测
	 */
	tolerance ?: string;
	/**
	 * 是否传染病
	 */
	infectious ?: string;
	/**
	 * 低拷贝
	 */
	lowCopy ?: string;
	/**
	 * 背景菌
	 */
	background ?: string;
	latinName ?: string;
	classify1 ?: string;
	classify2 ?: string;
	note ?: string;
}