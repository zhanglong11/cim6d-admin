<template>
  <el-container v-loading="loading" class="view-body">
    <el-aside width="360px">
      <el-button class="fuild-btn mb10" type="primary" @click="hanldeAddGroupItem(true)">新增模块</el-button>
      <el-input v-model.trim="argText" suffix-icon="el-icon-search" class="mb10" />
      <el-card shadow="always" :body-style="{ padding: '0' }">
        <el-tree
          ref="treeRef"
          :data="treeData"
          :props="treeProps"
          node-key="argCode"
          default-expand-all
          highlight-current
          :expand-on-click-node="false"
          :filter-node-method="filterNode"
          @node-click="handleGroupItemClick"
        >
          <span slot-scope="{ node, data }" class="custom-tree-node">
            <span>{{ node.label }}</span>
            <span>
              <el-tooltip class="item" effect="dark" content="编辑" placement="bottom">
                <i class="el-icon el-icon-edit" @click.stop="handleUpdateGroupItem(data, data.argFlag > 1)" />
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="删除" placement="bottom">
                <i class="el-icon el-icon-remove-outline" @click.stop="deleteGroupArg(data)" />
              </el-tooltip>
              <el-tooltip v-if="data.argFlag > 1" class="item" effect="dark" content="添加" placement="bottom">
                <i class="el-icon el-icon-circle-plus-outline" @click.stop="hanldeAddGroupItem(false, data)" />
              </el-tooltip>
            </span>
          </span>
        </el-tree>
        <!-- <template v-if="computedGroupList&&computedGroupList.length">
          <div v-for="item in computedGroupList" :key="item.id" class="group-item" :class="{'active-item':activeItem.id===item.id}" @click="handleGroupItemClick(item)">
            <div class="arg-text">{{ item.argText }}</div>
            <el-tooltip class="item" effect="dark" content="编辑" placement="bottom">
              <i class="el-icon el-icon-edit-outline" @click.stop="handleUpdateGroupItem(item, false)" />
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="bottom">
              <i class="el-icon el-icon-delete" @click.stop="deleteGroupArg(item.id)" />
            </el-tooltip>
          </div>
        </template>
        <div v-else class="group-item emptyTip">暂无参数分组信息</div> -->
      </el-card>
    </el-aside>
    <el-main>
      <el-alert v-if="activeItem.argText" title="温馨提示：参数禁止随意变更，可能会导致系统异常" type="success" />
      <div v-if="activeItem.argText" class="base-info mb10">
        <div><span class="info-label">参数分组名称：</span>{{ activeItem.argText }}</div>
        <div><span class="info-label">编码：</span>{{ activeItem.argCode }}</div>
      </div>
      <!-- 操作类型 列表 start-->
      <div class="mb10 action-wrapper">
        <el-form inline>
          <el-form-item label="参数名称：">
            <el-input v-model.trim="listQuery.argText" autocomplete="off" placeholder="请输入参数名称" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="handleQueryList">查 询</el-button>
            <el-button icon="el-icon-refresh" @click="handleListQueryReset">重 置</el-button>
            <el-button type="primary" icon="el-icon-plus" :disabled="!activeItem.argText" @click="handleAddParamsItem"
              >新增参数</el-button
            >
          </el-form-item>
        </el-form>
        <!-- <el-button type="primary" :disabled="selectItem.length===0" @click="handleDeleteByBatch">批量删除</el-button> -->
      </div>
      <!-- 操作类型 列表 end -->
      <!-- 表格展示start -->
      <!--  -->
      <el-table
        ref="multipleTable"
        :data="list"
        tooltip-effect="dark"
        :max-height="maxheight"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <!-- <el-table-column type="selection" width="55" fixed /> -->
        <el-table-column label="参数名称" min-width="120" prop="argText" />
        <el-table-column label="操作" min-width="120" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="handleUpdateParamsItem(scope.row)">编 辑</el-button>
            <el-button type="text" size="mini" @click="handleDeleteSingleItem(scope.row.id)"> 删 除</el-button>
          </template></el-table-column
        >
      </el-table>
    </el-main>
    <!-- 新增、编辑参数分组dialog 开始 -->
    <el-dialog :title="groupTitle" :visible.sync="groupVisible" width="500px" @close="handleInitDialog">
      <el-form ref="groupForm" :model="groupForm" label-width="130px" :rules="groupRules">
        <el-form-item v-if="!groupIsModule" label="模块名称：" prop="argText">
          <el-select v-model.trim="groupForm.module">
            <el-option v-for="(item, i) in moduleList" :key="i" :value="item.value" :label="item.label" />
          </el-select>
        </el-form-item>
        <el-form-item :label="`${groupIsModule ? '模块' : '参数分组'}名称：`" prop="argText">
          <el-input v-model.trim="groupForm.argText" autocomplete="off" placeholder="请输入参数分组名称" />
        </el-form-item>
        <el-form-item label="编码：" prop="argCode">
          <el-input v-model="groupForm.argCode" :disabled="!groupIsAdd" autocomplete="off" placeholder="请输入编码" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="groupBtnLoading" @click="handleSubmitGroupInfo">确 定</el-button>
        <el-button @click="groupVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 新增、编辑参数分组dialog end -->

    <!--  -->
    <!-- 新增.编辑指定分组下的参数start -->
    <el-dialog :title="paramsTitle" :visible.sync="paramsVisible" width="500px" @close="handleInitParamsDialog">
      <el-form ref="paramsFormRef" :model="paramsForm" label-width="130px" :rules="paramsRules">
        <el-form-item label="参数名称：" prop="argText">
          <el-input v-model.trim="paramsForm.argText" autocomplete="off" placeholder="请输入参数名称" />
        </el-form-item>
        <el-form-item label="编码：" prop="argCode">
          <el-input v-model="paramsForm.argCode" :disabled="!paramsIsAdd" autocomplete="off" placeholder="请输入编码" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="paramsBtnLoading" @click="handleSubmitparamsInfo">确 定</el-button>
        <el-button @click="paramsVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 新增、编辑指定分组下的参数end -->
  </el-container>
</template>

<script>
import settingAPI from '@/api/setting'
import { setTableMaxHeight } from '@/utils/table-height'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      module: 'construction-2.0',
      loading: false,
      argText: '',
      groupList: [],
      computedGroupList: [], // 匹配到的分组信息
      activeItem: {},
      listQuery: {
        // 表格数据
        argText: '',
        groupId: ''
      },
      maxheight: '—',

      listQueryBack: {},
      list: [],
      // 新增编辑参数分组对话框参数
      groupVisible: false,
      groupForm: {
        argText: '',
        argCode: ''
      },
      groupIsAdd: true,
      groupIsModule: true, // 是否是模块操作
      groupTitle: '新增参数分组',
      groupRules: {
        argText: [
          {
            required: true,
            message: '请输入参数分组名称',
            trigger: 'blur'
          }
        ],
        argCode: [
          {
            required: true,
            message: '请输入参数分组编码',
            trigger: 'blur'
          }
        ]
      },
      groupBtnLoading: false, // 禁用提交按钮，避免冲突提交

      selectItem: [], // 表格选中行的ID
      // 新增指定分组下的参数
      paramsTitle: '新增参数',
      paramsVisible: false,

      paramsForm: {
        paramsType: 1,
        argText: '',
        argCode: '',
        argGroup: '',
        id: null,
        module: this.module,
        projectId: this.projectId
      },
      paramsFormBack: {},
      paramsIsAdd: true,
      paramsBtnLoading: false, // 禁用提交按钮，避免冲突提交
      paramsRules: {
        argText: [{ required: true, message: '请输入参数名称', trigger: 'blur' }],
        argCode: [{ required: true, message: '请输入参数编码', trigger: 'blur' }]
      },
      treeData: [], // 模块树
      treeProps: {
        label: 'argText',
        value: 'argCode',
        children: 'argGroupList'
      },
      moduleList: []
    }
  },
  computed: {
    ...mapGetters(['projectId'])
  },
  watch: {
    argText(val) {
      this.$refs.treeRef.filter(val)
    }
  },
  mounted() {
    this.queryModuleList()
    this.$nextTick(() => {
      this.maxheight = setTableMaxHeight(null, false)
    })
  },
  methods: {
    // 关键词搜索分组
    handleArgTextInput() {
      if (!this.argText) {
        this.computedGroupList = [...this.groupList]
      } else {
        this.computedGroupList = this.groupList.filter(item => item.argText.includes(this.argText))
      }
      this.handleSetDefaultSelectGroup()
    },
    // 获取模块集合
    async queryModuleList() {
      const result = await settingAPI.queryModuleList()
      const datas = result.data || []
      const moduleList = []
      this.treeData = datas
      datas.map(item => {
        moduleList.push({
          label: item.argText,
          value: item.argCode
        })
      })
      this.moduleList = moduleList
    },
    // 树检索
    filterNode(value, data) {
      if (!value) return true
      return data.argText.indexOf(value) !== -1
    },
    // 获取全部参数分组列表
    async handleQueryGroupList() {
      const params = {
        module: this.module,
        page: 1,
        rows: 200
      }
      const result = await settingAPI.queryGroupArgList(params)
      const datas = result.data || []
      this.groupList = datas
      this.handleArgTextInput()
    },
    // 设置默认分组
    handleSetDefaultSelectGroup() {
      // 如果有选中项则无须设置默认分组，无选中项是设置默认分组
      if (this.activeItem.id) return
      if (this.computedGroupList.length > 0) {
        this.handleGroupItemClick(this.computedGroupList[0])
      }
    },
    // 选择分组
    handleGroupItemClick(data) {
      console.log('选择分组', data)
      if (!data.module) {
        return
      }
      this.activeItem = data
      this.paramsForm.argGroup = data.argCode
      this.paramsForm.parentId = 0
      this.paramsForm.module = data.module
      this.listQuery.groupId = data.id
      Object.assign(this.listQueryBack, this.listQuery)
      Object.assign(this.paramsFormBack, this.paramsForm)
      this.handleQueryList()
    },
    // 新增参数分组
    hanldeAddGroupItem(type, data) {
      this.groupIsAdd = true
      this.groupVisible = true
      this.groupTitle = type ? '新增模块' : '新增参数分组'
      this.groupIsModule = type
      if (!type) {
        this.groupForm.module = data.argCode
      }
      console.log(111, this.groupIsModule)
    },
    // 编辑参数分组
    handleUpdateGroupItem(data, type) {
      this.groupIsAdd = false
      this.groupVisible = true
      this.groupTitle = type ? '编辑模块' : '编辑参数分组'
      this.groupIsModule = type
      console.log(111, data)
      this.groupForm = {
        argText: data.argText,
        argCode: data.argCode,
        module: data.module,
        // argGroup: data.argGroup,
        id: data.id
      }
    },
    // 提交参数分组信息
    handleSubmitGroupInfo() {
      this.$refs.groupForm.validate(valid => {
        if (valid) {
          this.handleSubmitUpdateGroupItem()
        }
      })
    },
    // submit 编辑分组信息
    async handleSubmitUpdateGroupItem() {
      try {
        this.groupBtnLoading = true
        if (!this.groupIsAdd) {
          if (this.groupIsModule) {
            // 编辑模块
            const params = {
              argText: this.groupForm.argText,
              argCode: this.groupForm.argCode
            }
            await settingAPI.updateModule(params)
          } else {
            // 编辑分组
            this.groupForm.argGroup = this.groupForm.argCode
            await settingAPI.updateGroupArg(this.groupForm)
            // const targetItem = this.groupList.find(item => item.argCode === this.groupForm.argCode)
            // console.log(111, this.groupForm, this.groupList, targetItem)
            // Object.assign(targetItem, this.groupForm)
            // this.handleArgTextInput()
          }
        } else {
          this.groupForm.argGroup = this.groupForm.argCode
          if (this.groupIsModule) {
            // 添加模块
            const params = {
              argText: this.groupForm.argText,
              argCode: this.groupForm.argCode
            }
            await settingAPI.addModule(params)
          } else {
            // 添加分组
            await settingAPI.addGroupArg(this.groupForm)
          }
        }
        this.queryModuleList()
        this.groupBtnLoading = false
        this.groupVisible = false
        this.$message({
          type: 'success',
          message: '操作成功!'
        })
        this.updateSystemConfigStorage()
      } catch (e) {
        this.groupBtnLoading = false
        this.groupVisible = false
      }
    },
    // 更新全局参数缓存
    updateSystemConfigStorage() {
      this.$store.dispatch('user/setSystemConfigStorage')
    },
    // 删除参数分组
    deleteGroupArg(data) {
      console.log(data)
      const str = data.module ? '确认要删除此分组吗？' : '确定要删除此模块吗？'
      this.$confirm(str, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error',
        customClass: 'button-order'
      })
        .then(() => {
          this.deleteGroupArgSuccess(data)
        })
        .catch(() => {})
    },
    // 删除参数分组 - 异步
    async deleteGroupArgSuccess(data) {
      if (!data.module) {
        // 删除模块
        await settingAPI.deleteModule(data.argCode)
      } else {
        // 删除分组
        await settingAPI.deleteGroupArg(data.id)
      }
      this.$message({
        type: 'success',
        message: '删除成功!'
      })
      this.activeItem = {}
      this.queryModuleList()
      this.updateSystemConfigStorage()
    },
    // 关闭之前还原参数和验证结果
    handleInitDialog() {
      this.$refs.groupForm.clearValidate()
      this.groupForm = {
        argText: '',
        argCode: '',
        argGroup: 'admin_arg_group',
        id: ''
      }
      this.groupTitle = ''
      this.groupBtnLoading = false
    },
    // 复选框选中状态改变时
    handleSelectionChange(val) {
      this.selectItem = val.map(item => item.id)
    },
    // 新增指定分组下的参数
    handleAddParamsItem() {
      this.paramsVisible = true
      this.paramsTitle = '新增参数'
    },
    // 编辑指定分组下的参数
    handleUpdateParamsItem(data) {
      this.paramsVisible = true
      this.paramsTitle = '编辑参数'
      this.paramsForm = Object.assign({}, data, {
        paramsType: data.systemFlag
      })
      this.paramsIsAdd = false
    },
    // 提交指定分组下的参数
    handleSubmitparamsInfo() {
      this.$refs.paramsFormRef.validate(valid => {
        if (valid) {
          this.saveArg()
        }
      })
    },
    // 新增/编辑参数
    async saveArg() {
      try {
        this.paramsBtnLoading = true
        if (this.paramsForm.id) {
          // 更新参数
          await settingAPI.updateArg(this.paramsForm)
          const targetItem = this.list.find(item => item.id === this.paramsForm.id)
          Object.assign(targetItem, this.paramsForm)
        } else {
          this.paramsForm.parentId = this.activeItem.id
          // 添加系统参数
          await settingAPI.addSystemArg(this.paramsForm)

          this.handleQueryList()
        }
        this.$message({
          type: 'success',
          message: '操作成功!'
        })
        this.paramsBtnLoading = false
        this.paramsVisible = false
        this.updateSystemConfigStorage()
      } catch (e) {
        this.paramsBtnLoading = false
        this.paramsVisible = false
      }
    },
    // 关闭之前还原参数和验证结果
    handleInitParamsDialog() {
      this.paramsIsAdd = true
      Object.assign(this.paramsForm, this.paramsFormBack)
      this.$refs.paramsFormRef.clearValidate()
      this.paramsTitle = ''
      this.paramsBtnLoading = false
    },
    // 批量删除
    handleDeleteByBatch() {
      this.$confirm(`确认要删除这些参数吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error',
        customClass: 'button-order'
      })
        .then(() => {
          settingAPI.batchDeleteArg(this.selectItem).then(res => {
            if (res.code === 200) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.selectItem = []
              this.handleQueryList()
              this.updateSystemConfigStorage()
            }
          })
        })
        .catch(() => {})
    },
    // 删除单个参数
    handleDeleteSingleItem(id) {
      this.$confirm(`确认要删除此参数吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error',
        customClass: 'button-order'
      })
        .then(() => {
          settingAPI.deleteArg(id).then(res => {
            if (res.code === 200) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.handleQueryList()
              this.updateSystemConfigStorage()
            }
          })
        })
        .catch(() => {})
    },
    // 清空筛选条件,重新获取数据
    handleListQueryReset() {
      Object.assign(this.listQuery, this.listQueryBack)
      this.handleQueryList()
    },
    // 获取表格数据
    async handleQueryList() {
      try {
        this.loading = true
        this.list = []
        const result = await settingAPI.getGroupArg(this.listQuery)
        const datas = result.data || []
        this.list = datas
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../styles/common.scss';
@import './index.scss';
</style>
