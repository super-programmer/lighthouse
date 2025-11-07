<template>
	<!-- 模板内容保持不变 -->
	<view v-if="!isIconLoaded" class="icon-loading" :style="{width: size + 'px', height: size + 'px'}">
		<!-- 加载状态占位 -->
	</view>
	<!-- H5 版本 -->
	<svg v-else-if="isH5" :class="computedClass" :style="computedStyle" :width="size" :height="size"
		viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
		<path v-if="iconPath" :d="iconPath" :fill="color" />
	</svg>

	<!-- 微信小程序版本 -->
	<image v-else :class="computedClass" :style="{ width: size + 'px', height: size + 'px', ...computedStyle }"
		:src="svgBase64" mode="widthFix">
</template>

<script>
	// 引入所有需要使用的图标（从plugins/index.js中同步）
	import {
		faShoppingCart,
		faBullhorn,
		faPencilAlt,
		faUniversity,
		faBookOpen,
		faLightbulb,
		faChartLine,
		faAngleRight,
		faMapMarkerAlt
	} from '@fortawesome/free-solid-svg-icons'

	export default {
		props: {
			// props保持不变
			icon: {
				type: Array,
				required: true,
				validator: (value) => {
					return value.length === 2 && typeof value[0] === 'string' && typeof value[1] === 'string'
				}
			},
			size: {
				type: [Number, String],
				default: 24
			},
			color: {
				type: String,
				default: 'currentColor'
			},
			computedStyle: {
				type: Object,
				default: () => ({
					display: 'inline-block',
					verticalAlign: 'middle'
				})
			}
		},
		data() {
			return {
				iconData: {},
				isIconLoaded: false,
				svgBase64: '', // 小程序用的Base64格式SVG
				isH5: this.$isH5, // 标记是否为H5环境
				isWeixin: this.$isWeixin, // 标记是否为微信小程序
				// 静态图标映射表
				iconMap: {
					'solid,shoppingCart': faShoppingCart,
					'solid,bullhorn': faBullhorn,
					'solid,pencilAlt': faPencilAlt,
					'solid,university': faUniversity,
					'solid,bookOpen': faBookOpen,
					'solid,lightbulb': faLightbulb,
					'solid,chartLine': faChartLine,
					'solid,angleRight': faAngleRight,
					'solid,mapMarkerAlt':faMapMarkerAlt
				}
			}
		},
		watch: {
			icon: {
				immediate: true,
				handler() {
					this.loadIcon();
				}
			}
		},
		computed: {
			// 计算属性保持不变
			iconPath() {
				return this.iconData?.icon?.icon?.[4] || '';
			},
			computedClass() {
				return 'fa-icon';
			},
			svgString() {
				if (!this.iconPath) return '';
				return `<svg width="${this.size}" height="${this.size}" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="${this.iconPath}" fill="${this.color}"/></svg>`;
			}
		},
		methods: {
			svgToBase64(svg) {
				// 保持不变
				const buffer = new Uint8Array(svg.length);
				for (let i = 0; i < svg.length; i++) {
					buffer[i] = svg.charCodeAt(i);
				}
				const base64 = wx.arrayBufferToBase64(buffer.buffer);
				return `data:image/svg+xml;base64,${base64}`;
			},
			loadIcon() {
				const [prefix, iconName] = this.icon;
				if (!prefix || !iconName) {
					return;
				}
				this.isIconLoaded = false;

				try {
					// 使用静态映射表获取图标
					const iconKey = `${prefix},${iconName}`;
					const icon = this.iconMap[iconKey];

					if (icon) {
						this.$set(this.iconData, 'icon', icon)
						if (this.isWeixin) {
							this.svgBase64 = this.svgToBase64(this.svgString);
						}
						this.isIconLoaded = true;
					} else {
						console.error(`未找到图标: ${iconKey}`);
						this.isIconLoaded = true;
					}
				} catch (e) {
					console.error('图标加载失败:', e);
					this.isIconLoaded = true;
				}
			}
		},
		mounted() {
			this.loadIcon();
		}
	}
</script>

<style scoped>
	/* 样式保持不变 */
	.icon-loading {
		display: inline-block;
		background: '#f0f0f0';
		border-radius: 4px;
		animation: loading 1.5s infinite;
	}

	@keyframes loading {
		0% {
			opacity: 0.6;
		}

		50% {
			opacity: 0.3;
		}

		100% {
			opacity: 0.6;
		}
	}
</style>