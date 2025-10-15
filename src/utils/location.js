// src/utils/location.js
export const getLocation = () => {
	console.log('getLocation');
	return new Promise((resolve, reject) => {
		// 1. 调用 uni 原生定位接口获取经纬度
		uni.getLocation({
			type: 'gcj02', // 国测局坐标系，兼容微信小程序等平台
			altitude: false,
			success: (res) => {
				console.log(res);
				const {
					latitude,
					longitude
				} = res;
				// 2. 调用逆地理编码（这里以高德地图为例，需自行申请 key）
				// 文档：https://lbs.amap.com/api/javascript-api/guide/services/geocoder
				const key = 'fa9b8801b2dc795133a1afd82eeb7a54'; // 替换为实际 key
				const url =
					`https://restapi.amap.com/v3/geocode/regeo?location=${longitude},${latitude}&key=${key}&radius=1000&extensions=base`;

				uni.request({
					url,
					method: 'GET',
					success: (geoRes) => {
						console.log(geoRes, 'geoRes');
						if (geoRes.data.status === '1') {
							const addressComponent = geoRes.data.regeocode
								.addressComponent;
							// 返回省、市、区数组（兼容原模拟格式）
							resolve([
								addressComponent.province,
								addressComponent.city,
								addressComponent.district
							]);
						} else {
							reject(new Error('逆地理编码失败：' + geoRes.data.info));
						}
					},
					fail: (err) => {
						reject(new Error('请求地理编码接口失败：' + err.errMsg));
					}
				});
			},
			fail: (err) => {
				// 定位失败处理（如用户拒绝授权）
				console.error('获取定位失败：', err);
				// 可根据平台返回不同提示或降级处理
				if (err.errMsg.includes('auth deny')) {
					reject(new Error('请开启定位授权'));
				} else {
					reject(new Error('定位失败，请稍后重试'));
				}
			}
		});
	});
};

// 根据城市名称查找对应地区层级（原方法保留，增加容错）
export const findRegionByCity = (regionData, cityName) => {
	// 容错：判断入参是否有效
	if (!regionData || !Array.isArray(regionData) || !cityName) {
		console.warn('findRegionByCity 入参无效');
		return null;
	}

	for (const province of regionData) {
		if (!province?.children || !Array.isArray(province.children)) continue; // 跳过无效数据
		for (const city of province.children) {
			if (city?.text && city.text.includes(cityName)) {
				return {
					province: province.text || '',
					city: city.text || '',
					district: city.children?.[0]?.text || ''
				};
			}
		}
	}
	return null;
};