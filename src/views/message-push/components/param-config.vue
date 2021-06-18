<template>
  <div>
    <el-dialog :title="`${powerName} - 字段库配置`" :visible.sync="dialogVisible" width="800px">
      <el-form inline :model="queryData">
        <el-form-item>
          <el-input v-model="queryData.paramName" style="width: 200px" placeholder="字段名称" />
        </el-form-item>
        <el-form-item>
          <el-button-group>
            <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
            <el-button icon="el-icon-refresh-left" @click="reset">重置</el-button>
          </el-button-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-plus" @click="editWxParam()">新增字段</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="tableData">
        <el-table-column prop="paramName" label="字段名称" min-width="150"></el-table-column>
        <el-table-column prop="paramKey" label="字段key" min-width="200"></el-table-column>
        <el-table-column min-width="200" prop="paramTypeStr" label="字段类型"></el-table-column>
        <el-table-column label="操作" width="200" align="center" fixed="right">
          <template slot-scope="{ row }">
            <el-button type="text" size="mini" @click="editWxParam(row)">编辑</el-button>
            <el-button type="text" size="mini" @click="deleteWxParam(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination"
        background
        layout="prev, pager, next"
        :total="total"
        @current-change="changePage"
      >
      </el-pagination>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="closeDialog()">关闭</el-button>
      </div>
    </el-dialog>
    <!-- 新增/编辑字段 模态框 start -->
    <el-dialog :title="formTitle" :visible.sync="formVisible" width="640px">
      <el-form ref="formRef" :model="formData" :label-width="labelWidth" :rules="formRules">
        <el-form-item label="字段名称" prop="paramName">
          <el-input v-model="formData.paramName" :max="20" style="width: 280px" placeholder="请输入..." />
        </el-form-item>
        <el-form-item label="字段key" prop="paramKey">
          <el-input v-model="formData.paramKey" :max="20" style="width: 280px" placeholder="请输入..." />
        </el-form-item>
        <el-form-item label="字段是否必填" required>
          <el-radio v-model="formData.isRequired" :label="1">是</el-radio>
          <el-radio v-model="formData.isRequired" :label="0">否</el-radio>
        </el-form-item>
        <el-form-item label="字段类型" prop="paramType">
          <el-checkbox-group v-model="formData.paramType">
            <el-checkbox :label="0">模板字段</el-checkbox>
            <el-checkbox :label="1">推送字段</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="formVisible = false">取 消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="saveParam()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 新增/编辑字段 模态框 start -->
  </div>
</template>

<script>
import wxMessageApi from '../api'
export default {
  props: {
    // 模态框显示状态
    value: {
      type: Boolean,
      default: false
    },
    // 权限key
    powerKey: {
      type: String,
      default: ''
    },
    // 当前模块
    powerName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      dialogVisible: false,
      tableData: [],
      total: 0,
      queryData: {
        page: 1,
        rows: 6,
        paramName: '',
        powerKey: this.powerKey
      },
      queryDataBack: {},
      formVisible: false,
      formTitle: '新增字段',
      formData: {
        paramName: '',
        paramKey: '',
        isRequired: 1,
        paramType: [],
        powerKey: this.powerKey
      },
      formDataBack: {},
      labelWidth: '120px',
      isAdd: true,
      btnLoading: false,
      formRules: {
        paramName: [{ required: true, message: '请输入字段名称', trigger: 'blur' }],
        paramKey: [{ required: true, message: '请输入字段key', trigger: 'blur' }],
        paramType: [{ required: true, message: '请选择字段类型', trigger: 'change' }]
      }
    }
  },
  watch: {
    value(val) {
      this.dialogVisible = val
    },
    dialogVisible(val) {
      if (!val) {
        this.closeDialog()
      } else {
        this.queryList()
      }
    },
    powerKey(val) {
      this.queryData.powerKey = val
      this.queryDataBack.powerKey = val
      this.formData.powerKey = val
      this.formDataBack.powerKey = val
    }
  },
  mounted() {
    Object.assign(this.queryDataBack, this.queryData)
    Object.assign(this.formDataBack, this.formData)
  },
  //方法集合
  methods: {
    // 关闭列表模态框
    closeDialog() {
      this.dialogVisible = false
      this.$emit('onClose')
    },
    // 字段库配置 查询列表(根据serviceId和powerKey来查询字段列表)
    async queryList() {
      let result = await wxMessageApi.queryWxParamList({ ...this.queryData, serviceId: this.$route.query.id })
      let datas = result.data
      let list = datas.records || []
      let total = datas.total || 0
      list.map(item => {
        item.paramTypeStr = item.paramType.replace(/,/g, '，').replace(/0/g, '模板字段').replace(/1/g, '推送字段')
      })
      this.tableData = list
      this.total = total
    },
    // 当前页码改变
    changePage(page) {
      this.queryData.page = page
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
    // 删除字段
    deleteWxParam(id) {
      this.$confirm(`确定要删除字段吗？`, '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await wxMessageApi.deleteWxParam(id)
          this.search()
          this.$message({
            type: 'success',
            message: `删除成功!`
          })
        })
        .catch(() => {})
    },
    // 编辑字段
    async editWxParam(row) {
      this.formTitle = row ? '编辑字段' : '新增字段'
      this.isAdd = !row

      this.formVisible = true
      this.$nextTick(() => {
        this.$refs['formRef'].resetFields()
        if (row) {
          this.formData = Object.assign({}, row)
          let paramType = this.formData.paramType.split(',').sort().map(Number)
          this.formData.paramType = paramType
        } else {
          Object.assign(this.formData, this.formDataBack)
        }
      })
    },
    // 保存字段
    saveParam() {
      this.$refs.formRef.validate(async valid => {
        if (valid) {
          this.btnLoading = true
          try {
            this.formData.paramType = this.formData.paramType.sort().join(',')
            if (this.isAdd) {
              await wxMessageApi.addWxParam({ ...this.formData, serviceId: this.$route.query.id })
            } else {
              await wxMessageApi.updateWxParam({ ...this.formData, serviceId: this.$route.query.id })
            }
            this.$message({
              type: 'success',
              message: `操作成功!`
            })
            this.formVisible = false
            this.btnLoading = false
            this.search()
          } catch (e) {
            this.btnLoading = false
          }
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.pagination {
  padding: 10px 0;
  text-align: right;
}
</style>
