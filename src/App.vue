<script lang="ts">
	import Vue from 'vue';
	export default Vue.extend({
		mpType: 'app',
		onLaunch() {
			console.log('App Launch')
		},
		onShow() {
			console.log('App Show')
		},
		onHide() {
			console.log('App Hide')
		}
	});
</script>
<style lang="scss">
	// 先引入外部样式
	@use "@/uni.scss" as *;
	@import './static/css/fontawesome-custom.css';
	@import '../dist/output.css';

</style>
<style>
	@import 'styles/tailwind.css'
</style>