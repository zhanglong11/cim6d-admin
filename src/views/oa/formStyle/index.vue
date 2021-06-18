<template>
  <el-container v-loading="loading" class="view-body">
    <el-main>
      <el-container>
        <el-header class="mb10">
          <el-form inline :model="queryData">
            <div class="header-left">
              <el-form-item label="分组名称：">
                <el-input v-model.trim="queryData.name" autocomplete="off" placeholder="请输入分组名称" />
              </el-form-item>
              <el-form-item label="是否禁用：">
                <el-select v-model="queryData.flag" clearable placeholder="请选择" @change="search()">
                  <el-option label="否" :value="0" />
                  <el-option label="是" :value="1" />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="search()">查 询</el-button>
                <el-button icon="el-icon-refresh" @click="handlequeryDataReset()">重 置</el-button>
                <el-button type="primary" icon="el-icon-plus" @click="addFormStyle()">新建审批样式</el-button>
              </el-form-item>
            </div>
          </el-form>
        </el-header>
        <el-main class="pad-0">
          <!-- 表格展示start -->
          <el-table ref="multipleTable" :data="list" tooltip-effect="dark" style="width: 100%" :max-height="maxheight">
            <el-table-column type="index" label="序号" width="60" />
            <el-table-column label="审批样式名称" show-overflow-tooltip prop="name" min-width="150" />
            <el-table-column label="使用次数" prop="count" width="120" align="center" />
            <el-table-column label="使用表单" prop="formList" min-width="150" />
            <el-table-column label="摘要" prop="template" min-width="150">
              <template slot-scope="{ row }">
                <div class="remark" v-html="templateFormat(row)"></div>
              </template>
            </el-table-column>
            <el-table-column prop="creatorName" show-overflow-tooltip label="创建人" width="150" align="center" />
            <el-table-column prop="createTime" label="创建日期" width="150" align="center" />
            <el-table-column label="操作" width="180" align="center">
              <template slot-scope="{ row }">
                <el-button type="text" size="mini" @click="editFormStyle(row)">编辑</el-button>
                <el-button type="text" size="mini" @click="enableAuditStyle(row)">
                  <span v-if="row.flag" style="color: red">启用</span>
                  <span v-else>禁用</span>
                </el-button>
              </template></el-table-column
            >
          </el-table>
          <pagination
            :total="total"
            :rows="queryData.rows"
            :current-page="queryData.page"
            @pagination="changePagination"
          />
        </el-main>
      </el-container>
    </el-main>
  </el-container>
</template>

<script>
import { OaApi } from '../api'
import { setTableMaxHeight } from '@/utils/table-height'

export default {
  name: 'FormStyle',
  data() {
    return {
      loading: false,
      queryData: {
        name: '',
        flag: '',
        page: 1,
        rows: 10
      },
      queryDataBack: {},
      list: [],
      total: 0,
      maxheight: '—',
      editModal: false,
      editModalParams: {
        title: '',
        isEdit: false,
        data: ''
      },
      formItemHash: {
        flag: '单选框',
        remark: '多行文本',
        uploadFile: '文件上传',
        uploadImage: '图片上传',
        areaSelect: '省/市/区选择',
        contacts: '人员选择',
        company: '公司选择',
        companyDepartments: '公司及部门选择',
        table: '自定义表格',
        grid: '栅格布局',
        report: '表格布局',
        tabs: '标签页',
        divider: '分割线',

        input: '单行文本',
        textarea: '多行文本',
        number: '计数器',
        radio: '单选框',
        checkbox: '多选框',
        time: '时间选择器',
        date: '日期选择器',
        rate: '评分',
        color: '颜色选择器',
        select: '下拉选择框',
        switch: '开关',
        text: '文本',
        slider: '滑块',
        imgupload: '图片上传',
        fileupload: '文件'
      }
    }
  },
  mounted() {
    Object.assign(this.queryDataBack, this.queryData)
    this.queryList()
    this.maxheight = setTableMaxHeight()
  },
  methods: {
    // 查询列表
    async queryList() {
      try {
        this.loading = true
        const result = await OaApi.queryAuditStyleList(this.queryData)
        const datas = result.data
        let list = datas.records || []
        this.list = list
        this.total = datas.total
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    // 分页信息发生改变
    changePagination(data) {
      this.queryData = Object.assign(this.queryData, data)
      this.queryList()
    },
    // 新建审批样式
    addFormStyle() {
      this.$router.push({
        name: 'AddFormStyle'
      })
    },
    // 编辑审批样式
    editFormStyle(item) {
      this.$router.push({
        name: 'EditFormStyle',
        query: {
          id: item.id
        }
      })
    },
    // 保存成功
    changeEditModal() {
      this.editModal = false
      this.queryList()
    },
    // 查询
    search() {
      this.queryList()
    },
    // 重置请求参数，重新请求表格数据
    handlequeryDataReset() {
      Object.assign(this.queryData, this.queryDataBack)
      this.queryList()
    },
    // 启用/禁用 审批样式
    enableAuditStyle(item) {
      let msg = `确定要${!item.flag ? '禁用' : '启用'} <b>${item.name}</b> 吗？`
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true
      })
        .then(() => {
          this.enableAuditStyleSuccess(item.id, item.flag)
        })
        .catch(() => {})
    },
    // 启用/禁用 审批样式 - 异步
    async enableAuditStyleSuccess(id, flag) {
      console.log('启用/禁用', flag, !flag)
      if (flag) {
        await OaApi.enableAuditStyle(id)
      } else {
        await OaApi.disableAuditStyle(id)
      }

      this.$message({
        type: 'success',
        message: '操作成功!'
      })
      this.search()
    },
    // 处理摘要
    templateFormat(row) {
      let templateJson = JSON.parse(row.template)
      let strArr = templateJson.list.map(item => {
        let str = ''
        let flag = item.rules.some(ruleItem => ruleItem.required === true)
        let type = item.type === 'custom' ? item.el : item.type
        return `${flag ? '必填' : '非必填'}：${item.name}：${this.formItemHash[type]}`
      })
      console.log(111, templateJson)
      return strArr.join('<br/>')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/common.scss';
</style>
