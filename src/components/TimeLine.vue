<template>
	<view class="">
		<view v-for="(item, index) in events" :key="index" class="flex items-center mt-6">
			<view class="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mt-1 mr-3 flex-shrink-0">
				<view class="w-2 h-2 rounded-full bg-blue-500"></view>
			</view>
			<view class="text-sm">
				<text class="text-gray-800 font-medium">{{ item.title }}：</text>
				<text class="text-gray-600">{{ item.time }}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			events: {
				type: Array,
				default: () => [],
				description: "时间线事件数组，包含title和time属性"
			}
		},
		emits: ['view-all']
	}
</script>

<style scoped>
	/* 可根据需要添加时间线样式 */
</style>