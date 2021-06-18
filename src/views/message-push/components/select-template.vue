<template>
  <div>
    <!-- 选择模板 模态框 start -->
    <el-dialog title="选择模板" :visible.sync="templateVisible" width="800px">
      <el-button type="primary" icon="el-icon-refresh" style="margin-bottom: 15px" @click="getTempMsgList(1)"
        >刷新</el-button
      >
      <el-table
        ref="tableRef"
        :data="templateList"
        border
        class="custom-table"
        @select="selectionTemplate"
        @row-click="clickRow"
      >
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column type="index" label="序号" width="60" align="center"></el-table-column>
        <el-table-column label="模板ID" prop="templateId" min-width="200"></el-table-column>
        <el-table-column label="标题" prop="title" min-width="200"></el-table-column>
        <el-table-column label="操作" width="120" align="center" fixed="right">
          <template slot-scope="{ row }">
            <el-button type="text" @click="getTemplateDetails(row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="templateVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveTemplate()"> 确 定 </el-button>
      </div>
    </el-dialog>
    <!-- 选择模板 模态框 end -->
    <!-- 模板详情 模态框 start -->
    <el-dialog title="模板详情" :visible.sync="templateDetailsVisible" width="800px">
      <div class="template-details">
        <div class="details-left">
          <p class="title">模板标题：{{ templateDetails.title }}</p>
          <div class="details-content">
            <span>详细内容：</span>
            <div class="desc" v-html="templateDetails.contentHtml"></div>
          </div>
        </div>
        <div class="details-right">
          <p>内容示例</p>
          <div class="details-example">
            <div class="desc" v-html="templateDetails.exampleHtml"></div>
            <p class="details-view"><span>详情</span></p>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="templateDetailsVisible = false">取 消</el-button>
        <el-button type="primary" @click="applyTemplate()"> 应 用 </el-button>
      </div>
    </el-dialog>
    <!-- 模板详情 模态框 end -->
  </div>
</template>

<script>
import wxMessageApi from '../api'

export default {
  props: {
    // 模板列表 模态框状态
    value: {
      type: Boolean,
      default: false
    },
    // 默认选中的模板
    selectTemplateRow: {
      type: [String, Object],
      default: ''
    }
  },
  data() {
    return {
      templateVisible: false, // 模板模态框状态
      templateDetailsVisible: false,
      templateList: [], // 模板列表
      templateDetails: {} // 模板详情
    }
  },
  //监控data中的数据变化
  watch: {
    value(val) {
      this.templateVisible = val
      if (val) {
        this.getTempMsgList()
      }
    },
    templateVisible(val) {
      if (!val) {
        this.closeTemplate()
      }
    }
  },
  //方法集合
  methods: {
    // 关闭
    closeTemplate() {
      this.templateVisible = false
      this.$emit('onClose')
    },
    // 获取模板列表
    async getTempMsgList(type = 0) {
      let result = await wxMessageApi.getTempMsgList(type)
      let datas = result.data || []
      datas.map(item => {
        item.contentHtml = item.content ? item.content.replace(/↵|\n/g, '<br>') : ''
        let contentList = item.content
          ? item.content
              .replace(/↵|\n/g, '<br>')
              .replace(/}}.*?{{/g, '}},{{')
              .split(',')
          : []
        let list = []
        contentList.map(e => {
          list.push(e.replace(/{{|}}/g, '').split('.')[0])
        })
        item.contentList = list
        item.exampleHtml = item.example ? item.example.replace(/↵|\n/g, '<br>') : '暂无...'
      })
      this.templateList = datas
      this.templateList.map(item => {
        if (item.templateId === this.selectTemplateRow.templateId) {
          this.$nextTick(() => {
            this.clickRow(item)
          })
        }
      })
    },
    // 查看模板详情
    getTemplateDetails(row) {
      this.templateDetailsVisible = true
      this.templateDetails = Object.assign({}, row)
    },
    // 表格行点击事件
    clickRow(row) {
      this.$refs['tableRef'].clearSelection()
      this.$refs['tableRef'].toggleRowSelection(row, true)
    },
    // 选择模板
    selectionTemplate(selection, row) {
      this.clickRow(row)
    },
    // 保存模板
    saveTemplate() {
      let selection = this.$refs['tableRef'].selection
      if (selection.length === 0) {
        this.$message({
          type: 'error',
          message: `请选择模板!`
        })
        return
      }
      this.applyTemplate(selection[0])
    },
    // 应用模板
    applyTemplate(row) {
      if (row) {
        this.templateDetails = Object.assign({}, row)
      }
      this.templateDetailsVisible = false
      this.templateVisible = false
      this.$emit('change', this.templateDetails)
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../config-details.scss';
.custom-table {
  ::v-deep th .el-checkbox {
    display: none;
  }
}
</style>
