// src/utils/route.js

/**
 * 路由跳转工具函数（适配 UniApp）
 * @param {string} page - 页面路径（如 'pages/admission-news'）
 * @param {object} params - 路由参数（可选）
 * @param {boolean} replace - 是否替换当前页面（默认 false）
 */
export const navigateTo = (page, params = {}, replace = false) => {
  // 拼接完整路径（根据你的页面实际存放路径调整）
  const url = `/pages/${page}/index`;
  
  // 处理参数（转为 query 字符串）
  const queryStr = Object.keys(params)
    .map(key => `${key}=${encodeURIComponent(params[key])}`)
    .join('&');
  const fullUrl = queryStr ? `${url}?${queryStr}` : url;

  // 根据 replace 参数选择跳转方式
  if (replace) {
    // 替换当前页面（无法返回）
    uni.redirectTo({ url: fullUrl });
  } else {
    // 保留当前页面，跳转到新页面（可返回）
    uni.navigateTo({ url: fullUrl });
  }
};

/**
 * 返回上一页
 * @param {number} delta - 返回的页面数（默认 1）
 */
export const navigateBack = (delta = 1) => {
  uni.navigateBack({ delta });
};

/**
 * 跳转到 tabBar 页面（UniApp 专用）
 * @param {string} page - tabBar 页面路径（如 'pages/home'）
 */
export const switchTab = (page) => {
  uni.switchTab({ url: `/${page}` });
};