<template>
  <view class="bg-white p-4 flex justify-between items-center shadow-md">
    <image 
      src="../static/lighthouseLogo.png" 
      class="w-10 h-10 rounded-full mr-2"
      @click="$emit('logo-click')"
      alt="logo"
	  />
	<view class="flex-1 mx-4">
		<search-bar placeholder="搜索院校、专业、分数线..." />
	</view>
	<region-component class="text-gray-600" @change="handleRegionChange" />
  </view>
</template>

<script>
import RegionComponent from './RegionComponent.vue'
import SearchBar from './SearchBar.vue';
export default {
  components: {
    RegionComponent,
	SearchBar
  },
  emits: ['logo-click', 'region-change']
}
</script>

<style>
image {
  cursor: pointer;
}
</style>