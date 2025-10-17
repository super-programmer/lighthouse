// src/utils/location.js
export const getLocation = () => {
	return new Promise((resolve, reject) => {
		// 判断是否为H5平台
		if (process.env.VUE_APP_PLATFORM === 'h5') {
			// H5使用IP定位作为备选
			try {
				// 示例：使用高德IP定位
				const key = 'fa9b8801b2dc795133a1afd82eeb7a54';
				uni.request({
					url: `https://restapi.amap.com/v3/ip?key=${key}`,
					success: (res) => {
						if (res.data.status === '1') {
							resolve([
								res.data.province,
								res.data.city,
								''
							]);
						} else {
							reject(new Error('IP定位失败'));
						}
					},
					fail: () => {
						// IP定位失败再尝试原生定位
						nativeGetLocation(resolve, reject);
					}
				});
			} catch (e) {
				nativeGetLocation(resolve, reject);
			}
		} else {
			// 非H5平台使用原生定位
			nativeGetLocation(resolve, reject);
		}
	});
};

function nativeGetLocation(resolve, reject) {
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
						console.log(addressComponent);
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
};
/**
 * 根据城市名称在地区数据中查找完整地区信息
 * @param {Array} regionData - 地区数据源（格式：[{value: '省', children: [{value: '市', children: [{value: '区'}]}]}]）
 * @param {String} cityName - 要匹配的城市名称（如 '北京市'、'上海市'）
 * @returns {Object|null} 匹配到的地区信息 { province, city, district }，未找到则返回 null
 */
export function findRegionByCity(regionData, cityName) {
  if (!regionData || !cityName) return null;

  // 遍历省份
  for (const provinceObj of regionData) {
    const province = provinceObj.text;
	console.log(province,regionData);
    // 遍历该省下的城市
    if (provinceObj.children && provinceObj.children.length) {
      for (const cityObj of provinceObj.children) {
        const city = cityObj.text;
        // 城市名称完全匹配（支持模糊匹配可改为 includes）
        if (city.includes(cityName) || cityName.includes(city)) {
          // 取第一个区作为默认区（若有）
		  const countyObj = cityObj.children?.[0] || {};
          const district = countyObj.text || '';
          return {
            province,
            city,
            district,
			provinceObj,
			cityObj,
			countyObj
          };
        }
      }
    }
  }

  // 未找到匹配的城市
  return null;
}