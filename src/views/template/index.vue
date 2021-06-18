<template>
  <el-container v-loading="loading" class="view-body">
    <el-main>
      <el-container>
        <el-header class="mb10">
          <el-form inline :model="queryData">
            <div class="header-left">
              <el-form-item label="模板名称：">
                <el-input v-model.trim="queryData.templateName" autocomplete="off" placeholder="请输入模板名称" />
              </el-form-item>
              <el-form-item label="状态：">
                <el-select v-model="queryData.status" clearable placeholder="请选择" @change="search()">
                  <el-option v-for="item in statusArr" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
              <el-form-item label="服务名称：">
                <el-select v-model="queryData.serviceId" clearable placeholder="请选择" @change="search()">
                  <el-option v-for="item in serviceList" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="search()">查 询</el-button>
                <el-button icon="el-icon-refresh" @click="handlequeryDataReset()">重 置</el-button>
                <el-button type="primary" icon="el-icon-plus" @click="addTemplate">新建模板</el-button>
              </el-form-item>
            </div>
          </el-form>
        </el-header>
        <el-main class="pad-0">
          <!-- 表格展示start -->
          <el-table ref="multipleTable" :data="list" tooltip-effect="dark" style="width: 100%" :max-height="maxheight">
            <!-- <el-table-column type="selection" width="55" fixed /> -->
            <el-table-column type="index" label="序号" width="60" />
            <el-table-column label="模板名称" min-width="150" prop="templateName" />
            <el-table-column prop="serviceName" label="服务名称" min-width="150" align="center" />
            <el-table-column prop="status" label="状态" width="100" align="center">
              <template slot-scope="scope">
                <div class="status-item">
                  <div class="status" :class="{ success: scope.row.status === 1 }" />
                  <div class="status-text">{{ scope.row.status === 1 ? '已启用' : '禁用' }}</div>
                </div>
              </template>
            </el-table-column>

            <el-table-column prop="createTime" label="创建日期" width="150" align="center">
              <template slot-scope="scope">{{ moment(scope.row.createTime).format('YYYY-MM-DD HH:mm:ss') }}</template>
            </el-table-column>
            <el-table-column prop="remark" label="备注" min-width="120" align="center" show-overflow-tooltip />
            <el-table-column label="操作" width="180" align="left" header-align="center">
              <template slot-scope="scope">
                <el-button
                  v-if="scope.row.status === 0"
                  type="text"
                  size="mini"
                  @click="handleChangeItemStatus(scope.row)"
                  >启用</el-button
                >
                <el-button
                  v-else-if="scope.row.status === 1"
                  type="text"
                  size="mini"
                  @click="handleChangeItemStatus(scope.row)"
                  >禁用</el-button
                >
                <el-button type="text" size="mini" @click="handleEditTemplateInfo(scope.row.id)">编辑</el-button>
                <el-button type="text" size="mini" @click="handleDelete(scope.row.id)">删除</el-button>
              </template></el-table-column
            >
          </el-table>
          <pagination
            :total="total"
            :rows="queryData.rows"
            :current-page="queryData.page"
            @pagination="handlePaginationChange"
          />
        </el-main>
      </el-container>
    </el-main>
  </el-container>
</template>

<script>
import serviceAPI from '@/api/service'
import templateApi from '@/api/template'
import { setTableMaxHeight } from '@/utils/table-height'

export default {
  name: 'ServiceTemplate',
  data() {
    return {
      loading: false,
      queryData: {
        page: 1,
        rows: 10,
        templateName: '',
        serviceId: '',
        status: ''
      },
      queryDataBack: {},
      list: [],
      total: 0,
      maxheight: '—',
      statusArr: [
        {
          label: '全部',
          value: ''
        },
        {
          label: '启用',
          value: 1
        },
        {
          label: '禁用',
          value: 0
        }
      ],
      serviceList: []
    }
  },
  mounted() {
    Object.assign(this.queryDataBack, this.queryData)
    this.getServiceList()
    this.queryList()
    this.maxheight = setTableMaxHeight()
  },
  methods: {
    // 获取所有的服务项列表
    async getServiceList() {
      const result = await serviceAPI.getServiceList({
        status: 1,
        page: 1,
        rows: 200
      })
      const datas = result.data
      const list = datas.records || []
      const serviceList = []
      list.map(item => {
        serviceList.push({
          label: item.name,
          value: item.id
        })
      })
      this.serviceList = serviceList
    },
    // 查询列表
    async queryList() {
      try {
        this.loading = true
        const result = await templateApi.queryServiceTemplateList(this.queryData)
        const datas = result.data
        const list = datas.records || []
        this.total = datas.total || 0
        this.list = list
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    // 新建模板
    addTemplate() {
      this.$router.push({
        name: 'AddTemplate'
      })
    },
    // 查询
    search() {
      this.queryData.page = 1
      this.queryList()
    },
    // 重置请求参数，重新请求表格数据
    handlequeryDataReset() {
      Object.assign(this.queryData, this.queryDataBack)
      this.queryList()
    },
    // 分页信息发生改变
    handlePaginationChange(data) {
      this.queryData = Object.assign(this.queryData, data)
      this.queryList()
    },
    // 删除模板
    handleDelete(id) {
      const template = `
      <div class="confirm-wrapper">
        <div class="title"><i class="icon el-icon-delete" ></i>确定要删除这个模版吗？</div>
      </div>`
      this.$confirm(template, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
        customClass: 'button-order'
      })
        .then(() => {
          this.deleteServiceTemplate(id)
        })
        .catch(() => {})
    },
    // 删除模板 - 异步
    async deleteServiceTemplate(id) {
      await templateApi.deleteServiceTemplate(id)
      this.$message({
        type: 'success',
        message: '操作成功!'
      })
      this.search()
    },
    // 编辑模板信息
    handleEditTemplateInfo(id) {
      this.$router.push(`/template/edit?id=${id}`)
    },
    // 修改当前模板状态
    handleChangeItemStatus(item) {
      this.$confirm(`确认要${item.status === 1 ? '禁用' : '启用'}此服务吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: item.status === 1 ? 'error' : 'info',
        customClass: 'button-order'
      })
        .then(() => {
          this.updateStatusServiceTemplate(item)
        })
        .catch(() => {})
    },
    // 删除模板 - 异步
    async updateStatusServiceTemplate(item) {
      const status = item.status === 1 ? 0 : 1
      await templateApi.updateStatusServiceTemplate(item.id, status)
      this.$message({
        type: 'success',
        message: '操作成功!'
      })
      item.status = item.status === 1 ? 0 : 1
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/common.scss';
@import './index.scss';
</style>
