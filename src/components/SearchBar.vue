<template>
  <view class="bg-white">
    <view class="relative">
      <input 
        type="text" 
        placeholder="搜索院校、专业或政策..." 
        class="w-full h-10 py-2 px-10 rounded-full bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        v-model="searchText"
        @input="handleInput"
        @confirm="handleSearch"
      />
      <text class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></text>
      <text 
        v-if="searchText" 
        class="fas fa-times absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
        @click="clearSearch"
      ></text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      searchText: ''
    }
  },
  methods: {
    handleInput() {
      // 实时输入时触发，可用于联想提示
      this.$emit('input', this.searchText)
    },
    handleSearch() {
      // 确认搜索时触发
      if (this.searchText.trim()) {
        this.$emit('search', this.searchText.trim())
      }
    },
    clearSearch() {
      // 清空搜索内容
      this.searchText = ''
      this.$emit('input', '')
    }
  }
}
</script>

<style scoped>
input::placeholder {
  color: #9ca3af;
}
</style>