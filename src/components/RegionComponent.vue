<template>
	<view class="region-picker">
		<uni-data-picker  @change="onRegionChange" :localdata="regionData" />
	</view>
</template>

<script>
	// 手动导入原始样式文件
	import {
		regionData
	} from '@/utils/regionData'
	import {
		getLocation,
		findRegionByCity
	} from '@/utils/location'

	export default {
		data() {
			return {
				regionData,
				selectedRegion: [],
				customItem: '全部'
			}
		},
		mounted() {
			this.initLocation()
		},
		methods: {
			async initLocation() {
				try {
					// 获取定位信息
					const location = await getLocation()
					console.log(location, 'dddd');
					// 解析定位到的地区信息
					const regionInfo = findRegionByCity(regionData, location[1])
					if (regionInfo) {
						this.selectedRegion = [
							regionInfo.province,
							regionInfo.city,
							regionInfo.district
						]
					}
				} catch (error) {
					console.error('定位失败:', error)
				}
			},
			onRegionChange(e) {
				this.selectedRegion = e.detail.value
				console.log('所选地区:', this.selectedRegion)
			}
		}
	}
</script>

<style scoped>
	.picker {
		padding: 10px;
		border: 1px solid #ccc;
		border-radius: 5px;
	}
</style>