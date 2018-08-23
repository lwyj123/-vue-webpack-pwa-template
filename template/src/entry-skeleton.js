import Vue from 'vue'
import Skeleton from './components/Skeleton'

// 可多骨架屏
export default new Vue({
  components: {
    Skeleton
    // SkeletonDetail
  },
  template: `
    <div>
      <skeleton id="skeleton" style="display: none" />
    </div>`
})