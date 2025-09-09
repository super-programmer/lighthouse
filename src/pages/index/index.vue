<template>
	<view class="bg-gray-100 flex flex-col min-h-screen">
		<!-- 头部导航 -->
		<top-nav />

		<!-- 中间内容区 -->
		<main class="flex-grow container mx-auto px-4 py-6 w-full max-w-4xl">
			<!-- 快捷功能六宫格 -->
			<view class="grid grid-cols-3 gap-4 mb-6">
				<function-card icon="fas fa-bullhorn" color="text-blue-500" text="招生动态"
					@click="navigateTo('admission-news')" />
				<function-card icon="fas fa-pencil-alt" color="text-green-500" text="志愿填报"
					@click="navigateTo('application')" />
				<function-card icon="fas fa-university" color="text-purple-500" text="院校库"
					@click="navigateTo('colleges')" />
				<function-card icon="fas fa-book-open" color="text-amber-500" text="专业库"
					@click="navigateTo('majors')" />
				<function-card icon="fas fa-lightbulb" color="text-yellow-500" text="专业解读"
					@click="navigateTo('major-interpretation')" />
				<function-card icon="fas fa-chart-line" color="text-red-500" text="分数管理"
					@click="navigateTo('score-management')" />
			</view>

			<!-- 高考时间线 -->
			<view class="bg-white p-6 rounded-lg shadow-md mb-6 mt-6">
				<view class="flex justify-between items-center mb-4">
					<text class="text-2xl font-bold text-gray-800">高考时间线</text>
					<text class="text-blue-500 text-sm" @click="navigateTo('timeline-detail')">
						查看全部 <i class="fas fa-angle-right ml-1"></i>
					</text>
				</view>

				<time-line :events="timelineEvents" />
			</view>

			<!-- 新增推荐资讯板块 -->
			<view class="bg-white p-6 mt-6 rounded-lg shadow-md">
				<view class="flex justify-between items-center mb-4">
					<text class="text-2xl font-bold text-gray-800">推荐资讯</text>
					<text class="text-blue-500 text-sm" @click="navigateTo('news-list')">
						更多资讯 <i class="fas fa-angle-right ml-1"></i>
					</text>
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
	// 导入工具函数
	import {
		navigateTo
	} from '@/utils/route.js'
	export default {
		components: {
			FunctionCard,
			TimeLine,
			NewsCard,
			TopNav,
			RegionComponent
		},
		data() {
			return {
				// 时间线数据
				timelineEvents: [{
						title: '高考报名时间',
						time: '2023年11月1日-10日',
						status: 'upcoming'
					},
					{
						title: '高考考试时间',
						time: '2024年6月7日-9日',
						status: 'upcoming'
					},
					{
						title: '高考成绩查询时间',
						time: '2024年6月25日左右',
						status: 'upcoming'
					}
				],
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
			// 加载数据
			loadData() {
				// 实际项目中这里会调用API获取数据
				console.log('加载首页数据')
			},
			navigateTo,
			// // 导航到指定页面（UniApp方式）
			// navigateTo(page, params = {}) {
			// 	console.log(page, 'page');
			// 	// 拼接参数
			// 	let url = `${page}`
			// 	const queryParams = Object.entries(params)
			// 		.map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
			// 		.join('&')

			// 	if (queryParams) {
			// 		url += `?${queryParams}`
			// 	}

			// 	console.log(url, 'url');
			// 	// 使用UniApp导航API
			// 	uni.navigateTo({
			// 		url,
			// 		fail: (err) => {
			// 			console.error('导航失败:', err)
			// 		}
			// 	})
			// },
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

<style>
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