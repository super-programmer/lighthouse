<template>
  <view class="college-card bg-white rounded-lg shadow-sm overflow-hidden flex items-start p-4">
    <!-- 左侧校徽 -->
    <view class="college-logo w-20 h-20 flex-shrink-0 mr-4">
      <image 
        :src="logoUrl" 
        mode="aspectFill" 
        class="w-full h-full rounded-md"
        :alt="name + '校徽'"
      ></image>
    </view>
    
    <!-- 右侧信息区 -->
    <view class="college-info flex-grow">
      <!-- 学校名称 -->
      <view class="flex items-center mb-2">
        <text class="text-lg font-bold text-gray-800 mr-2">{{ name }}</text>
        <!-- 学校标识（如"双一流"、"985"、"211"等） -->
        <view class="flex flex-wrap gap-1">
          <text 
            v-for="tag in tags" 
            :key="tag" 
            class="text-xs py-0.5 px-2 bg-blue-100 text-blue-700 rounded-full"
          >{{ tag }}</text>
        </view>
      </view>
      
      <!-- 办学层级 -->
      <view class="text-sm text-gray-600 mb-1">
        办学层级：{{ level }}
      </view>
      
      <!-- 主管部门 -->
      <view class="text-sm text-gray-600 mb-1">
        主管部门：{{ authority }}
      </view>
      
      <!-- 所在地 -->
      <view class="text-sm text-gray-600">
        所在地：{{ location }}
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    // 校徽图片URL
    logoUrl: {
      type: String,
      required: true,
      default: '/static/lighthouseLogo.png'
    },
    // 学校名称
    name: {
      type: String,
      required: true
    },
    // 办学层级（如：本科、专科、本科层次职业学校等）
    level: {
      type: String,
      required: true
    },
    // 主管部门（如：教育部、江苏省教育厅等）
    authority: {
      type: String,
      required: true
    },
    // 所在地（如：北京市海淀区）
    location: {
      type: String,
      required: true
    },
    // 学校标识（如：["985", "211", "双一流"]）
    tags: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style scoped>
.college-card {
  transition: all 0.3s ease;
}

.college-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

image {
  border: 1px solid #f0f0f0;
}
</style>