<template>
  <view class="min-h-screen bg-gray-100">
    <!-- 顶部导航 -->
    <top-nav />
    
    <!-- 院校详情内容 -->
    <view class="bg-white">
      <!-- 院校头部信息 -->
      <view class="p-6">
        <view class="flex justify-between items-start">
          <view>
            <text class="text-2xl font-bold">{{ college.name }}</text>
            <view class="mt-2 flex flex-wrap gap-2">
              <text class="bg-blue-100 text-blue-600 px-2 py-0.5 rounded text-xs">{{ college.level }}</text>
              <text class="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">{{ college.type }}</text>
              <text class="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">{{ college.location }}</text>
            </view>
          </view>
          <button class="bg-blue-500 text-white px-4 py-2 rounded">
            收藏
          </button>
        </view>
      </view>
      
      <!-- 院校简介 -->
      <view class="px-6 py-4 border-t">
        <text class="text-lg font-bold">院校简介</text>
        <text class="block mt-3 text-gray-700 leading-relaxed">
          {{ college.introduction }}
        </text>
      </view>
      
      <!-- 热门专业 -->
      <view class="px-6 py-4 border-t">
        <text class="text-lg font-bold">热门专业</text>
        <view class="mt-3 grid grid-cols-3 gap-2">
          <view 
            class="bg-gray-50 p-3 rounded text-center"
            v-for="major in college.hotMajors" 
            :key="major.id"
            @click="navigateTo('majors/detail', { id: major.id })"
          >
            <text>{{ major.name }}</text>
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
      college: {
        id: 1,
        name: '北京大学',
        location: '北京',
        type: '综合类',
        level: '985/211/双一流',
        introduction: '北京大学创办于1898年，初名京师大学堂，是中国近代第一所国立综合性大学，其成立标志着中国近代高等教育的开端。北大是中国近代以来唯一以国家最高学府身份创立的学校，最初也是国家最高教育行政机关，行使教育部职能，统管全国教育。',
        hotMajors: [
          { id: 101, name: '计算机科学与技术' },
          { id: 102, name: '经济学' },
          { id: 103, name: '法学' },
          { id: 104, name: '数学与应用数学' },
          { id: 105, name: '物理学' },
          { id: 106, name: '临床医学' }
        ]
      }
    }
  },
  onLoad(options) {
    console.log('院校详情页面加载，院校ID:', options.id)
    // 实际项目中这里会根据ID调用API获取院校详情
  },
  methods: {
    navigateTo
  }
}
</script>

<style scoped>
button {
  line-height: normal;
}
</style>