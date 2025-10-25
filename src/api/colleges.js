import { request } from './base';

/**
 * 分页查询院校列表
 * @param {number} page - 页码
 * @param {number} limit - 每页条数
 * @returns {Promise}
 */
export const getCollegesByPage = (page = 1, limit = 10) => {
  return request(`/colleges?page=${page}&limit=${limit}`);
};

/**
 * 搜索学校
 * @param {string} keyword - 搜索关键词
 * @returns {Promise}
 */
export const searchColleges = (keyword) => {
  return request(`/colleges/search?keyword=${encodeURIComponent(keyword)}`);
};

/**
 * 按ID查询院校详情
 * @param {string} id - 院校ID
 * @returns {Promise}
 */
export const getCollegeById = (id) => {
  return request(`/colleges/${id}`);
};