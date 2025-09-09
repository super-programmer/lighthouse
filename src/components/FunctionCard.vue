<template>
  <view class="bg-white p-4 rounded-lg shadow-md flex flex-col items-center hover:shadow-lg transition-shadow" @click="$emit('click')">
    <text :class="`${icon} ${color} text-xl mb-2`"></text>
    <text class="text-gray-600">{{ text }}</text>
  </view>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      required: true,
      description: "Font Awesome图标类名"
    },
    color: {
      type: String,
      required: true,
      description: "图标颜色类名"
    },
    text: {
      type: String,
      required: true,
      description: "功能卡片文字"
    }
  },
  emits: ['click']
}
</script>

<style scoped>
view {
  cursor: pointer;
}
</style>