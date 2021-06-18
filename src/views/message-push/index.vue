<template>
  <el-container class="view-body">
    <el-main>
      <el-container>
        <el-header>
          <el-form ref="formRef" inline :model="queryData">
            <el-form-item>
              <el-input v-model="queryData.name" style="width: 200px" placeholder="服务名称" />
            </el-form-item>
            <el-form-item>
              <el-button-group>
                <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
                <el-button icon="el-icon-refresh-left" @click="reset">重置</el-button>
              </el-button-group>
            </el-form-item>
          </el-form>
        </el-header>
        <el-main>
          <el-table ref="table" v-loading="loading" :data="list" tooltip-effect="dark" style="width: 100%">
            <el-table-column type="index" label="序号" width="60" align="center" />
            <el-table-column prop="name" label="服务名称" min-width="150" align="center" />
            <el-table-column prop="serviceCode" label="编码" min-width="150" align="center" />
            <el-table-column prop="description" label="推送状态" min-width="300" align="center">
              <template slot-scope="{ row }">
                <span class="status" :class="{ active: row.wxSendStatus }">{{
                  row.wxSendStatus ? '启用' : '禁用'
                }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200" align="center" fixed="right">
              <template slot-scope="{ row }">
                <el-button type="text" size="mini" @click="toDetails(row)">推送配置</el-button>
                <el-button type="text" size="mini" @click="enableWxMessage(row)">
                  {{ row.wxSendStatus ? '禁用' : '启用' }}
                </el-button>
              </template>
            </el-table-column>
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
export default {
  name: 'MessagePushConfig',
  components: {},
  data() {
    return {
      loading: false,
      queryData: {
        page: 1,
        rows: 10,
        name: ''
      },
      visible: false,
      queryDataBack: {},
      list: [],
      total: 0
    }
  },
  mounted() {
    Object.assign(this.queryDataBack, this.queryData)
    this.queryList()
  },
  methods: {
    // 查询列表
    async queryList() {
      try {
        this.loading = true
        const res = await serviceAPI.getServiceList(this.queryData)
        this.list = res.data.records || []
        this.total = res.data.total || 0
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    // 分页信息发生改变
    handlePaginationChange(data) {
      this.queryData = Object.assign(this.queryData, data)
      this.queryList()
    },
    // 搜索
    search() {
      this.queryData.page = 1
      this.queryList()
    },
    // 重置
    reset() {
      Object.assign(this.queryData, this.queryDataBack)
      this.queryList()
    },
    // 跳转详情
    toDetails(item) {
      let serviceCode = item.serviceCode
      this.$store.commit('user/setServiceId', serviceCode)
      this.$router.push({
        name: 'MessagePushConfigDetails',
        query: {
          id: serviceCode
        }
      })
    },
    // 微信推送配置 启用/禁用
    enableWxMessage(row) {
      let title = row.wxSendStatus ? '禁用' : '启用'
      this.$confirm(`确定要${title}推送服务吗？`, '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          if (row.wxSendStatus) {
            await serviceAPI.disableWxMessage(row.id)
          } else {
            await serviceAPI.enableWxMessage(row.id)
          }
          this.search()
          this.$message({
            type: 'success',
            message: `${title}成功!`
          })
        })
        .catch(() => {})
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/common.scss';
.status {
  color: #999;
  &.active {
    color: #333;
  }
}
</style>
