<template>
  <view class="min-h-screen bg-gray-100">
    <!-- 顶部导航 -->
    <top-nav />
    
    <!-- 专业分类 -->
    <view class="bg-white p-4">
      <text class="text-base font-bold">专业分类</text>
      <view class="mt-3 grid grid-cols-4 gap-3">
        <view 
          class="text-center p-3 border rounded-lg"
          v-for="(category, index) in categories" 
          :key="index"
          @click="handleCategoryClick(category)"
        >
          <text>{{ category }}</text>
        </view>
      </view>
    </view>
    
    <!-- 专业列表 -->
    <view class="container mx-auto px-4 py-4">
      <view 
        class="bg-white rounded-lg shadow-sm p-4 mb-4"
        v-for="major in majors" 
        :key="major.id"
        @click="navigateTo('majors/detail', { id: major.id })"
      >
        <view class="flex justify-between items-start">
          <text class="text-lg font-bold">{{ major.name }}</text>
          <text class="text-sm text-gray-500">{{ major.belongTo }}</text>
        </view>
        <view class="mt-2 text-sm text-gray-600 line-clamp-2">
          {{ major.description }}
        </view>
        <view class="mt-2 flex items-center text-sm text-gray-500">
          <text class="mr-3">就业率: {{ major.employmentRate }}</text>
          <text>平均薪资: {{ major.averageSalary }}</text>
        </view>
      </view>
    </view>
    
    <!-- 底部组件 -->
    <footer 
      @show-agreement="navigateTo('agreement')"
      @show-privacy="navigateTo('privacy')"
      @contact-us="navigateTo('contact')"
    />
  </view>
</template>

<script>
import TopNav from '@/components/TopNav.vue'
import Footer from '@/components/Footer.vue'
import SearchBar from '@/components/SearchBar.vue'
import { navigateTo } from '@/utils/route.js'

export default {
  components: {
    TopNav,
    Footer,
    SearchBar
  },
  data() {
    return {
      // 专业分类
      categories: [
        '工学', '理学', '医学', '农学',
        '文学', '法学', '经济学', '管理学',
        '教育学', '艺术学', '历史学', '哲学'
      ],
      // 专业列表数据
      majors: [
        {
          id: 101,
          name: '计算机科学与技术',
          belongTo: '工学',
          description: '本专业培养掌握计算机科学与技术基础知识和基本技能，能在科研部门、教育单位、企业、事业、技术和行政管理部门等单位从事计算机教学、科学研究和应用的计算机科学与技术学科的高级专门科学技术人才。',
          employmentRate: '95%',
          averageSalary: '8000元/月'
        },
        {
          id: 102,
          name: '经济学',
          belongTo: '经济学',
          description: '本专业培养具备比较扎实的马克思主义经济学理论基础，熟悉现代西方经济学理论，比较熟练地掌握现代经济分析方法，知识面较宽，具有向经济学相关领域扩展渗透的能力，能在综合经济管理部门、政策研究部门，金融机构和企业从事经济分析、预测、规划和经济管理工作的高级专门人才。',
          employmentRate: '92%',
          averageSalary: '7500元/月'
        }
        // 更多专业数据...
      ]
    }
  },
  onLoad() {
    console.log('专业库页面加载')
    // 实际项目中这里会调用API获取专业数据
  },
  methods: {
    navigateTo,
    handleSearch(keyword) {
      console.log('搜索专业:', keyword)
      // 处理搜索逻辑
    },
    handleCategoryClick(category) {
      console.log('选择专业分类:', category)
      // 处理分类筛选逻辑
    }
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
</style>