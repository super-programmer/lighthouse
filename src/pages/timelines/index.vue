<template>
  <view class="container">
    <!-- 省份选择器 -->
    <view class="province-selector p-4 bg-white">
      <picker @change="onProvinceChange" :value="selectedProvinceIndex" :range="provinces">
        <view class="picker-view">
          选择省份: {{ provinces[selectedProvinceIndex] }}
          <font-awesome-icon icon="['solid', 'chevron-down']" class="ml-2" />
        </view>
      </picker>
    </view>
    
    <!-- 考试时间表 -->
    <view class="exam-schedule p-4">
      <view class="date-group" v-for="(day, index) in schedule" :key="index">
        <view class="date-title">{{ day.date }}</view>
        <view class="exam-items">
          <view class="exam-item" v-for="(item, i) in day.subjects" :key="i">
            <view class="time">{{ item.time }}</view>
            <view class="subject">{{ item.subject }}</view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import TopNav from '@/components/TopNav.vue'
import FontAwesomeIcon from '@/components/FontAwesomeIcon.vue'

export default {
  components: {
    TopNav,
    FontAwesomeIcon
  },
  data() {
    return {
      provinces: [
        '全国通用', '北京', '上海', '广东', '江苏', 
        '浙江', '山东', '河南', '四川', '湖北'
      ],
      selectedProvinceIndex: 0,
      // 各省高考时间表数据
      provinceSchedules: {
        // 全国通用时间表(大部分省份)
        '全国通用': [
          {
            date: '2025年6月7日',
            subjects: [
              { time: '09:00-11:30', subject: '语文' },
              { time: '15:00-17:00', subject: '数学' }
            ]
          },
          {
            date: '2025年6月8日',
            subjects: [
              { time: '09:00-11:30', subject: '文科综合/理科综合' },
              { time: '15:00-17:00', subject: '外语' }
            ]
          }
        ],
        // 北京时间表
        '北京': [
          {
            date: '2025年6月7日',
            subjects: [
              { time: '09:00-11:30', subject: '语文' },
              { time: '15:00-17:00', subject: '数学' }
            ]
          },
          {
            date: '2025年6月8日',
            subjects: [
              { time: '09:00-11:30', subject: '文科综合/理科综合' },
              { time: '15:00-17:00', subject: '外语' }
            ]
          },
          {
            date: '2025年6月9日',
            subjects: [
              { time: '09:00-11:00', subject: '外语听说测试' }
            ]
          }
        ],
        // 上海时间表
        '上海': [
          {
            date: '2025年6月7日',
            subjects: [
              { time: '09:00-11:30', subject: '语文' },
              { time: '15:00-17:00', subject: '数学' }
            ]
          },
          {
            date: '2025年6月8日',
            subjects: [
              { time: '15:00-17:00', subject: '外语' }
            ]
          },
          {
            date: '2025年6月9日',
            subjects: [
              { time: '08:30-10:30', subject: '思想政治/历史/地理' },
              { time: '13:30-15:30', subject: '物理/化学/生命科学' }
            ]
          }
        ]
        // 可以继续添加其他省份的时间表
      }
    }
  },
  computed: {
    // 根据选择的省份显示对应的时间表
    schedule() {
      const province = this.provinces[this.selectedProvinceIndex]
      return this.provinceSchedules[province] || this.provinceSchedules['全国通用']
    }
  },
  methods: {
    onProvinceChange(e) {
      this.selectedProvinceIndex = e.detail.value
    }
  }
}
</script>

<style scoped>
.container {
  height: 100%;
  background-color: #f3f4f6;
}

.province-selector {
  border-bottom: 1px solid #eee;
}

.picker-view {
  color: #333;
  font-size: 16px;
  display: flex;
  align-items: center;
}

.date-group {
  background-color: white;
  border-radius: 8px;
  margin-bottom: 16px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.date-title {
  background-color: #3B82F6;
  color: white;
  padding: 12px 16px;
  font-weight: bold;
}

.exam-items {
  padding: 12px 16px;
}

.exam-item {
  display: flex;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  align-items: center;
}

.exam-item:last-child {
  border-bottom: none;
}

.time {
  width: 120px;
  color: #666;
  font-size: 14px;
}

.subject {
  flex: 1;
  font-size: 16px;
  color: #333;
}
</style>