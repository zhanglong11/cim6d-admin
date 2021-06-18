<template>
  <el-container v-loading="loading" class="view-body">
    <el-main>
      <el-container>
        <el-header class="mb10">
          <el-form inline :model="queryData">
            <div class="header-left">
              <el-form-item label="表单名称：">
                <el-input v-model.trim="queryData.name" autocomplete="off" placeholder="请输入表单名称" />
              </el-form-item>
              <el-form-item label="项目类型：">
                <el-select v-model="queryData.projectType" clearable placeholder="请选择" @change="changeProjectType">
                  <el-option
                    v-for="item in projectTypeList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="表单分组：">
                <el-select v-model="queryData.groupId" clearable placeholder="请选择" @change="search()">
                  <el-option v-for="item in groupList" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
              <el-form-item label="状态：">
                <el-select v-model="queryData.status" clearable placeholder="请选择" @change="search()">
                  <el-option label="草稿" :value="0" />
                  <el-option label="已发布" :value="1" />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="search()">查 询</el-button>
                <el-button icon="el-icon-refresh" @click="handlequeryDataReset()">重 置</el-button>
                <el-button type="primary" icon="el-icon-plus" @click="addForm()">新建表单</el-button>
              </el-form-item>
            </div>
          </el-form>
        </el-header>
        <el-main class="pad-0">
          <!-- 表格展示start -->
          <el-table ref="multipleTable" :data="list" tooltip-effect="dark" style="width: 100%" :max-height="maxheight">
            <el-table-column type="index" label="序号" width="60" />
            <el-table-column label="图标" prop="icon" width="60">
              <template slot-scope="{ row }">
                <el-image style="width: 30px; height: 30px" :src="row.icon" fit="fill"></el-image>
              </template>
            </el-table-column>
            <el-table-column label="表单名称" prop="name" min-width="160" show-overflow-tooltip>
              <div slot-scope="{ row }" class="form-name">
                <p class="name">{{ row.name }}</p>
                <p class="description">{{ row.description }}</p>
              </div>
            </el-table-column>
            <el-table-column label="所属小组" prop="groupName" min-width="120" align="center" show-overflow-tooltip />
            <el-table-column label="PowerKey" prop="powerKey" width="160" align="center" />
            <el-table-column prop="projectType" label="项目类型" align="center" show-overflow-tooltip>
              <template slot-scope="{ row }">
                {{ $getLabelFromArg('projectType', row.projectType) }}
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建日期" width="150" align="center" />
            <el-table-column label="状态" width="120" align="center">
              <template slot-scope="{ row }">
                <span v-if="row.status" style="color: green">已发布</span>
                <span v-else style="color: #999">草稿</span>
              </template>
            </el-table-column>
            <el-table-column label="排序" prop="sort" width="100" align="center">
              <template slot-scope="{ row }">
                <el-popover placement="right" title="修改排序" width="150" trigger="hover" @show="changeSort(row)">
                  <el-form>
                    <el-form-item>
                      <el-input-number v-model="sortParams.sort" :min="0" :precision="0" label="请输入排序" />
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" size="mini" @click="saveSort()">保存</el-button>
                    </el-form-item>
                  </el-form>
                  <el-button slot="reference" type="text">{{ row.sort }}</el-button>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200" align="center">
              <template slot-scope="{ row }">
                <el-tooltip
                  v-if="row.status && row.flag === 2 && row.formType === 1"
                  effect="dark"
                  content="重置所有项目表单流程配置"
                  placement="bottom"
                >
                  <el-button type="text" size="mini" @click="resetForm(row)">重置表单</el-button>
                </el-tooltip>

                <el-button v-if="!row.status" type="text" size="mini" @click="publishForm(row.id)">发布</el-button>
                <el-button type="text" size="mini" @click="editForm(row)">编辑</el-button>
                <el-button type="text" size="mini" @click="deleteForm(row)">删除</el-button>
              </template>
            </el-table-column>
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
  name: 'FormMange',
  data() {
    return {
      loading: false,
      projectTypeList: this.$getArgList('projectType'),
      total: 0,
      queryData: {
        name: '',
        flag: 2,
        projectType: '',
        groupId: '',
        page: 1,
        rows: 10,
        status: ''
      },
      queryDataBack: {},
      list: [],
      maxheight: '—',
      groupList: [],
      sortParams: {
        id: '',
        sort: 0
      }
    }
  },
  mounted() {
    Object.assign(this.queryDataBack, this.queryData)
    this.queryFormGroupSelectList()
    this.queryList()
    this.maxheight = setTableMaxHeight()
  },
  methods: {
    // 选择项目类型
    changeProjectType(e) {
      this.queryData.groupId = ''
      this.queryFormGroupSelectList(e)
      this.search()
    },
    // 表单分组下拉列表
    async queryFormGroupSelectList(projectType = '') {
      let params = {
        flag: 2,
        name: '',
        projectType
      }
      let result = await OaApi.queryFormGroupSelectList(params)
      let datas = result.data || []
      let list = []
      datas.map(item => {
        list.push({
          label: item.name,
          value: item.id
        })
      })
      this.groupList = list
    },
    // 查询列表
    async queryList() {
      try {
        this.loading = true
        let result = await OaApi.queryFormList(this.queryData)
        let datas = result.data
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
      console.log(4444, data)
      this.queryData = Object.assign(this.queryData, data)
      this.queryList()
    },
    // 新建表单
    addForm() {
      this.$router.push({
        name: 'AddForm'
      })
    },
    // 编辑表单
    editForm(item) {
      this.$router.push({
        name: 'EditForm',
        query: {
          id: item.id
        }
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
      console.log(5555, this.queryData)
      this.queryList()
    },
    // 删除表单
    deleteForm(item) {
      let msg = `确定要删除 <b>${item.name}</b> 表单吗？`
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true
      })
        .then(() => {
          this.deleteFormSuccess(item.id)
        })
        .catch(() => {})
    },
    // 删除表单 - 异步
    async deleteFormSuccess(id) {
      await OaApi.deleteForm(id)
      this.$message({
        type: 'success',
        message: `操作成功!`
      })
      this.handlequeryDataReset()
    },
    // 表单重置
    resetForm(item) {
      let msg = `确定要重置所有项目 <b>${item.name}</b> 表单流程配置吗？`
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true
      })
        .then(() => {
          this.resetFormSuccess(item.id)
        })
        .catch(() => {})
    },
    // 表单重置 - 异步
    async resetFormSuccess(id) {
      await OaApi.resetForm(id)
      this.$message({
        type: 'success',
        message: `操作成功!`
      })
      this.handlequeryDataReset()
    },
    // 修改排序
    changeSort(row) {
      this.sortParams = {
        id: row.id,
        sort: row.sort
      }
    },
    // 保存排序
    async saveSort() {
      await OaApi.updateSortForm(this.sortParams)
      this.$message({
        type: 'success',
        message: `操作成功!`
      })
      this.queryList()
    },
    // 表单发布
    async publishForm(id) {
      await OaApi.publishForm(id)
      this.$message({
        type: 'success',
        message: `操作成功!`
      })
      this.queryList()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/common.scss';
.form-name {
  p {
    margin: 0;
    padding: 0;
  }
  .description {
    color: #999;
    font-size: 12px;
  }
}
</style>
