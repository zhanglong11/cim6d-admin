<template>
  <el-container v-loading="loading" class="view-body is-footer">
    <el-main>
      <el-container>
        <el-header class="mb10">
          <div class="base-info mb5">
            <div><span class="info-label">当前企业名称：</span>{{ companyName }}</div>
          </div>
          <el-form inline :model="listQuery">
            <div class="header-left">
              <el-form-item label="服务名称：">
                <el-input
                  v-model.trim="listQuery.serviceName"
                  autocomplete="off"
                  placeholder="请输入服务名称"
                  @keypress.enter.native="handleQueryList('search')"
                />
              </el-form-item>
              <el-form-item label="状态：">
                <el-select v-model="listQuery.status" placeholder="请选择" @change="handleQueryList('search')">
                  <el-option v-for="item in statusArr" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="handleQueryList('search')">查 询</el-button>
                <el-button icon="el-icon-refresh" @click="handleListQueryReset">重 置</el-button>
              </el-form-item>
            </div>
            <div class="head-right">
              <el-form-item>
                <el-button type="primary" icon="el-icon-plus" @click="handleAddPowerItem">服务授权</el-button>
              </el-form-item>
            </div>
          </el-form>
        </el-header>
        <el-main class="pad-0">
          <!-- 表格展示start -->
          <el-table ref="multipleTable" :data="list" tooltip-effect="dark" style="width: 100%" :max-height="maxheight">
            <el-table-column type="index" label="序号" width="60" />
            <el-table-column label="服务编码" width="150" prop="serviceCode" />
            <el-table-column prop="serviceName" label="服务名称" min-width="150" align="center" />
            <el-table-column prop="status" label="服务状态" width="100" align="center">
              <template slot-scope="scope">
                <div class="status-item">
                  <div class="status" :class="{ danger: scope.row.status === 2, success: scope.row.status === 1 }" />
                  <div v-if="scope.row.status === 2" class="status-text">已过期</div>
                  <div v-else-if="scope.row.status === 1" class="status-text">已生效</div>
                  <div v-else-if="scope.row.status === 0" class="status-text">未生效</div>
                </div>
              </template>
            </el-table-column>

            <el-table-column prop="startTime" label="生效日期" width="150" align="center">
              <template slot-scope="scope">
                {{ moment(scope.row.startTime).format('YYYY-MM-DD HH:mm:ss') }}
              </template>
            </el-table-column>
            <el-table-column prop="expireTime" label="失效日期" width="150" align="center">
              <template slot-scope="scope">
                {{ moment(scope.row.expireTime).format('YYYY-MM-DD HH:mm:ss') }}
              </template>
            </el-table-column>
            <!-- <el-table-column prop="remark" label="备注" min-width="120" align="center" show-overflow-tooltip /> -->
            <el-table-column label="操作" width="300" align="center">
              <template slot-scope="scope">
                <el-button type="text" size="mini" @click="handleCancelPerssion(scope.row)">取消授权</el-button>
                <el-button type="text" size="mini" @click="setPower(scope.row)">功能配置</el-button>
                <el-button type="text" size="mini" @click="handleUpdateItemTime(scope.row)">服务有效期</el-button>
              </template></el-table-column
            >
          </el-table>
          <pagination
            :total="total"
            :limit="listQuery.rows"
            :current-page="listQuery.page"
            @pagination="handlePaginationChange"
          />
        </el-main>

        <!-- 新增或编辑服务 start -->
        <el-dialog
          :title="dialogPowerTitle"
          :visible.sync="dialogPowerVisible"
          :close-on-click-modal="false"
          :close-on-press-escape="false"
          width="500px"
          @close="handleInitPowerFormDialog"
        >
          <el-form ref="powerForm" :model="powerForm" label-width="120px" :rules="powerRules">
            <el-form-item label="服务名称：" prop="serviceId">
              <el-select
                v-if="!Boolean(powerForm.id)"
                v-model="powerForm.serviceId"
                placeholder="请选择服务名称"
                :disabled="Boolean(powerForm.id)"
                @change="handleServiceItemSelect"
              >
                <el-option
                  v-for="item in computedServiceList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <el-input v-else :value="powerForm.serviceName" disabled />
            </el-form-item>
            <el-form-item label="生效日期：" prop="startTime">
              <el-date-picker
                v-model="powerForm.startTime"
                type="datetime"
                format="yyyy-MM-dd HH:mm:ss "
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="生效日期"
                default-time="00:00:00"
              />
            </el-form-item>
            <el-form-item label="失效日期：" prop="expireTime">
              <el-date-picker
                v-model="powerForm.expireTime"
                type="datetime"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="失效日期"
                default-time="23:59:59"
              />
            </el-form-item>
            <!-- <el-form-item label="备注：">
              <el-input v-model="powerForm.remark" type="textarea" auto-height :rows="3" placeholder="请输入备注" />
            </el-form-item> -->
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" :loading="powerBtnLoading" @click="handleSubmitPowerForm">确 定</el-button>
            <el-button @click="dialogPowerVisible = false">取 消</el-button>
          </div>
        </el-dialog>
        <!-- 新增或编辑服务end -->
      </el-container>
    </el-main>
  </el-container>
</template>

<script>
import companyAPI from '@/api/company'
import serviceAPI from '@/api/service'
import { setTableMaxHeight } from '@/utils/table-height'
import _ from 'lodash'
export default {
  name: 'PerssionManage',
  data() {
    const checkExpireTime = (rule, value, callback) => {
      if (new Date(value).getTime() <= new Date().getTime()) {
        return callback(new Error('失效日期必须大于当前时间'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      companyId: this.$route.query.id || '',
      companyName: this.$route.query.name || '',
      listQuery: {
        page: 1,
        rows: 10,
        serviceName: '',
        status: null,
        companyId: ''
      },
      list: [],
      total: 0,
      maxheight: '—',
      statusArr: [
        {
          label: '请选择',
          value: null
        },
        {
          label: '已过期',
          value: 2
        },
        {
          label: '已生效',
          value: 1
        },
        {
          label: '未生效',
          value: 0
        }
      ],
      // 新增或编辑服务相关参数
      dialogPowerVisible: false,
      dialogPowerTitle: '',
      powerForm: {
        companyId: '',
        serviceId: '',
        serviceCode: '',
        serviceName: '',
        startTime: '',
        id: '',
        expireTime: ''
      },
      powerFormBack: {},
      powerRules: {
        serviceId: [
          {
            required: true,
            message: '请输入服务名称',
            trigger: ['blur', 'change']
          }
        ],
        startTime: [
          {
            required: true,
            message: '请选择生效时间',
            trigger: 'blur'
          }
        ],
        expireTime: [
          {
            required: true,
            message: '请选择失效时间',
            trigger: 'blur'
          },
          {
            validator: checkExpireTime,
            trigger: 'blur'
          }
        ]
      },
      powerBtnLoading: false,
      serviceList: [], // 所有的服务项列表
      templateList: [],
      matchedTemplateList: []
    }
  },
  computed: {
    computedServiceList() {
      return _.differenceWith(this.serviceList, this.list, ({ value }, { serviceId }) => value === serviceId)
    }
  },

  created() {
    this.init()
  },
  mounted() {
    this.maxheight = setTableMaxHeight()
  },
  methods: {
    // 初始化页面参数和状态
    init() {
      this.listQuery.companyId = this.powerForm.companyId = this.companyId
      Object.assign(this.powerFormBack, this.powerForm)
      this.getServiceList()
    },
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
          value: item.id,
          code: item.serviceCode
        })
      })
      this.serviceList = serviceList
      this.handleQueryList()
    },
    // 选中服务后匹配对应的模板
    handleServiceItemSelect(value) {
      const item = _.find(this.serviceList, { value })
      this.powerForm.serviceCode = item.code
      this.powerForm.serviceName = item.label
    },

    // 重置请求参数，重新请求表格数据
    handleListQueryReset() {
      this.listQuery = {
        page: 1,
        rows: this.listQuery.rows,
        companyId: this.listQuery.companyId,
        serviceName: '',
        serviceStatus: null
      }
      this.handleQueryList()
    },
    // 获取表格数据
    async handleQueryList(type) {
      if (type) {
        this.listQuery.page = 1
      }
      this.loading = true
      const result = await companyAPI.queryServiceAuthList(this.listQuery)
      const datas = result.data
      const list = datas.records || []
      this.total = datas.total || 0
      this.list = list
      this.loading = false
    },
    // 分页信息发生改变
    handlePaginationChange(data) {
      this.listQuery = Object.assign(this.listQuery, data)
      this.handleQueryList()
    },
    // 取消授权
    handleCancelPerssion(data) {
      const template = `
      <div class="confirm-wrapper">
        <div class="title"><i  class="icon el-icon-delete" ></i>确定要取消该服务的授权吗？</div>
      </div>`
      this.$confirm(template, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
        customClass: 'button-order'
      })
        .then(async () => {
          const params = {
            companyId: data.companyId,
            serviceId: data.serviceId
          }
          const result = await companyAPI.cancelAuthorizationItem(params)
          if (result.code === 200) {
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
            this.handleQueryList()
          }
        })
        .catch(() => {})
    },

    // 修改服务有效期
    handleUpdateItemTime(data) {
      // ok
      this.dialogPowerTitle = '服务有效期'
      this.dialogPowerVisible = true
      this.powerForm = {
        id: data.id,
        serviceId: data.serviceId,
        serviceCode: data.serviceCode,
        serviceName: data.serviceName,
        startTime: data.startTime,
        expireTime: data.expireTime,
        companyId: data.companyId,
        remark: data.remark
      }
    },
    // 服务授权，为当前企业添加可以使用的服务
    handleAddPowerItem() {
      // ok
      this.dialogPowerVisible = true
      this.dialogPowerTitle = '服务授权'
      this.powerForm.startTime = this.moment().format('YYYY-MM-DD') + ' 00:00:00'
      const nextMonth = this.moment().months([this.moment().month() + 1])
      this.powerForm.expireTime = this.moment(nextMonth).format('YYYY-MM-DD') + ' 23:59:59'
    },
    // 提交服务授权信息
    handleSubmitPowerForm() {
      this.$refs.powerForm.validate(valid => {
        if (valid) {
          this.powerBtnLoading = true
          console.log(this.powerForm)
          companyAPI
            .serviceAuthCompany(this.powerForm)
            .then(result => {
              if (result.code === 200) {
                this.powerBtnLoading = false
                this.dialogPowerVisible = false
                this.handleQueryList()
                this.$message({
                  type: 'success',
                  message: '操作成功!'
                })
              }
            })
            .catch(err => {
              if (err.code === 500) {
                this.powerBtnLoading = false
                this.dialogPowerVisible = false
              }
            })
        }
      })
    },
    // 关闭之前还原参数和验证结果
    handleInitPowerFormDialog() {
      Object.assign(this.powerForm, this.powerFormBack)
      this.$nextTick(() => {
        this.$refs.powerForm.clearValidate()
        this.powerBtnLoading = false
      })
    },
    // 功能配置
    setPower(item) {
      this.$router.push({
        name: 'CompanyPower',
        query: {
          id: item.serviceId,
          companyId: this.companyId
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/common.scss';
@import './index.scss';
</style>
