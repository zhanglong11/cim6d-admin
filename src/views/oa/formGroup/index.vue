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
              <el-form-item label="项目类型：">
                <el-select v-model="queryData.projectType" clearable placeholder="请选择" @change="search()">
                  <el-option
                    v-for="item in projectTypeList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="search()">查 询</el-button>
                <el-button icon="el-icon-refresh" @click="handlequeryDataReset()">重 置</el-button>
                <el-button type="primary" icon="el-icon-plus" @click="addFormGroup()">新建分组</el-button>
              </el-form-item>
            </div>
          </el-form>
        </el-header>
        <el-main class="pad-0">
          <!-- 表格展示start -->
          <el-table ref="multipleTable" :data="list" tooltip-effect="dark" style="width: 100%" :max-height="maxheight">
            <el-table-column type="index" label="序号" width="60" />
            <el-table-column label="分组名称" prop="name" />
            <el-table-column prop="projectType" label="项目类型" align="center" show-overflow-tooltip>
              <template slot-scope="{ row }">
                {{ $getLabelFromArg('projectType', row.projectType) }}
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建日期" width="150" align="center">
              <template slot-scope="scope">{{ moment(scope.row.createTime).format('YYYY-MM-DD HH:mm:ss') }}</template>
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
            <el-table-column label="操作" width="180" align="center">
              <template slot-scope="{ row }">
                <el-button type="text" size="mini" @click="editFormGroup(row)">编辑</el-button>
                <el-button type="text" size="mini" @click="deleteFormGroup(row)">删除</el-button>
              </template></el-table-column
            >
          </el-table>
        </el-main>
      </el-container>
    </el-main>
    <EditGroup :visible.sync="editModal" :modalParams="editModalParams" @change="changeEditModal" />
  </el-container>
</template>

<script>
import { OaApi } from '../api'
import { setTableMaxHeight } from '@/utils/table-height'
import EditGroup from './editFormGroup'

export default {
  name: 'FormGroup',
  components: {
    EditGroup
  },
  data() {
    return {
      loading: false,
      projectTypeList: this.$getArgList('projectType'),
      queryData: {
        name: '',
        flag: 2,
        projectType: ''
      },
      queryDataBack: {},
      list: [],
      maxheight: '—',
      editModal: false,
      editModalParams: {
        title: '',
        isEdit: false,
        data: ''
      },
      sortParams: {
        id: '',
        sort: 0
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
        const result = await OaApi.queryFormGroupList(this.queryData)
        const datas = result.data || []
        this.list = datas
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    // 新建分组
    addFormGroup() {
      this.editModalParams.title = '新建分组'
      this.editModalParams.isEdit = false
      this.editModalParams.data = ''
      this.editModal = true
    },
    // 编辑分组
    editFormGroup(item) {
      this.editModalParams.title = '编辑分组'
      this.editModalParams.isEdit = true
      this.editModalParams.data = item
      this.editModal = true
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
    // 删除分组
    deleteFormGroup(item) {
      let msg = `确定要删除 <b>${item.name}</b> 分组吗？`
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true
      })
        .then(() => {
          this.deleteFormGroupSuccess(item.id)
        })
        .catch(() => {})
    },
    // 删除模板 - 异步
    async deleteFormGroupSuccess(id) {
      await OaApi.deleteFormGroup(id)
      this.$message({
        type: 'success',
        message: '操作成功!'
      })
      this.search()
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
      await OaApi.updateSortFormGroup(this.sortParams)
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
</style>
