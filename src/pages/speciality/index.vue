<template>
	<view class="min-h-screen bg-gray-100">
		<!-- 顶部导航 -->
		<top-nav @search="handleSearch" />

		<!-- 专业列表 -->
		<view class="container mx-auto px-4 py-4">
			<!-- 加载状态 -->
			<view v-if="loading" class="text-center py-10">
				<view class="w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto">
				</view>
				<text class="text-gray-500 mt-2 block">加载专业数据中...</text>
			</view>

			<!-- 空状态 -->
			<view v-if="!loading && allSpeciality.length === 0" class="text-center py-16 bg-white rounded-lg">
				<image src="/static/images/empty.png" class="w-20 h-20 mx-auto opacity-30" mode="widthFix"></image>
				<text class="text-gray-500 mt-4 block">未找到相关专业</text>
			</view>

			<!-- 列表内容 -->
			<view v-else class="grid grid-cols-1 gap-4">
				<view class="bg-white rounded-lg shadow-sm p-4 mb-4 transition-all duration-300 hover:shadow-md"
					v-for="major in allSpeciality" :key="major.zyId"
					@click="navigateTo('Speciality/detail', { id: major.zyId })">
					<view class="flex justify-between items-start">
						<text class="text-lg font-bold">{{ major.zymc }}</text>
						<view class="flex items-center">
							<text class="text-yellow-500 text-sm mr-1">★</text>
							<text class="text-sm">{{ major.evlValue }}</text>
						</view>
					</view>

					<view class="mt-2 flex flex-wrap gap-2">
						<text class="bg-blue-100 text-blue-600 px-2 py-0.5 rounded text-xs">{{ major.mlmc }}</text>
						<text class="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">{{ major.xk }}</text>
						<text class="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">{{ major.cc }}</text>
					</view>

					<view class="mt-3 text-sm text-gray-600 line-clamp-2">
						{{ major.description || '暂无专业介绍' }}
					</view>

					<view class="mt-3 flex items-center justify-between">
						<text class="text-xs text-gray-500">专业代码: {{ major.zydm }}</text>
						<text class="text-xs text-gray-500">{{ major.evlNum }}人评价</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 底部组件 -->
		<footer @show-agreement="navigateTo('agreement')" @show-privacy="navigateTo('privacy')"
			@contact-us="navigateTo('contact')" />
	</view>
</template>

<script>
	import TopNav from '@/components/TopNav.vue'
	import Footer from '@/components/Footer.vue'
	import {
		navigateTo
	} from '@/utils/route.js'
	import {
		getSpecialityByPage,
		searchSpeciality
	} from '@/api/speciality.js' // 假设新增的API

	export default {
		components: {
			TopNav,
			Footer
		},
		data() {
			return {
				// 基础数据
				categories: [], // 专业分类（从API获取）
				allSpeciality: [], // 全部专业数据
				filteredSpeciality: [], // 筛选后的专业

				// 状态控制
				loading: false,
				activeCategory: '全部',
				keyword: '',

				// 分页参数
				page: 1,
				limit: 10,
				hasMore: true
			}
		},
		onLoad() {
			console.log('专业库页面加载')
			this.getSpecialityList()
		},
		onPullDownRefresh() {
			// 下拉刷新
			this.page = 1
			this.getSpecialityList(true).then(() => {
				uni.stopPullDownRefresh()
			})
		},
		onReachBottom() {
			// 滚动到底部自动加载更多
			if (!this.loading && this.hasMore) {
				this.loadMore()
			}
		},
		methods: {
			// 处理分类筛选
			handleCategoryClick(category) {
				this.activeCategory = category
				this.page = 1
				this.filteredSpeciality = this.filterSpeciality()
			},
			handleSearch(keyword) {
				// 搜索时重置分页
				this.keyword = keyword
				this.page = 1
				this.getSpecialityList()
			},
			async getSpecialityList() {
				try {
					this.loading = true
					let res
					// 根据是否有搜索关键词选择不同接口
					if (this.keyword) {
						// 使用搜索接口
						res = await searchSpeciality(this.keyword)
					} else {
						// 使用分页查询接口（这里可以根据筛选条件扩展参数）
						res = await getSpecialityByPage(this.page, this.limit)
					}

					// 假设接口返回格式为 { code: 200, data: { list: [...] } }
					if (res.success) {
						this.allSpeciality = res.data
					} else {
						console.error('获取专业数据失败:', res.message)
						this.allSpeciality = []
					}
				} catch (error) {
					console.error('请求专业接口出错:', error)
					this.allSpeciality = []
				} finally {
					this.loading = false
				}
			},
			// 筛选专业
			filterSpeciality() {
				return this.allSpeciality.filter(major => {
					// 分类筛选
					const categoryMatch = this.activeCategory === '全部' ?
						true :
						major.mlmc === this.activeCategory

					// 关键词筛选
					const keywordMatch = this.keyword ?
						major.zymc.includes(this.keyword) ||
						(major.description && major.description.includes(this.keyword)) ||
						major.xk.includes(this.keyword) :
						true

					return categoryMatch && keywordMatch
				})
			},

			// 加载更多
			async loadMore() {
				if (this.loading || !this.hasMore) return

				this.loading = true
				this.page += 1

				try {
					const res = await getSpecialityByPage(
						this.page,
						this.limit,
						this.activeCategory !== '全部' ? this.activeCategory : '',
						this.keyword
					)

					const newSpeciality = res.data
					this.allSpeciality = [...this.allSpeciality, ...newSpeciality]
					this.filteredSpeciality = this.filterSpeciality()
					this.hasMore = newSpeciality.length >= this.limit
				} catch (error) {
					console.error('加载更多专业失败:', error)
					this.page -= 1 // 恢复页码
					uni.showToast({
						title: '加载失败',
						icon: 'none'
					})
				} finally {
					this.loading = false
				}
			},

			// 重置筛选条件
			resetFilter() {
				this.activeCategory = '全部'
				this.keyword = ''
				this.page = 1
				this.initPage() // 重新加载数据
			},

			navigateTo
		}
	}
</script>

<style scoped>
	.container {
		max-width: 1200rpx;
	}

	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	/* 加载动画 */
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.animate-spin {
		animation: spin 1s linear infinite;
	}
</style>