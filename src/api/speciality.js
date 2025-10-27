// src/api/maj.js
import { request } from './base';

/**
 * 分页查询专业列表
 * @param {number} page - 页码
 * @param {number} limit - 每页条数
 * @returns {Promise}
 */
export const getSpecialityByPage = (page = 1, limit = 10) => {
  return request(`/speciality?page=${page}&limit=${limit}`);
};

/**
 * 搜索专业
 * @param {string} keyword - 搜索关键词
 * @returns {Promise}
 */
export const searchSpeciality = (keyword) => {
  return request(`/speciality/search?keyword=${encodeURIComponent(keyword)}`);
};

/**
 * 按ID查询专业详情
 * @param {string} id - 专业ID
 * @returns {Promise}
 */
export const getSpecialityById = (id) => {
  return request(`/speciality/${id}`);
};

/**
 * 获取专业分类列表
 * @returns {Promise}
 */
export const getSpecialityGories = () => {
  return request('/speciality/categories');
};