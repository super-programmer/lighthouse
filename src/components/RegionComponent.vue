<template>
	<uni-picker mode="region" @change="onRegionChange" :custom-item="customItem">
		<view class="mt-0 picker">
			当前选择: {{ selectedRegion.join(' ') }}
		</view>
	</uni-picker>
</template>

<script>
	export default {
		data() {
			return {
				selectedRegion: [],
				customItem: '全部'
			};
		},
		methods: {
			onRegionChange(e) {
				this.selectedRegion = e.detail.value;
				console.log('所选地区:', this.selectedRegion);
			}
		}
	};
</script>

<style scoped>
	.container {
		padding: 20px;
	}

	.picker {
		padding: 10px;
		border: 1px solid #ccc;
		border-radius: 5px;
	}
</style>