<template>
  <div>
    <!-- 关联字段 模态框 start -->
    <el-dialog title="关联字段" :visible.sync="associatedVisible" width="800px">
      <p class="title">在下方编辑区输入文本，也可插入变量</p>
      <span class="insert-val" @click="openInsert()">插入变量</span>
      <div
        class="associated-desc"
        contenteditable
        placeholder="请输入或插入变量"
        @blur="onBlur"
        v-html="formData.params"
      ></div>
      <div class="preview">预览：{{ formData.str }}</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="associatedVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveAssociated()"> 确 定 </el-button>
      </div>
    </el-dialog>
    <!-- 关联字段 模态框 end -->
    <!-- 插入变量 模态框 start -->
    <el-dialog title="选择字段" :visible.sync="insertVisible" width="640px">
      <div class="insert-list">
        <p class="insert-header">
          <span class="header-title">所有字段</span>
          <span>{{ selectInsertList.length }}/{{ listData.length }}</span>
        </p>
        <ul>
          <li
            v-for="(item, i) in listData"
            :key="i"
            :class="{ active: selectInsertListKey.includes(item.key) }"
            @click="selectInsert(item)"
          >
            <span class="check"></span>
            <span class="required" :class="{ active: item.isRequired }">*</span>
            <span>{{ item.label }}</span>
          </li>
        </ul>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="insertVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveInsert()"> 确 定 </el-button>
      </div>
    </el-dialog>
    <!-- 插入变量 模态框 end -->
  </div>
</template>

<script>
import wxMessageApi from '../api'
export default {
  props: {
    // 关联字段 模态框状态
    value: {
      type: Boolean,
      default: false
    },
    // 权限key
    powerKey: {
      type: String,
      default: ''
    },
    // 默认字段
    defaultParmas: {
      type: String,
      default: ''
    },
    // 模板索引
    index: {
      type: [Number, String],
      default: 0
    }
  },
  data() {
    //这里存放数据
    return {
      associatedVisible: false,
      insertVisible: false, // 插入变量模态框
      listData: [], // 所有字段
      selectInsertListKey: [], // 选择的字段
      selectInsertList: [], // 选择的字段
      formData: {
        str: '',
        params: ''
      }
    }
  },
  // 监控data中的数据变化
  watch: {
    value(val) {
      this.associatedVisible = val
      if (val) {
        this.selectWxParam()
      }
    },
    associatedVisible(val) {
      if (!val) {
        this.closeModal()
      }
    }
  },
  // 方法集合
  methods: {
    // 模板所有字段
    async selectWxParam() {
      let params = {
        page: 1,
        rows: 200,
        paramName: '',
        paramType: 0,
        powerKey: this.powerKey,
        serviceId: this.$route.query.id
      }
      let result = await wxMessageApi.queryWxParamList(params)
      let datas = result.data
      let list = datas.records || []
      let selectField = []
      list.map(item => {
        selectField.push({
          key: item.paramKey,
          label: item.paramName,
          isRequired: item.isRequired
        })
      })
      this.listData = selectField

      // 默认字段赋值
      this.formData.params = this.defaultParmas
      this.setPreview()
    },
    // 关闭模态框
    closeModal() {
      this.associatedVisible = false
      this.$emit('close')
    },
    // 打开插入变量模态框
    openInsert() {
      this.insertVisible = true
      this.selectInsertListKey = []
      this.selectInsertList = []
    },
    // 选择字段
    selectInsert(row) {
      let index = this.selectInsertList.indexOf(row.key)
      if (index < 0) {
        this.selectInsertListKey.push(row.key)
        this.selectInsertList.push(row)
      } else {
        this.selectInsertListKey.splice(index, 1)
        this.selectInsertList.splice(index, 1)
      }
    },
    // 保存插入的变量
    saveInsert() {
      this.insertVisible = false
      this.selectInsertList.map(item => {
        this.formData.params += '${' + item.key + '}'
      })
      this.setPreview()
    },
    // 设置预览数据
    setPreview() {
      let str = this.formData.params
      if (!str) {
        this.formData.str = str
        return
      }
      this.listData.map(item => {
        let key = '{' + item.key + '}'
        let reg = new RegExp(key, 'g')
        str = str.replace(reg, item.label)
      })
      this.formData.str = str.replaceAll('$', '')
    },
    // 输入框改变
    onBlur(e) {
      let html = e.target.innerText
      let str = html ? html.replace(/<.*?>/g, '') : ''
      this.formData.params = str
      this.setPreview()
    },
    // 保存信息
    saveAssociated() {
      if (!this.formData.params) {
        this.$message({
          type: 'error',
          message: `请输入或插入变量!`
        })
        return
      }
      this.$emit('change', {
        index: this.index,
        data: this.formData.params
      })
      this.associatedVisible = false
    }
  }
}
</script>
<style lang="less" scoped>
.title {
  margin: 0;
  padding: 0;
  font-size: 12px;
  color: #999;
}
.associated-desc {
  border: 1px #ddd solid;
  padding: 10px;
  min-height: 100px;
  &:empty::before {
    content: attr(placeholder);
    color: #ccc;
  }
}
.insert-val {
  color: #409eff;
  cursor: pointer;
}
.insert-list {
  border: 1px #ddd solid;
  border-radius: 6px;
  .insert-header {
    background: #eee;
    margin: 0;
    padding: 10px 15px;
    display: flex;
    .header-title {
      flex: 1;
    }
  }
  ul,
  li {
    margin: 0;
    padding: 0;
    list-style: none;
  }
  ul {
    padding: 10px 0;
    li {
      padding: 10px 25px;
      cursor: pointer;
      .check {
        width: 15px;
        height: 10px;
        border: 4px #eee solid;
        border-right: 0;
        border-top: 0;
        display: inline-block;
        transform: rotate(-45deg);
        transition: all 0.3s;
      }
      .required {
        display: inline-block;
        vertical-align: middle;
        color: red;
        width: 5px;
        margin: 0 5px;
        font-size: 0;
        &.active {
          font-size: 14px;
        }
      }
      &.active {
        color: #409eff;
        .check {
          border-color: #409eff;
        }
      }
    }
  }
}
</style>
