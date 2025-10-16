<template>
  <view class="region-picker">
    <!-- 显示定位图标或当前城市 -->
    <view 
      class="picker-display" 
      @click="showPicker = true"
    >
      <template v-if="!selectedCity">
        <font-awesome-icon 
          :icon="['solid', 'map-marker-alt']" 
          size="18" 
          color="#3B82F6"
        />
        <text class="placeholder">获取定位中...</text>
      </template>
      <template v-else>
        <text>{{ selectedCity }}</text>
        <font-awesome-icon 
          :icon="['solid', 'angle-down']" 
          size="14" 
          color="#666"
		  class="ml-2"
        />
      </template>
    </view>

    <!-- 地区选择器弹窗 -->
    <uni-popup 
      v-model="showPicker" 
      mode="bottom"
      @close="onPopupClose"
	  style="min-height: 300px;"
	  :z-index="9999"
    >
      <uni-data-picker 
        @change="onRegionChange" 
        :localdata="regionData" 
        mode="region"
        :value="selectedRegion"
        ref="regionPicker"
      />
      <view class="picker-buttons">
        <button class="cancel-btn" @click="showPicker = false">取消</button>
        <button class="confirm-btn" @click="confirmSelection">确认</button>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import uniDataPicker from '@dcloudio/uni-ui/lib/uni-data-picker/uni-data-picker.vue'
import uniPopup from '@dcloudio/uni-ui/lib/uni-popup/uni-popup.vue'
import { regionData } from '@/utils/regionData'
import { getLocation, findRegionByCity } from '@/utils/location'
import FontAwesomeIcon from './FontAwesomeIcon.vue'

export default {
  components: {
    uniDataPicker,
    uniPopup,
    FontAwesomeIcon
  },
  data() {
    return {
      regionData,
      selectedRegion: [],
      selectedCity: '', // 显示的城市名
      showPicker: false,
      tempRegion: [] // 临时存储选择的地区
    }
  },
  mounted() {
    this.initLocation()
  },
  methods: {
    async initLocation() {
      // 1. 先检查本地缓存
      const cachedCity = uni.getStorageSync('selectedCity')
      const cachedRegion = uni.getStorageSync('selectedRegion')
      
      if (cachedCity && cachedRegion) {
        this.selectedCity = cachedCity
        this.selectedRegion = cachedRegion
        this.$emit('change', cachedRegion)
        return
      }

      // 2. 无缓存则获取定位
      try {
        const location = await getLocation()
        console.log('定位结果:', location)
        const regionInfo = findRegionByCity(regionData, location[1])
        
        if (regionInfo) {
          this.selectedRegion = [
            regionInfo.province,
            regionInfo.city,
            regionInfo.district
          ]
          this.selectedCity = regionInfo.city
          // 写入缓存
          this.saveToStorage()
          this.$emit('change', this.selectedRegion)
        } else {
          this.selectedCity = '选择城市'
        }
      } catch (error) {
        console.error('定位失败:', error)
        this.selectedCity = '选择城市'
      }
    },

    onRegionChange(e) {
      // 暂存选择的地区
      this.tempRegion = e.detail.value
    },

    confirmSelection() {
      if (this.tempRegion.length) {
        this.selectedRegion = this.tempRegion
        this.selectedCity = this.tempRegion[1] || this.tempRegion[0]
        this.saveToStorage()
        this.$emit('change', this.selectedRegion)
      }
      this.showPicker = false
    },

    onPopupClose() {
      // 重置临时选择
      this.tempRegion = [...this.selectedRegion]
    },

    saveToStorage() {
      // 保存到本地缓存
      uni.setStorageSync('selectedCity', this.selectedCity)
      uni.setStorageSync('selectedRegion', this.selectedRegion)
    }
  }
}
</script>

<style scoped>
.picker-display {
  display: inline-flex;
  align-items: center;
  padding: 6px 10px;
  cursor: pointer;
}

.placeholder {
  margin-left: 4px;
  color: #999;
  font-size: 14px;
}

.arrow-icon {
  margin-left: 4px;
  margin-top: 2px;
}

.picker-buttons {
  display: flex;
  border-top: 1px solid #eee;
  margin-top: 10px;
}

.cancel-btn, .confirm-btn {
  flex: 1;
  height: 44px;
  line-height: 44px;
  background: transparent;
  border: none;
  font-size: 16px;
}

.cancel-btn {
  color: #666;
}

.confirm-btn {
  color: #3B82F6;
}
</style>