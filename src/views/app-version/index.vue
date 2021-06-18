<template>
  <el-container class="view-body">
    <el-main>
      <el-container>
        <el-header class="mb10">
          <el-form ref="form" inline :model="queryData">
            <el-form-item>
              <el-input v-model="queryData.name" style="width: 200px" placeholder="应用名称" />
            </el-form-item>
            <el-form-item>
              <el-button-group>
                <el-button type="primary" icon="el-icon-search" @click="refresh">搜索</el-button>
                <el-button icon="el-icon-refresh-left" @click="reset">重置</el-button>
              </el-button-group>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-plus" @click="add">添加</el-button>
            </el-form-item>
          </el-form>
        </el-header>
        <el-main>
          <el-table ref="table" v-loading="loading" :data="list" tooltip-effect="dark" style="width: 100%">
            <!-- <el-table-column type="selection" width="55" fixed /> -->
            <el-table-column type="index" label="序号" width="60" align="center" />
            <el-table-column prop="name" label="应用名称" min-width="150" align="center" />
            <el-table-column prop="appCode" label="应用编码" min-width="150" align="center" />
            <el-table-column prop="icon" label="应用图标" width="150" align="center">
              <template slot-scope="scope">
                <ImagePreview :id="scope.row.icon"></ImagePreview>
              </template>
            </el-table-column>
            <el-table-column prop="description" label="应用简介" min-width="300" align="center" />
            <el-table-column prop="ios" label="二维码" align="center">
              <el-table-column prop="iosQrCode" label="ios" width="100" align="center">
                <template slot-scope="scope">
                  <ImagePreview :id="scope.row.iosQrCode"></ImagePreview>
                </template>
              </el-table-column>
              <el-table-column prop="androidQrCode" label="android" width="100" align="center">
                <template slot-scope="scope">
                  <ImagePreview :id="scope.row.androidQrCode"></ImagePreview>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column prop="android" label="链接" align="center">
              <el-table-column prop="iosUrl" label="ios" width="200" align="center"></el-table-column>
              <el-table-column prop="androidUrl" label="android" width="200" align="center"></el-table-column>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="180" align="center">
              <template slot-scope="scope">{{ moment(scope.row.createTime).format('YYYY-MM-DD HH:mm:ss') }}</template>
            </el-table-column>
            <el-table-column label="操作" width="250" align="center" fixed="right">
              <template slot-scope="scope">
                <el-button type="text" size="mini" @click="handleEdit(scope.row)">编辑</el-button>
                <el-button type="text" size="mini" @click="toRecord(scope.row.appCode)">更新记录</el-button>
                <!-- <el-button type="text" size="mini" @click="handleDelete(scope.row.id)">删除</el-button> -->
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
    <AddApp v-if="visible" :visible.sync="visible" :info="info" @submit="handleSubmit"></AddApp>
  </el-container>
</template>

<script>
import Api from './api'
import AddApp from './component/AddApp'
export default {
  name: 'AppList',
  components: { AddApp },
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
      total: 0,
      info: {} //应用信息
    }
  },
  computed: {},
  watch: {},
  mounted() {
    this.queryList()
  },
  methods: {
    // 查询列表
    async queryList() {
      try {
        this.loading = true
        const res = await Api.getList(this.queryData)
        this.list = res.data.records || []
        this.total = res.data.total || 0
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    //添加
    add() {
      this.visible = true
      this.info = {}
    },
    //编辑操作
    handleEdit(data) {
      this.visible = true
      this.info = { ...data }
    },
    //跳转到更新记录
    toRecord(appCode) {
      console.log('跳转记录')
      this.$router.push({
        name: `AppVersionRecordList`,
        params: {
          appCode: appCode
        }
      })
    },
    //删除app
    async handleDelete(id) {
      let res = await this.$confirm('删除当前数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
      if (!res) return
      await Api.deleteApp(id)
      this.$message.success('删除成功')
      await this.queryList()
    },
    //添加或提交app
    async handleSubmit(data) {
      try {
        if (data.id) {
          await Api.updateApp(data)
          this.$message.success('修改成功')
        } else {
          await Api.addApp(data)
          this.$message.success('添加成功')
        }
        await this.queryList()
        this.visible = false
      } catch (e) {
        this.$message.error('操作失败,请重试')
      }
    },
    // 分页信息发生改变
    handlePaginationChange(data) {
      this.queryData = Object.assign(this.queryData, data)
      this.queryList()
    },
    // 重置请求参数，重新请求表格数据
    refresh() {
      Object.assign(this.queryData, this.queryDataBack)
      this.queryList()
    },
    // 重置
    reset() {
      this.$refs.form.resetFields()
      this.queryData.page = 1
      this.queryList()
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/common.scss';
</style>
