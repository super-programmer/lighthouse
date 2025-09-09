<template>
  <view class="bg-white rounded-lg transition-all duration-300 flex gap-3 mt-6" @click="$emit('click')">
    <!-- 可选新闻图片 -->
    <view v-if="imageUrl" class="w-20 h-20 flex-shrink-0 rounded-md overflow-hidden">
      <image :src="imageUrl" mode="aspectFill" class="w-full h-full"></image>
    </view>
    
    <!-- 新闻内容区 -->
    <view class="flex-grow min-w-0">
      <!-- 标题 -->
      <text class="text-gray-800 font-medium text-sm mb-1 block line-clamp-2">{{ title }}</text>
      
      <!-- 时间与来源 -->
      <view class="flex justify-between items-center text-xs text-gray-500 mt-2">
        <text>{{ publishTime }}</text>
        <text>{{ source || '官方' }}</text>
      </view>
    </view>
    
    <!-- 箭头图标 -->
    <view class="flex items-center text-gray-400">
      <text class="fas fa-angle-right"></text>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    // 新闻标题（必填）
    title: {
      type: String,
      required: true,
      description: "新闻标题"
    },
    // 发布时间（必填）
    publishTime: {
      type: String,
      required: true,
      description: "发布时间，如：2024-06-01"
    },
    // 新闻来源（可选）
    source: {
      type: String,
      default: "",
      description: "新闻来源"
    },
    // 新闻图片（可选）
    imageUrl: {
      type: String,
      default: "",
      description: "新闻缩略图URL"
    }
  },
  emits: ['click']
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

view:hover {
  transform: translateY(-1px);
}
</style>