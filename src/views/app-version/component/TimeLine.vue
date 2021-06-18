<template>
  <div class="lineContainer" :style="{ width: width + 'px' }">
    <div v-for="(item, index) of lineData" :key="index + 'yyy'">
      <div class="year">{{ item.year }}</div>
      <div
        v-for="(childItem, childIndex) of item.data"
        :key="childIndex + 'xxx' + item.year"
        class="detail"
        :class="childIndex % 2 === 0 ? 'right' : 'left'"
      >
        <div class="detailInnerContainer">
          <div>
            <div>
              <p>版本：{{ childItem.version }}</p>
              <p>app类型：{{ childItem.type === 1 ? 'android' : 'ios' }}</p>
              <p class="content-p" v-html="'更新内容：<br />' + childItem.updateContent.replaceAll('\n', '<br />')"></p>
            </div>
          </div>
        </div>
        <div class="time">
          <p class="infoDate">{{ moment(childItem.updateDate).format('MM.DD') }}</p>
          <p class="infoYear">{{ moment(childItem.updateDate).format('YYYY') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TimeLine',
  components: {},
  props: {
    width: {
      type: [Number, String],
      default: 1000
    },
    lineData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {}
  },
  created() {},
  methods: {}
}
</script>

<style scoped lang="less">
.lineContainer {
  text-align: center;
  margin: 0 auto;
  .year {
    position: relative;
    font-size: 20px;
    font-weight: bolder;
    width: 50%;
    left: 50%;
    height: 40px;
    line-height: 40px;
    text-align: left;
    padding-left: 50px;
    border-left: 2px #2baee9 solid;
    &:before {
      content: '';
      display: block;
      position: absolute;
      width: 30px;
      height: 30px;
      background-color: red;
      border-radius: 50%;
      left: -16px;
      top: 5px;
    }
  }
  .detail {
    position: relative;
    width: 50%;
    text-align: left;
    &.right {
      left: 50%;
      padding: 15px 0 15px 50px;
      border-left: 2px #2baee9 solid;
      &:before {
        content: '';
        display: block;
        position: absolute;
        width: 16px;
        height: 16px;
        background-color: #2db7f5;
        border-radius: 50%;
        left: -9px;
        top: 50%;
        transform: translateY(-50%);
      }
      .detailInnerContainer {
        border: 1px dashed #2baee9;
        border-radius: 5px;
        padding: 10px;
        position: relative;
        &:before {
          content: '';
          display: block;
          position: absolute;
          width: 0px;
          height: 0px;
          border: 16px transparent solid;
          border-right: 16px #2baee9 solid;
          left: -32px;
          top: 50%;
          transform: translateY(-50%);
        }
      }
      .time {
        position: absolute;
        left: -82px;
        top: 50%;
        transform: translateY(-50%);
        text-align: right;
      }
    }
    &.left {
      transform: translateX(2px);
      padding: 15px 50px 15px 0;
      border-right: 2px #2baee9 solid;
      &:after {
        content: '';
        display: block;
        position: absolute;
        width: 16px;
        height: 16px;
        background-color: #2db7f5;
        border-radius: 50%;
        right: -9px;
        top: 50%;
        transform: translateY(-50%);
      }
      .detailInnerContainer {
        border: 1px dashed #2baee9;
        border-radius: 5px;
        padding: 10px;
        position: relative;
        &:after {
          content: '';
          display: block;
          position: absolute;
          width: 0px;
          height: 0px;
          border: 16px transparent solid;
          border-left: 16px #2baee9 solid;
          right: -32px;
          top: 50%;
          transform: translateY(-50%);
        }
      }
      .time {
        position: absolute;
        right: -82px;
        top: 50%;
        transform: translateY(-50%);
      }
    }
  }
}
.time {
  p {
    margin: 5px 0;
    &.infoDate {
      font-size: 16px;
      font-weight: bold;
      color: #000;
    }
    &.infoYear {
      font-size: 14px;
      color: #999;
    }
  }
}
.content-p {
  line-height: 1.8;
}
</style>
