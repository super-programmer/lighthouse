// 基础API配置
// export const BASE_URL = 'https://super.lighthousegroup.xyz/api';
export const BASE_URL = 'https://115.190.7.223/api';

// 请求工具函数
export const request = (url, method = 'GET', data = {}) => {
	return new Promise((resolve, reject) => {
		uni.request({
			url: `${BASE_URL}${url}`,
			method,
			data,
			header: {
				'Content-Type': 'application/json'
			},
			success: (res) => {
				if (res.statusCode === 200) {
					resolve(res.data);
				} else {
					reject(new Error(`请求失败: ${res.statusCode}`));
				}
			},
			fail: (err) => {
				reject(err);
			}
		});
	});
};