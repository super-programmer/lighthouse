<template>
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
		:src="svgBase64" mode="widthFix" />
</template>

<script>
	// // 引入平台判断（不同框架可能有差异，此处以uni-app为例）
	// import {
	// 	isH5,
	// 	isWeixin
	// } from '@/utils/platform'; // 需自行实现平台判断

	export default {
		props: {
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
				isWeixin: this.$isWeixin // 标记是否为微信小程序
			}
		},
		watch: {
			isIconLoaded: {
				immediate: true,
				handler(value) {
					console.log('isIconLoaded 变化:', value);
				}
			},
			icon: {
				immediate: true,
				handler() {
					this.loadIcon();
				}
			}
		},
		computed: {
			iconPath() {
				console.log(this.iconData)
				return this.iconData?.icon?.icon?.[4] || '';
			},
			computedClass() {
				return 'fa-icon';
			},
			// 生成小程序可用的SVG字符串（带样式）
			svgString() {
				if (!this.iconPath) return '';
				return `
        <svg width="${this.size}" height="${this.size}" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
          <path d="${this.iconPath}" fill="${this.color}" />
        </svg>
      `.replace(/\s+/g, ' ').trim(); // 压缩空格
			}
		},
		methods: {
			kebabToPascal(str) {
				const camelCase = str.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
				return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
			},
			// 转换SVG为Base64（适配小程序）
			svgToBase64(svg) {
				// 微信小程序中使用原生API转换Base64
				const buffer = new Uint8Array(svg.length);
				for (let i = 0; i < svg.length; i++) {
					buffer[i] = svg.charCodeAt(i);
				}
				const base64 = wx.arrayBufferToBase64(buffer.buffer);
				console.log(base64);
				return `data:image/svg+xml;base64,${base64}`;
			},
			loadIcon() {
				const [prefix, iconName] = this.icon;
				if (!prefix || !iconName) {
					console.error('图标参数错误:', this.icon);
					return;
				}
				this.isIconLoaded = false;

				try {
					const pascalCaseName = this.kebabToPascal(iconName).replace(/^fa/, '');
					const fullIconName = `fa${pascalCaseName}`;

					// 动态导入图标
					import(`@fortawesome/free-${prefix}-svg-icons/${fullIconName}.js`)
						.then(module => {
							this.$set(this.iconData, 'icon', module.definition)
							// 小程序需要转换为Base64
							if (this.isWeixin) {
								console.log(this.svgString, this.iconPath, 'this.svgString');
								this.svgBase64 = this.svgToBase64(this.svgString);
							}
							this.isIconLoaded = true;
						})
						.catch(err => {
							console.error('图标加载失败1:', err);
							// 尝试备用路径
							import(`@fortawesome/free-${prefix}-svg-icons/icons/${fullIconName}.js`)
								.then(module => {
									this.$set(this.iconData, 'icon', module.definition)
									if (this.isWeixin) {
										this.svgBase64 = this.svgToBase64(this.svgString);
									}
									this.isIconLoaded = true;
								})
								.catch(err2 => {
									console.error('图标加载失败:', err2);
									this.isIconLoaded = true;
								});
						});
				} catch (e) {
					console.error('加载图标出错:', e);
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