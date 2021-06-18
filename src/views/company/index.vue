<template>
  <el-container v-loading="loading" class="view-body">
    <el-main>
      <el-container>
        <el-header class="mb10">
          <el-form inline :model="listQuery">
            <div class="header-left">
              <el-form-item label="企业名称：">
                <el-input
                  v-model.trim="listQuery.name"
                  autocomplete="off"
                  placeholder="请输入企业名称"
                  @keypress.enter.native="handleQueryList('search')"
                />
              </el-form-item>
              <el-form-item label="联系人：">
                <el-input
                  v-model.trim="listQuery.linkman"
                  autocomplete="off"
                  placeholder="请输入联系人"
                  @keypress.enter.native="handleQueryList('search')"
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
              </el-form-item>
            </div>
            <div class="head-right">
              <!-- <el-form-item>
                <el-select v-model="actionType" placeholder="批量操作" :disabled="!(selectedItem&&selectedItem.length)" @change="handleActionTypeChange">
                  <el-option label="删除" value="delete" />
                  <el-option label="启用" value="enable" />
                  <el-option label="禁用" value="disabled" />
                </el-select>
              </el-form-item> -->
              <el-form-item>
                <el-button type="primary" icon="el-icon-plus" @click="handleAddCompanyItem">添 加</el-button>
              </el-form-item>
            </div>
          </el-form>
        </el-header>
        <el-main class="pad-0">
          <!-- 表格展示start -->
          <el-table
            ref="multipleTable"
            :data="list"
            tooltip-effect="dark"
            style="width: 100%"
            :max-height="maxheight"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="index" label="序号" width="60" />
            <el-table-column label="企业编号" width="180" prop="companyCode" align="center" />
            <el-table-column prop="name" label="企业名称" min-width="150" align="center">
              <template slot-scope="scope">
                <span class="active-name" @click="handleToPerssionSetting(scope.row)">{{ scope.row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="address"
              label="联系地址"
              min-width="150"
              align="center"
              show-overflow-tooltip
              :formatter="formatterAddressInfo"
            />
            <el-table-column prop="limkman" label="联系人" width="150" align="center" show-overflow-tooltip />
            <el-table-column label="企业状态" width="100" align="center">
              <template slot-scope="scope">
                <div class="status-item">
                  <div class="status" :class="{ danger: scope.row.status === 0, success: scope.row.status === 1 }" />
                  <div class="status-text">{{ scope.row.status === 0 ? '禁用' : '启用' }}</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="企业属性" width="140" align="center">
              <template v-slot="{ row }">
                <el-tag v-if="row.companyAttribute === 1" type="primary">已认证</el-tag>
                <el-tag v-else type="info">未认证</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="170" align="center">
              <template slot-scope="scope">
                {{ moment(scope.row.createTime).format('YYYY-MM-DD HH:mm:ss') }}
              </template>
            </el-table-column>
            <el-table-column label="操作" min-width="120" align="center">
              <template slot-scope="scope">
                <el-button type="text" size="mini" @click="handleToPerssionSetting(scope.row)">授权管理</el-button>
                <el-button type="text" size="mini" @click="handleUpdateItemStatus(scope.row)">
                  {{ scope.row.status == 0 ? '启 用' : '禁 用' }}
                </el-button>
                <el-button type="text" size="mini" @click="handleUpdateItem(scope.row.id)">编 辑</el-button>
                <!-- <el-button type="text" size="mini" @click="handleDelete(scope.row.id)">删除</el-button> -->
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
      </el-container>
    </el-main>
  </el-container>
</template>

<script>
import companyAPI from '@/api/company'
import pca from '@/assets/JS/pca'
import { setTableMaxHeight } from '@/utils/table-height'

export default {
  data() {
    return {
      loading: false,
      listQuery: {
        page: 1,
        rows: 10,
        name: '',
        linkman: '',
        status: null
      },
      listQueryBack: {},
      list: [],
      total: 0,
      maxheight: '—',
      actionType: null, // 批量操作的类型
      selectedItem: []
    }
  },
  created() {
    this.handleQueryList()
    Object.assign(this.listQueryBack, this.listQuery)
  },
  mounted() {
    this.maxheight = setTableMaxHeight()
  },
  methods: {
    // 重置请求参数，重新请求表格数据
    handleListQueryReset() {
      // ok
      this.listQuery = this._.cloneDeep(this.listQueryBack)
      this.handleQueryList()
    },
    // 获取表格数据
    async handleQueryList(type) {
      if (type) {
        this.listQuery.page = 1
      }
      this.loading = true
      const result = await companyAPI.getCompanyList(this.listQuery).finally(() => {
        this.loading = false
      })
      if (result.code === 200 && result.data) {
        this.total = result.data.total || 0
        this.list = result.data.records || []
      }
    },
    // 分页信息发生改变
    handlePaginationChange(data) {
      this.listQuery = Object.assign(this.listQuery, data)
      this.handleQueryList()
    },
    // 添加公司
    handleAddCompanyItem() {
      this.$router.push('/company/update')
    },
    // 编辑公司
    handleUpdateItem(id) {
      this.$router.push(`/company/update?id=${id}`)
    },
    // 批量删除
    handleDelete(id) {
      const length = id.split(',').length
      // el-icon-delete
      const template = `
      <div class="confirm-wrapper">

        <div class="title"><i class="icon el-icon-delete" ></i>确定要删除${length === 1 ? '此' : '这些'}企业吗？</div>
      </div>`
      this.$confirm(template, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
        customClass: 'button-order'
      })
        .then(() => {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
        })
        .catch(() => {})
    },
    // 表格checkbox 选中状态变化时获取选中项
    handleSelectionChange(val) {
      this.selectedItem = val.map(item => item.id)
    },
    // 选择批量操作类型
    handleActionTypeChange(val) {
      const batch = this.selectedItem.join(',')
      if (val === 'delete') {
        this.handleDelete(batch)
      } else if (val === 'enable') {
        this.handleSetItemEnable(batch)
      } else if (val === 'disabled') {
        this.handleSetItemDisabled(batch)
      }
    },
    // 修改企业状态
    handleUpdateItemStatus(data) {
      if (data.status === 0) {
        this.handleSetItemEnable(data.id)
      } else {
        this.handleSetItemDisabled(data.id)
      }
    },
    // 设置企业状态为启用
    handleSetItemEnable(id) {
      const length = id.split(',').length

      const template = `
      <div class="confirm-wrapper">
        <div class="title"><i  class="icon  el-icon-warning-outline " ></i>确定要启用${
          length === 1 ? '此' : '这些'
        }企业吗？</div>
      </div>`
      this.$confirm(template, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
        customClass: 'button-order'
      })
        .then(async () => {
          const result = await companyAPI.setCompanyItemEnable(id)
          if (result.code === 200) {
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
            this.list.forEach(item => {
              if (item.id === id) {
                item.status = 1
              }
            })
          }
        })
        .catch(() => {})
    },
    // 设置企业状态为禁用
    handleSetItemDisabled(id) {
      const length = id.split(',').length
      const template = `
      <div class="confirm-wrapper">
        <div class="title"><i type='warning' class="icon el-icon-warning-outline" ></i>确定要禁用${
          length === 1 ? '此' : '这些'
        }企业吗？</div>
      </div>`
      this.$confirm(template, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
        customClass: 'button-order'
      })
        .then(() => {
          companyAPI.setCompanyItemDisabled(id).then(res => {
            if (res.code === 200) {
              this.$message({
                type: 'success',
                message: '操作成功!'
              })
              this.list.forEach(item => {
                if (item.id === id) {
                  item.status = 0
                }
              })
            }
          })
        })
        .catch(() => {})
    },
    // 跳转至授权管理页面
    handleToPerssionSetting(item) {
      this.$router.push({
        path: '/company/perssion',
        query: {
          id: item.id,
          name: item.name
        }
      })
    },
    // 格式化表格中的地址信息
    formatterAddressInfo(row, column, cellValue, index) {
      // 获取省份信息
      let matchAddress = ''
      const matchProvice = pca.find(item => {
        return item.value === row.contactProvince
      })
      if (!matchProvice) return matchAddress
      matchAddress += `${matchProvice.label} `
      // 获取市级信息
      const proviceChildren = matchProvice.children || []
      const matchCity = proviceChildren.find(item => {
        return item.value === row.contactCity
      })
      if (!matchCity) return matchAddress
      matchAddress += `${matchCity.label} `
      // 获取区县及信息
      const cityChildren = matchCity.children || []
      const matchDistrict = cityChildren.find(item => {
        return item.value === row.contactMunicipalDistrict
      })
      if (!matchDistrict) return matchAddress
      matchAddress += `${matchDistrict.label} `
      matchAddress += row.contactDetailedAddress || ''
      return matchAddress
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../styles/common.scss';

@import './index.scss';
.el-tag + .el-tag {
  margin-left: 10px;
}
</style>
