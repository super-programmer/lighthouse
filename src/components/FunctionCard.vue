<template>
	<view class="bg-white p-4 rounded-lg shadow-md flex flex-col items-center hover:shadow-lg transition-shadow"
		@click="$emit('click')">
		<slot>
			<font-awesome-icon :class="[color,'text-xl','mb-2']" :icon="iconArr" :size="36" :color="color" />
		</slot>
		<text class="text-gray-600">{{ text }}</text>
	</view>
</template>

<script>
	import FontAwesomeIcon from './FontAwesomeIcon.vue';
	export default {
		components: {
			FontAwesomeIcon
		},
		props: {
			icon: {
				type: String,
				required: true,
				description: "Font Awesome图标类名"
			},
			color: {
				type: String,
				required: true,
				description: "图标颜色色值"
			},
			text: {
				type: String,
				required: true,
				description: "功能卡片文字"
			}
		},
		emits: ['click'],
		computed: {
			iconArr() {
				console.log(this.icon.split(','));
				return this.icon.split(',')
			}
		}
	}
</script>

<style scoped>
	view {
		cursor: pointer;
	}
</style>