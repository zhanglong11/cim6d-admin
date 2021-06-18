<template>
  <el-container class="view-body">
    <el-main>
      <div class="topBtn">
        <i
          class="el-icon-s-grid"
          style="font-size: 30px"
          :style="{ color: viewTypeName === 'table' ? '#409EFF' : '#000' }"
          @click="typeClick('table')"
        ></i>
        <i
          class="el-icon-s-fold"
          style="font-size: 30px"
          :style="{ color: viewTypeName === 'line' ? '#409EFF' : '#000' }"
          @click="typeClick('line')"
        ></i>
      </div>
      <el-container class="mainContainer">
        <div class="tabContainer">
          <el-tabs v-model="activeName" stretch>
            <el-tab-pane label="android" name="android"></el-tab-pane>
            <el-tab-pane label="ios" name="ios"></el-tab-pane>
          </el-tabs>
        </div>
        <div class="scrollZone">
          <template v-if="viewTypeName === 'table'">
            <el-header class="mb10">
              <el-form ref="form" inline :model="queryData">
                <el-form-item prop="updateContent">
                  <el-input v-model="queryData.updateContent" style="width: 200px" placeholder="更新内容" />
                </el-form-item>
                <el-form-item>
                  <el-date-picker
                    v-model="queryData.date"
                    style="width: 300px"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    @change="handleDateChange"
                  >
                  </el-date-picker>
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
              <el-table ref="table" v-loading="loading" border :data="list" tooltip-effect="dark" style="width: 100%">
                <!-- <el-table-column type="selection" width="55" fixed /> -->
                <el-table-column type="index" label="序号" width="60" align="center" />
                <el-table-column prop="updateDate" label="更新时间" width="200" align="center">
                  <template slot-scope="scope">{{ scope.row.updateDate }}</template>
                </el-table-column>
                <el-table-column prop="version" label="是否强制更新" min-width="120" align="center">
                  <template slot-scope="scope">{{
                    scope.row.forceUpdateFlag ? (scope.row.forceUpdateFlag === 1 ? '是' : '否') : '-'
                  }}</template>
                </el-table-column>
                <el-table-column prop="version" label="版本" min-width="100" align="center" />
                <el-table-column prop="updateContent" label="更新内容" min-width="300" align="center" />
                <el-table-column label="操作" width="250" align="center">
                  <template slot-scope="scope">
                    <el-button type="text" size="mini" @click="handleEdit(scope.row)">编辑</el-button>
                    <el-button type="text" size="mini" @click="handleDelete(scope.row)">删除</el-button>
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
          </template>
          <template v-else>
            <TimeLine :lineData="lineData" width="1000"></TimeLine>
          </template>
        </div>
      </el-container>
    </el-main>
    <AddFile v-if="visible" :info="info" :visible.sync="visible" @submit="handleSubmit"></AddFile>
  </el-container>
</template>

<script>
import Api from './api'
import AddFile from './component/AddFile'
import TimeLine from './component/TimeLine'
export default {
  name: 'AppList',
  components: { AddFile, TimeLine },
  data() {
    return {
      appCode: this.$route.params.appCode || '',
      activeName: 'android',
      viewTypeName: 'table',
      loading: false,
      queryData: {
        page: 1,
        rows: 10,
        updateContent: '',
        updateDateBegin: '',
        updateDateEnd: ''
      },
      visible: false,
      queryDataBack: {},
      list: [],
      lineData: [],
      total: 0,
      info: {} //所选列的信息
    }
  },
  computed: {},
  watch: {
    //选择ios还是安卓
    activeName() {
      this.init()
    },
    //选择表格视图还是时间轴视图
    viewTypeName() {
      this.init()
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    //初始化
    init() {
      this.queryData.page = 1
      this.queryData.date = []
      this.queryData.updateDateBegin = ''
      this.queryData.updateDateEnd = ''
      this.queryList()
    },
    // 查询列表
    async queryList() {
      try {
        this.loading = true
        const res = await Api.getRecordList({
          ...this.queryData,
          appCode: this.appCode,
          type: this.activeName === 'android' ? 1 : 2
        })
        this.list = res.data.records || []
        this.total = res.data.total || 0
        this.lineData = _.chain(this.list)
          .sortBy('updateDate')
          .reverse()
          .groupBy(e => moment(e.updateDate).year())
          .map((v, k) => ({ year: k, data: v }))
          .sortBy('year')
          .reverse()
          .value()
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    handleDateChange(e) {
      this.queryData.updateDateBegin = e[0] ? this.moment(e[0]).format('YYYY-MM-DD 00:00:00') : ''
      this.queryData.updateDateEnd = e[1] ? this.moment(e[1]).format('YYYY-MM-DD 23:59:59') : ''
    },
    //切换展示类型
    typeClick(type) {
      this.viewTypeName = type
    },
    //添加
    add() {
      this.visible = true
      this.info = {}
    },
    //编辑
    handleEdit(data) {
      this.visible = true
      this.info = { ...data }
    },
    //删除记录信息
    async handleDelete(row) {
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
      await Api.deleteAppRecord(row.id)
      this.$message.success('删除成功')
      await this.queryList()
    },
    //添加或更新记录
    async handleSubmit(data) {
      this.visible = false
      let params = { ...data, appCode: this.appCode, type: this.activeName === 'android' ? 1 : 2 }
      try {
        if (data.id) {
          await Api.updateAppRecord(params)
          this.$message.success('修改成功')
        } else {
          await Api.addAppRecord(params)
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
    // 搜索
    refresh() {
      Object.assign(this.queryData, this.queryDataBack)
      this.queryList()
    },
    // 重置
    reset() {
      this.$refs.form.resetFields()
      this.init()
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/common.scss';
.view-body {
  overflow: hidden;
}
.topBtn {
  width: 150px;
  position: absolute;
  top: 80px;
  right: 10px;
}
.mainContainer {
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
  .tabContainer {
    width: 200px;
    margin: 0 auto;
    flex: 0 0 70px;
  }
  .scrollZone {
    flex: 1;
    overflow: auto;
  }
}
</style>
