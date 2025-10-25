<template>
  <view class="min-h-screen bg-gray-100">
    <!-- 顶部导航 -->
    <top-nav />
    
    <!-- 专业详情内容 -->
    <view class="bg-white">
      <!-- 专业头部信息 -->
      <view class="p-6">
        <text class="text-2xl font-bold">{{ major.name }}</text>
        <view class="mt-2 flex flex-wrap gap-2">
          <text class="bg-blue-100 text-blue-600 px-2 py-0.5 rounded text-xs">{{ major.belongTo }}</text>
          <text class="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">{{ major.level }}</text>
        </view>
      </view>
      
      <!-- 专业介绍 -->
      <view class="px-6 py-4 border-t">
        <text class="text-lg font-bold">专业介绍</text>
        <text class="block mt-3 text-gray-700 leading-relaxed">
          {{ major.introduction }}
        </text>
      </view>
      
      <!-- 核心课程 -->
      <view class="px-6 py-4 border-t">
        <text class="text-lg font-bold">核心课程</text>
        <view class="mt-3 flex flex-wrap gap-2">
          <text class="bg-gray-100 px-3 py-1 rounded-full text-sm" v-for="(course, index) in major.courses" :key="index">
            {{ course }}
          </text>
        </view>
      </view>
      
      <!-- 开设院校 -->
      <view class="px-6 py-4 border-t">
        <text class="text-lg font-bold">开设院校</text>
        <view class="mt-3">
          <view 
            class="border-b pb-3 mb-3 flex justify-between items-center"
            v-for="(college, index) in major.colleges" 
            :key="index"
            @click="navigateTo('colleges/detail', { id: college.id })"
          >
            <text>{{ college.name }}</text>
            <text class="text-blue-500">查看详情 →</text>
          </view>
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
import { navigateTo } from '@/utils/route.js'

export default {
  components: {
    TopNav,
    Footer
  },
  data() {
    return {
      major: {
        id: 101,
        name: '计算机科学与技术',
        belongTo: '工学',
        level: '本科',
        introduction: '计算机科学与技术是研究计算机的设计与制造，并利用计算机进行有关的信息获取、表示、存储、处理、控制等的理论、原则、方法和技术的学科。它包括科学和技术两方面，科学侧重于研究现象与揭示规律；技术则侧重于研制计算机和研究使用计算机进行信息处理的方法与技术手段。',
        courses: [
          '数据结构', '计算机组成原理', '操作系统', 
          '计算机网络', '数据库原理', '软件工程',
          '人工智能', '机器学习', '编程语言'
        ],
        colleges: [
          { id: 1, name: '北京大学' },
          { id: 2, name: '清华大学' },
          { id: 3, name: '浙江大学' },
          { id: 4, name: '上海交通大学' }
        ]
      }
    }
  },
  onLoad(options) {
    console.log('专业详情页面加载，专业ID:', options.id)
    // 实际项目中这里会根据ID调用API获取专业详情
  },
  methods: {
    navigateTo
  }
}
</script>