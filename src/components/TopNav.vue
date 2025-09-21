<template>
	
	<!-- 外层容器用于占位，避免吸顶时布局跳动 -->
	<view class="top-nav-container">
		<view class="bg-white p-4 flex justify-between items-center shadow-md" :class="{ 'fixed-class': isFixed }"
			:style="isFixed ? fixedStyle : ''">
			<image src="../static/lighthouseLogo.png" class="w-10 h-10 rounded-full mr-2" @click="$emit('logo-click')"
				alt="logo" />
			<view class="flex-1 mx-4">
				<search-bar placeholder="搜索院校、专业、分数线..." />
			</view>
			<region-component class="text-gray-600" @change="handleRegionChange" />
		</view>
	</view>
</template>

<script>
	import RegionComponent from './RegionComponent.vue'
	import SearchBar from './SearchBar.vue';
	export default {
		props: {
			scrollTop: {
				type: Number,
				default: 0
			}
		},
		components: {
			RegionComponent,
			SearchBar
		},
		emits: ['logo-click', 'region-change'],
		data() {
			return {
				isFixed: false, // 是否固定在顶部
				navHeight: 0, // 导航栏原始高度
			}
		},
		watch: {
			scrollTop(newVal) {
				// 当滚动距离超过导航栏高度时吸顶
				this.isFixed = this.scrollTop >= this.navHeight/2;
			}
		},
		computed: {
			fixedStyle() {
				return {
					top:  this.navHeight,
					left: '0',
					right: '0',
					zIndex: '999'
				}
			}
		},
		mounted() {
			// 获取导航栏高度
			const query = uni.createSelectorQuery().in(this);
			query.select('.top-nav-container').boundingClientRect(data => {
				if (data) {
					this.navHeight = data.height;
				}
			}).exec();
		},
		onUnload() {
			// 页面卸载时移除监听，避免内存泄漏
			uni.offWindowScroll();
		},
		methods: {
			handleRegionChange(val) {
				this.$emit('region-change', val);
			}
		}
	}
</script>

<style>
	image {
		cursor: pointer;
	}

	/* 吸顶样式 */
	.fixed-class {
		position: fixed;
		animation: slideDown 0.3s ease-out;
	}

	@keyframes slideDown {
		from {
			transform: translateY(-100%);
		}

		to {
			transform: translateY(0);
		}
	}

	/* 外层容器保持高度，防止布局跳动 */
	.top-nav-container {
		/* 高度会通过 JS 动态计算，这里无需手动设置 */
	}
</style>