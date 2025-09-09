<template>
  <view class="bg-gray-800 p-4 text-center text-white">
    <view class="mb-2">© 2023 高考信息服务平台</view>
    <view class="flex justify-center space-x-4 text-sm text-gray-300">
      <text @click="$emit('show-agreement')">用户协议</text>
      <text @click="$emit('show-privacy')">隐私政策</text>
      <text @click="$emit('contact-us')">联系我们</text>
    </view>
  </view>
</template>

<script>
export default {
  emits: ['show-agreement', 'show-privacy', 'contact-us']
}
</script>

<style scoped>
text {
  cursor: pointer;
}
</style>