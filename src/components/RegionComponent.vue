<template>
	<view class="region-picker">
		<!-- 外层容器：整合图标和选择器 -->
		<view class="picker-container">
			<!-- 定位图标：仅在未选择地址时显示 -->
			<font-awesome-icon v-if="!hasSelectedRegion" :icon="['solid', 'map-marker-alt']" size="16" color="#3B82F6"
				@click="openPicker" class="location-icon" />
			<view class="selected-city" v-else @click="openPicker">
				{{ displayText }}
			</view>

			<!-- 隐藏原生选择器的显示部分，仅保留弹出功能 -->
			<uni-data-picker ref="regionPicker" class="region-selector" @change="onRegionChange" :localdata="regionData"
				mode="region" :value="selectedRegion" :clear-icon="false" :placeholder="placeholderText"
				popup-title="选择地区" />
		</view>
	</view>
</template>

<script>
	import uniDataPicker from '@dcloudio/uni-ui/lib/uni-data-picker/uni-data-picker.vue'
	import {
		regionData
	} from '@/utils/regionData'
	import {
		getLocation,
		findRegionByCity
	} from '@/utils/location'
	import FontAwesomeIcon from './FontAwesomeIcon.vue'

	export default {
		components: {
			uniDataPicker,
			FontAwesomeIcon
		},
		data() {
			return {
				regionData,
				selectedRegion: [], // [省, 市, 区]
				isLoading: true // 定位加载状态
			}
		},
		computed: {
			// 判断是否已选择地区
			hasSelectedRegion() {
				return this.selectedRegion.length > 0
			},
			// 动态占位文本
			placeholderText() {
				return this.isLoading ? '获取定位中...' : '选择地区'
			},
			displayText() {
				if (this.hasSelectedRegion) {
					return this.selectedRegion[1].text || '选择城市' // 显示市
				}
				return this.placeholderText
			}
		},
		mounted() {
			this.initLocation()
		},
		methods: {
			openPicker() {
				this.$refs.regionPicker.show()
			},
			async initLocation() {
				// 1. 优先读取缓存
				const cachedRegion = uni.getStorageSync('selectedRegion')
				if (cachedRegion && cachedRegion.length) {
					this.selectedRegion = cachedRegion
					this.isLoading = false
					this.$emit('change', cachedRegion)
					return
				}

				// 2. 缓存不存在则获取定位
				try {
					const location = await getLocation()
					const regionInfo = findRegionByCity(regionData, location[1])
					if (regionInfo) {
						const {
							provinceObj,
							cityObj,
							countyObj
						} = regionInfo;
						this.selectedRegion = [{
								text: provinceObj.text,
								value: provinceObj.value
							},
							{
								text: cityObj.text,
								value: cityObj.value
							}, {
								text: countyObj.text,
								value: countyObj.value
							}
						]
						this.saveToStorage()
						this.$emit('change', this.selectedRegion)
					}
				} catch (error) {
					console.error('定位失败:', error)
				} finally {
					// 无论成功失败，都结束加载状态
					this.isLoading = false
				}
			},

			onRegionChange(e) {
				const newRegion = e.detail.value
				if (newRegion && newRegion.length) {
					this.selectedRegion = newRegion
					this.saveToStorage()
					this.$emit('change', newRegion)
				} else {
					// 清空选择时也触发事件
					this.$emit('change', [])
				}
			},

			saveToStorage() {
				uni.setStorageSync('selectedRegion', this.selectedRegion)
			}
		}
	}
</script>

<style scoped>
	/* 修改样式部分 */
	.picker-container {
		display: inline-flex;
		align-items: center;
		border-radius: 4px;
		padding: 8px 10px;
		cursor: pointer;
	}

	/* 显示选中的市 */
	.selected-city {
		font-size: 14px;
		color: #333;
	}

	/* 未选择时的文本样式 */
	.selected-city.placeholder {
		color: #999;
	}

	.picker-container:focus-within {
		border-color: #3B82F6;
		/* 聚焦时高亮边框 */
	}

	/* 定位图标样式 */
	.location-icon {
		margin-right: 6px;
		flex-shrink: 0;
		/* 防止图标被压缩 */
	}

	/* 选择器样式 */
	.region-selector {
		width: 0 !important;
		border: none !important;
		overflow: hidden;
	}

	::v-deep .uni-data-picker__icon {
		display: none;
	}

	/* 自定义占位文本样式 */
	::v-deep .uni-data-picker__placeholder {
		color: #999;
		font-size: 14px;
	}

	/* 选择后的文本样式 */
	::v-deep .uni-data-picker__value {
		font-size: 14px;
		color: #333;
	}
</style>