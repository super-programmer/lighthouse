<template>
	<view class="bg-gray-100 flex flex-col min-h-screen">
		<!-- <image src="data:image/webp;base64,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" /> -->
		<!-- 头部导航 -->
		<top-nav :scroll-top="scrollTop" />

		<!-- 中间内容区 -->
		<main class="flex-grow container mx-auto px-4 py-6 max-w-4xl">
			<!-- 快捷功能六宫格 -->
			<view class="grid grid-cols-3 gap-4 mb-6">
				<function-card icon="solid,bullhorn" color="#3B82F6" text="招生动态"
					@click="navigateTo('admission-news')" />
				<function-card icon="solid,pencilAlt" color="#10B981" text="志愿填报" @click="navigateTo('application')" />
				<function-card icon="solid,university" color="#8B5CF6" text="院校库" @click="navigateTo('colleges')" />
				<function-card icon="solid,bookOpen" color="#F59E0B" text="专业库" @click="navigateTo('speciality')" />
				<function-card icon="solid,lightbulb" color="#EAB308" text="专业解读"
					@click="navigateTo('major-interpretation')" />
				<function-card icon="solid,chartLine" color="#EF4444" text="分数管理"
					@click="navigateTo('score-management')" />
			</view>

			<!-- 高考时间线 -->
			<view class="bg-white p-6 rounded-lg shadow-md mb-6 mt-6">
				<view class="flex justify-between items-center mb-4">
					<text class="text-2xl font-bold text-gray-800">高考时间线</text>
					<view class="text-blue-500 text-sm" @click="navigateTo('timelines')">
						查看全部 <!-- <font-awesome-icon :icon="['solid', 'angle-double-right']" size="18"
							:computedStyle="{'display': 'inline-block' , 'verticalAlign': $isH5 ? 'bottom' : 'middle'}"
							color="#3B82F6"
							:class="['text-xl','ml-2']" /> -->
					</view>
				</view>

				<time-line :events="timelineEvents" />
			</view>

			<!-- 新增推荐资讯板块 -->
			<view class="bg-white p-6 mt-6 rounded-lg shadow-md">
				<view class="flex justify-between items-center mb-4">
					<text class="text-2xl font-bold text-gray-800">推荐资讯</text>
					<view class="text-blue-500 text-sm" @click="navigateTo('news-list')">
						更多资讯 <!-- <font-awesome-icon :icon="['solid', 'angle-double-right']" size="18"
							color="#3B82F6"
							:computedStyle="{'display': 'inline-block' , 'verticalAlign': $isH5 ? 'bottom' : 'middle' }"
							:class="['text-xl','ml-2']" /> -->
					</view>
				</view>
				<news-card v-for="(item, index) in recommendedNews" :key="index" :title="item.title"
					:publishTime="item.date" @click="navigateTo('news-detail', {id: item.id})" />
			</view>
		</main>

		<!-- 底部 -->
		<footer class="bg-gray-800 p-4 text-center text-white mt-6" />
	</view>
</template>

<script>
	import TopNav from '@/components/TopNav.vue'
	import FunctionCard from '@/components/FunctionCard.vue'
	import TimeLine from '@/components/TimeLine.vue'
	import NewsCard from '@/components/NewsCard.vue'
	import RegionComponent from '@/components/RegionComponent.vue'
	import FontAwesomeIcon from '@/components/FontAwesomeIcon.vue'
	// 导入工具函数
	import {
		navigateTo
	} from '@/utils/route.js'
	export default {
		components: {
			FontAwesomeIcon,
			FunctionCard,
			TimeLine,
			NewsCard,
			TopNav,
			RegionComponent
		},
		data() {
			return {
				scrollTop: 0,
				timelineEvents: [{
					title: '高考报名时间',
					time: '2024年11月1日-30日',
					status: 'upcoming'
				}, {
					title: '高考考试时间',
					time: '2025年6月7日-10日',
					status: 'upcoming'
				}, {
					title: '高考成绩查询时间',
					time: '2025年6月25日左右',
					status: 'upcoming'
				}],
				// 推荐资讯数据
				recommendedNews: [{
						id: 1,
						title: '2024年高考政策解读',
						date: '2023-10-15'
					},
					{
						id: 2,
						title: '志愿填报常见误区分析',
						date: '2023-10-10'
					}
				]
			}
		},
		onLoad() {
			this.loadData()
		},
		methods: {
			// 页面滚动时更新 scrollTop
			onPageScroll(res) {
				this.scrollTop = res.scrollTop;
			},
			// 加载数据
			loadData() {
				// 实际项目中这里会调用API获取数据
				console.log('加载首页数据')
			},
			navigateTo,
			// 处理地区选择变化
			handleRegionChange(region) {
				console.log('地区变化:', region)
				// 处理地区切换逻辑
			},
			// 处理logo点击
			handleLogoClick() {
				this.navigateTo('home')
			},
			// 显示用户协议
			showAgreement() {
				this.navigateTo('agreement')
			},
			// 显示隐私政策
			showPrivacy() {
				this.navigateTo('privacy')
			},
			// 联系我们
			contactUs() {
				this.navigateTo('contact')
			}
		}
	};
</script>

<style scoped>
	/* 基础样式优化 */
	page {
		font-family: 'Inter', sans-serif;
		background-color: #f3f4f6;
	}

	/* 组件间距优化 */
	header,
	main,
	footer {
		width: 100%;
		box-sizing: border-box;
	}

	/* 动画效果 */
	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(10px);
		}

		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.function-card,
	.news-card {
		animation: fadeIn 0.3s ease-out;
	}
</style>