<template>
	<view class="min-h-screen bg-gray-100">
		<!-- 顶部导航 -->
		<top-nav />
		<!-- 院校列表 -->
		<view class="container mx-auto px-4 py-4">
			<!-- 加载状态 -->
			<view v-if="loading" class="text-center py-10">加载中...</view>
			<!-- 空状态 -->
			<view v-if="!loading && colleges.length === 0" class="text-center py-10">未找到相关院校</view>
			<!-- 院校列表 -->
			<view v-else class="grid grid-cols-1 gap-4">
				<college-card v-for="college in colleges" :key="college.schoolId" :logoUrl="college.emblemLink"
					:name="college.schoolName" :level="getLevelText(college.educationLevel)" :authority="college.governingBody"
					:location="college.location" />
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
	import SearchBar from '@/components/SearchBar.vue'
	import {
		navigateTo
	} from '@/utils/route.js'
	import CollegeCard from '@/components/CollegeCard.vue'
	// 引入院校相关接口
	import {
		getCollegesByPage,
		searchColleges
	} from '@/api/colleges.js'

	export default {
		components: {
			CollegeCard,
			TopNav,
			Footer,
			SearchBar
		},
		data() {
			return {
				// 筛选条件
				filterOptions: [{
						text: '全部院校',
						type: 'all'
					},
					{
						text: '985院校',
						type: '985'
					},
					{
						text: '211院校',
						type: '211'
					},
					{
						text: '双一流',
						type: 'doubleFirstClass'
					},
					{
						text: '本科',
						type: 'undergraduate'
					},
					{
						text: '专科',
						type: 'juniorCollege'
					}
				],
				activeFilter: 'all', // 当前激活的筛选条件
				colleges: [], // 院校列表数据
				loading: false, // 加载状态
				keyword: '' // 搜索关键词
			}
		},
		onShow() {
			console.log('院校库页面加载')
			// 页面加载时获取院校数据
			this.getCollegeList()
		},
		methods: {
			navigateTo,

			// 获取院校列表数据
			async getCollegeList() {
				try {
					this.loading = true
					let res
					// 根据是否有搜索关键词选择不同接口
					if (this.keyword) {
						// 使用搜索接口
						res = await searchColleges(this.keyword)
					} else {
						// 使用分页查询接口（这里可以根据筛选条件扩展参数）
						res = await getCollegesByPage(this.page, this.limit)
					}

					// 假设接口返回格式为 { code: 200, data: { list: [...] } }
					if (res.success) {
						this.colleges = res.data
					} else {
						console.error('获取院校数据失败:', res.message)
						this.colleges = []
					}
				} catch (error) {
					console.error('请求院校接口出错:', error)
					this.colleges = []
				} finally {
					this.loading = false
				}
			},
			// 处理搜索
			handleSearch(keyword) {
				console.log('搜索院校:', keyword)
				this.keyword = keyword
				// 搜索时重新获取数据
				this.getCollegeList()
			},

			// 处理筛选
			handleFilter(filter) {
				console.log('筛选条件:', filter)
				this.activeFilter = filter.type
				// 筛选时重新获取数据
				this.getCollegeList()
			},

			// 从level字段提取标签
			getTags(level) {
				const tags = []
				if (level.includes('985')) tags.push('985')
				if (level.includes('211')) tags.push('211')
				if (level.includes('双一流')) tags.push('双一流')
				return tags
			},

			// 获取层次文本（本科/专科）
			getLevelText(level) {
				if (level.includes('本科')) return '本科'
				if (level.includes('专科')) return '专科'
				return '其他'
			}
		}
	}
</script>

<style scoped>
	.container {
		max-width: 1200rpx;
	}

	.filter-container {
		border-bottom: 1px solid #eee;
	}
</style>