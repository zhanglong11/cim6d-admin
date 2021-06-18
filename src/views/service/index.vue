<template>
  <el-container v-loading="loading" class="view-body">
    <el-main>
      <el-container>
        <el-header class="mb10">
          <el-form inline :model="listQuery">
            <el-form-item label="服务名称：">
              <el-input v-model.trim="listQuery.name" autocomplete="off" :maxlength="50" placeholder="请输入服务名称" />
            </el-form-item>
            <el-form-item label="服务编码：">
              <el-input
                v-model.trim="listQuery.serviceCode"
                :maxlength="50"
                autocomplete="off"
                placeholder="请输入服务编码"
              />
            </el-form-item>
            <el-form-item label="状态：">
              <el-select v-model="listQuery.status" placeholder="请选择" @change="handleQueryList('search')">
                <el-option label="启用" :value="1" />
                <el-option label="禁用" :value="0" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="handleQueryList('search')">查 询</el-button>
              <el-button icon="el-icon-refresh" @click="handleListQueryReset">重 置</el-button>
              <el-button type="primary" icon="el-icon-plus" @click="handleAddServiceItem">新 建</el-button>
            </el-form-item>
          </el-form>
        </el-header>
        <el-main class="pad-0">
          <!-- 表格展示start -->
          <el-table ref="multipleTable" :data="list" tooltip-effect="dark" style="width: 100%" :max-height="maxheight">
            <el-table-column type="index" label="序号" width="60" />
            <el-table-column label="编码" width="150" prop="serviceCode" align="center" />
            <el-table-column prop="name" label="名称" min-width="150" align="center" />
            <el-table-column prop="creatorName" label="创建人" width="120" align="center" />
            <el-table-column prop="status" label="状态" width="100" align="center">
              <template slot-scope="scope">
                <div class="status-item">
                  <div class="status" :class="{ danger: scope.row.status === 0, success: scope.row.status === 1 }" />
                  <div class="status-text">{{ scope.row.status === 0 ? '禁用' : '启用' }}</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="150" align="center">
              <template slot-scope="scope">{{ moment(scope.row.createTime).format('YYYY-MM-DD HH:mm:ss') }}</template>
            </el-table-column>
            <el-table-column prop="remark" label="备注" min-width="120" align="center" show-overflow-tooltip />
            <el-table-column label="操作" min-width="160" align="center">
              <template slot-scope="scope">
                <el-button type="text" size="mini" @click="handleToModule(scope.row.id)">模块管理</el-button>
                <el-button type="text" size="mini" @click="handleUpdateItemStatus(scope.row)">{{
                  scope.row.status == 0 ? '启用' : '禁用'
                }}</el-button>
                <el-button type="text" size="mini" @click="handleUpdateItem(scope.row)">编辑</el-button>
                <el-button type="text" size="mini" @click="deleteServiceItem(scope.row.id)">删除</el-button>
              </template></el-table-column
            >
          </el-table>
          <pagination
            :total="total"
            :rows="listQuery.rows"
            :current-page="listQuery.page"
            @pagination="handlePaginationChange"
          />
        </el-main>
        <!-- 新增、编辑服务基本信息dialog 开始 -->
        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="500px" @close="handleInitDialog">
          <el-form ref="form" :model="form" label-width="140px" :rules="rules">
            <el-form-item label="名称：" prop="name">
              <el-input v-model.trim="form.name" :maxlength="50" autocomplete="off" placeholder="请输入服务名称" />
            </el-form-item>
            <el-form-item label="编码：" prop="serviceCode">
              <el-input
                v-model="form.serviceCode"
                :maxlength="50"
                :disabled="!isFormAdd"
                autocomplete="off"
                placeholder="请输入服务编码"
              />
            </el-form-item>
            <el-form-item label="服务状态：" prop="status">
              <el-radio-group v-model="form.status">
                <el-radio :label="1">启用</el-radio>
                <el-radio :label="0">禁用</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="备注：">
              <el-input v-model.trim="form.remark" :maxlength="50" autocomplete="off" placeholder="请输入描述" />
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" :loading="confirmBtnLoading" @click="handleSubmit">确 定</el-button>
            <el-button @click="dialogVisible = false">取 消</el-button>
          </div>
        </el-dialog>
        <!-- 新增、编辑服务基本信息dialog end -->
      </el-container>
    </el-main>
  </el-container>
</template>

<script>
import serviceAPI from '@/api/service'
import { setTableMaxHeight } from '@/utils/table-height'
export default {
  data() {
    return {
      loading: false,
      listQuery: {
        page: 1,
        rows: 10,
        name: '',
        serviceCode: ''
      },

      list: [],
      maxheight: '—',
      total: 0,
      // 添加、编辑服务基本信息
      dialogVisible: false,
      dialogTitle: '',
      form: {
        id: '',
        name: '',
        serviceCode: '',
        remark: '',
        status: 1
      },
      isFormAdd: true, // 是否是新建
      rules: {
        name: [
          {
            required: true,
            message: '请输入服务名称',
            trigger: 'blur'
          }
        ],
        serviceCode: [
          {
            required: true,
            message: '请输入服务编码',
            trigger: 'blur'
          }
        ],

        status: [
          {
            required: true,
            type: 'number',
            message: '请选择服务状态',
            trigger: 'change'
          }
        ]
      },
      confirmBtnLoading: false
    }
  },
  mounted() {
    this.handleQueryList()
  },
  methods: {
    // 重置请求参数，重新请求表格数据
    handleListQueryReset() {
      // ok
      this.listQuery = {
        page: 1,
        rows: this.listQuery.rows,
        name: '',
        code: '',
        status: null
      }
      this.handleQueryList()
    },
    // 获取表格数据
    async handleQueryList(type) {
      // ok
      if (type) {
        this.listQuery.page = 1
      }
      this.loading = true
      serviceAPI
        .getServiceList(this.listQuery)
        .then(result => {
          if (result.code === 200) {
            this.list = (result.data && result.data.records) || []
            this.total = (result.data && result.data.total) || 0
            this.maxheight = setTableMaxHeight()
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 分页信息发生改变
    handlePaginationChange(data) {
      // ok
      this.listQuery = Object.assign(this.listQuery, data)
      this.handleQueryList()
    },
    // 新建服务名称
    handleAddServiceItem() {
      // ok
      this.dialogVisible = true
      this.dialogTitle = '新建服务'
    },
    // 编辑服务信息
    handleUpdateItem(data) {
      // ok
      this.isFormAdd = false
      this.dialogVisible = true
      this.dialogTitle = '编辑服务'
      this.form = {
        id: data.id,
        name: data.name,
        serviceCode: data.serviceCode,
        remark: data.remark,
        status: data.status
      }
    },
    // 删除服务
    deleteServiceItem(id) {
      this.$confirm(`确认要删除此服务吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error',
        customClass: 'button-order'
      })
        .then(async () => {
          await serviceAPI.deleteServiceItem(id)
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.handleQueryList('search')
        })
        .catch(() => {})
    },
    // 提交新建编辑信息
    handleSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.confirmBtnLoading = true
          if (this.form.id) {
            this.handleSubmitUpdateInfo()
          } else {
            this.handleSubmitAddInfo()
          }
        }
      })
    },
    // 提交编辑信息
    async handleSubmitUpdateInfo() {
      // ok
      try {
        await serviceAPI.updateServiceItem(this.form)
        this.confirmBtnLoading = false
        var currentItem = this.list.find(item => item.id === this.form.id)
        Object.assign(currentItem, this.form)
        this.dialogVisible = false
      } catch (e) {
        this.confirmBtnLoading = false
      }
    },
    // 提交新建信息
    async handleSubmitAddInfo() {
      try {
        await serviceAPI.AddServiceItem(this.form)
        this.confirmBtnLoading = false
        this.dialogVisible = false
        this.handleQueryList('search')
      } catch (e) {
        this.confirmBtnLoading = false
      }
    },
    // 关闭之前还原参数和验证结果
    handleInitDialog() {
      // ok
      this.$refs.form.clearValidate()
      this.form = {
        id: '',
        name: '',
        serviceCode: '',
        remark: '',
        status: 1
      }
      this.dialogTitle = ''
      this.confirmBtnLoading = false
      this.isFormAdd = true
    },
    // 修改服务状态：启用/禁用
    handleUpdateItemStatus(data) {
      // ok
      this.$confirm(`确认要${data.status === 1 ? '禁用' : '启用'}此服务吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: data.status === 1 ? 'error' : 'info',
        customClass: 'button-order'
      })
        .then(async () => {
          if (data.status === 1) {
            await serviceAPI.setServiceItemDisabled(data.id)
          } else {
            await serviceAPI.setServiceItemEnable(data.id)
          }
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.handleQueryList()
        })
        .catch(() => {})
    },
    // 跳转至模块管理页面
    handleToModule(id) {
      this.$router.push(`/service/module/${id}`)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../styles/common.scss';
@import './index.scss';
</style>
