<template>
  <div class="is-footer">
    <!-- 基本信息 start -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>基本信息</span>
      </div>
      <el-form ref="formRef" :model="formData" :label-width="labelWidth" :rules="formRules" class="form-add">
        <el-row>
          <el-col :md="12">
            <el-form-item label="分组名称：" prop="templateName">
              <el-input v-model.trim="formData.name" :maxlength="50" autocomplete="off" placeholder="请输入分组名称" />
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="服务名称：" prop="serviceId">
              <el-select v-model.trim="formData.serviceId" clearable @change="changeService">
                <el-option v-for="(item, i) in serviceList" :key="i" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="备注：" prop="remark">
              <el-input v-model.trim="formData.remark" :maxlength="50" autocomplete="off" placeholder="请输入备注" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <!-- 基本信息 end -->
    <!-- 配置信息 start -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>配置信息</span>
      </div>
      <el-row :gutter="15">
        <el-col :md="6">
          <el-card class="box-card">
            <el-input v-model="keyword" placeholder="请输入" class="input-with-select" @input="searchTree">
              <el-button slot="append" icon="el-icon-search" @click="searchTree" />
            </el-input>
            <div class="power-roll tree-roll">
              <el-tree
                ref="treeRef"
                highlight-current
                :data="list"
                node-key="id"
                :props="defaultProps"
                default-expand-all
                :filter-node-method="filterNode"
                :expand-on-click-node="true"
                lazy
                :load="loadTree"
                @node-click="handleNodeClick"
              >
                <span slot-scope="{ node, data }" class="custom-tree-node">
                  <span v-if="data.flag === 1" class="el-icon-star-on" style="color: #00800d" />
                  <span>{{ node.label }}</span>
                </span>
              </el-tree>
            </div>
          </el-card>
        </el-col>
        <el-col :md="18">
          <el-card class="box-card no-padding">
            <header slot="header">
              <el-checkbox v-model="checkAll" @change="handleCheckAllChange"> 全选 </el-checkbox>
            </header>
            <span v-if="list.length === 0" class="no-data">暂无数据</span>
            <div class="power-roll">
              <TreeCard
                v-if="list && list.length > 0"
                ref="treeCard"
                :template-id="id"
                :default-data="list"
                :all-data="list"
                :role-id="roleId"
                :power-list-role="powerListRole"
                @on-change="changePower"
              />
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-card>
    <!-- 配置信息 end -->
    <div class="footer-btn">
      <el-button size="lg" @click="goBack">取消</el-button>
      <el-button
        type="primary"
        size="lg"
        :disabled="formData.powerGroupDetailList.length === 0"
        :loading="btnLoading"
        @click="save()"
        >提交</el-button
      >
      <!-- <el-button v-if="id" type="primary" size="lg" :disabled="formData.powerGroupDetailList.length === 0" :loading="saveLoading" @click="save(true)">另存为模板</el-button> -->
      <el-button
        v-if="id"
        type="primary"
        size="lg"
        :disabled="formData.powerGroupDetailList.length === 0"
        :loading="saveLoading"
        @click="saveAsAnotherTemplate"
        >另存为分组</el-button
      >
    </div>
    <!-- 另存时修改模板的名称，备注，状态等信息 start -->
    <el-dialog title="创建分组" :visible.sync="dialogFormVisible" width="500px">
      <el-form ref="subForm" :model="subForm" :rules="formRules" label-width="100px">
        <el-form-item label="分组名称：" prop="templateName">
          <el-input v-model.trim="subForm.name" :maxlength="50" autocomplete="off" placeholder="请输入分组名称" />
        </el-form-item>

        <el-form-item label="备注：">
          <el-input
            v-model.trim="subForm.remark"
            type="textarea"
            :maxlength="50"
            autocomplete="off"
            placeholder="备注"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button :loading="saveAsLoading" type="primary" @click="handleSetGroupBaseInfo">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 另存时修改模板的名称，备注，状态等信息 end -->
  </div>
</template>

<script>
import serviceAPI from '@/api/service'
import powerGroupApi from '@/api/power-group'
import TreeCard from '@/components/tree-card'
import _ from 'lodash'
export default {
  name: 'AddPowerGroup',
  components: {
    TreeCard
  },
  data() {
    // 这里存放数据
    return {
      id: this.$route.query.id,
      labelWidth: '150px',
      serviceList: [],
      formData: {
        powerGroupDetailList: [],
        serviceId: '',
        name: '',
        remark: ''
      },
      formRules: {
        name: [{ required: true, message: '请输入分组名称', trigger: 'blur' }],
        serviceId: [{ required: true, message: '请选择服务', trigger: 'change' }]
      },
      defaultProps: {
        children: 'children',
        label: 'powerName'
      },
      list: [],
      roleId: '11',
      powerListRole: [],
      keyword: '',
      activeNames: '',
      btnLoading: false,
      saveLoading: false,
      // 另存为时修改模板名称等信息
      dialogFormVisible: false,
      subForm: {
        name: '',
        remark: ''
      },
      saveAsLoading: false,
      checkAll: false
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    this.getServiceList()
  },
  // 方法集合
  methods: {
    // 选中的权限
    changePower(array) {
      this.formData.powerGroupDetailList = array
    },
    // 获取分组详情
    async getPowerGroupDetails() {
      if (!this.id) {
        return
      }
      const result = await powerGroupApi.getPowerGroupDetail(this.id)
      const datas = result.data
      const powerGroupDetailList = datas.powerGroupDetailList || []
      this.formData = datas
      this.powerListRole = _.map(powerGroupDetailList, 'powerId')
      // console.log(444, powerGroupDetailList, this.powerListRole)
      this.changeService(datas.serviceId)
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
          value: item.id
        })
      })
      this.serviceList = serviceList
      // console.log('=======', this.serviceList)
      this.getPowerGroupDetails()
    },
    // 选择服务
    changeService(e) {
      this.formData.serviceId = e
      this.queryServiceItemInfo()
    },
    // 查询当前服务下的模块
    async queryServiceItemInfo() {
      const result = await serviceAPI.queryServiceItemInfo({
        serviceId: this.formData.serviceId
      })
      const datas = result.data
      const list = datas.children || []
      const formatArray = array => {
        if (!array) {
          return
        }
        array.map(item => {
          item.checked = false
          item.isIndeterminate = false
          item.checkList = []
          item.powerId = item.id
          if (item.children) {
            item.children.map(e => {
              const powerItem = _.find(this.formData.powerGroupDetailList, { powerId: e.id })
              if (powerItem) {
                item.checkList.push(powerItem.powerId)
              }
            })
            this.checkedIsIndeterminate(item)
            formatArray(item.children)
          }
        })
        return array
      }
      formatArray(list)
      this.list = list
      this.hanldeSetCollapseOpend()
    },
    // 加载左侧树状数据
    loadTree(node, resolve) {
      const children = node.data.children
      if (children && _.find(children) && _.find(children).children) {
        resolve(children)
      } else {
        resolve([])
      }
    },
    // 搜索树
    searchTree() {
      this.$refs.treeRef.filter(this.keyword)
    },
    // 根据关键字搜索
    filterNode(value, data) {
      if (!value) return true
      return data.powerName.toLowerCase().includes(value.toLowerCase())
    },
    // 点击锚点
    handleNodeClick(data) {
      document.getElementById(data.id).parentNode.scrollIntoView({
        block: 'start',
        behavior: 'smooth'
      })
      // this.$refs['menu_' + data.id].scrollIntoView({ block: 'start', behavior: 'smooth' })
    },
    // 展开所有的一级折叠面板
    hanldeSetCollapseOpend() {
      this.activeNames = this.list.map(item => String(item.id))
    },
    // 选择权限
    changeChecked(evenv, item, type, parentItem) {
      let powerListIds = _.map(this.formData.powerGroupDetailList, 'powerId')
      let newItem = {}
      if (type === 'all') {
        // 全选
        item.checkList = evenv ? _.map(item.children, 'id') : []
        item.isIndeterminate = false
        if (evenv) {
          item.children.map(e => {
            const index = powerListIds.indexOf(e.id)
            newItem = {
              parentId: e.parentId,
              powerId: e.id,
              powerKey: e.powerKey,
              powerName: e.powerName,
              remark: e.remark,
              serviceId: e.serviceId,
              status: 1,
              type: e.type,
              url: e.url
            }
            if (index < 0) {
              this.formData.powerGroupDetailList.push(newItem)
              powerListIds.push(e.id)
            } else {
              this.formData.powerGroupDetailList[index] = newItem
            }
          })
        } else {
          const powerIds = _.map(item.children, 'id')
          powerListIds = _.difference(powerListIds, powerIds)
          this.formData.powerGroupDetailList = _.filter(
            this.formData.powerGroupDetailList,
            e => !powerIds.includes(e.powerId)
          )
        }
      } else {
        // 单选
        if (evenv) {
          const index = powerListIds.indexOf(item.id)
          newItem = {
            parentId: item.parentId,
            powerId: item.id,
            powerKey: item.powerKey,
            powerName: item.powerName,
            remark: item.remark,
            serviceId: item.serviceId,
            status: 1,
            type: item.type,
            url: item.url
          }
          if (index < 0) {
            this.formData.powerGroupDetailList.push(newItem)
            powerListIds.push(item.id)
          } else {
            this.formData.powerGroupDetailList[index] = newItem
          }
        } else {
          const powerIds = [item.id]
          powerListIds = _.difference(powerListIds, powerIds)
          this.formData.powerGroupDetailList = _.filter(
            this.formData.powerGroupDetailList,
            e => !powerIds.includes(e.powerId)
          )
        }
        this.checkedIsIndeterminate(parentItem)
      }
    },
    // 监测全选/半选状态
    checkedIsIndeterminate(parentItem) {
      if (parentItem.checkList.length > 0) {
        parentItem.isIndeterminate = true
      }
      if (parentItem.checkList.length === parentItem.children.length) {
        parentItem.isIndeterminate = false
        parentItem.checked = true
      }
      if (parentItem.checkList.length === 0) {
        parentItem.isIndeterminate = false
        parentItem.checked = false
      }
      return parentItem
    },
    // 保存;type==true时为另存操作，需要修改模板名称等消息，否则直接编辑
    save(type) {
      this.$refs.formRef.validate(valid => {
        if (valid) {
          this.saveSuccess(type)
        }
      })
    },
    // 另存为操作
    saveAsAnotherTemplate() {
      this.$refs.formRef.validate(valid => {
        if (valid) {
          this.dialogFormVisible = true
        }
      })
    },
    handleSetGroupBaseInfo() {
      this.$refs.subForm.validate(valid => {
        if (valid) {
          Object.assign(this.formData, this.subForm)
          this.saveSuccess(true)
          this.dialogFormVisible = true
        }
      })
    },
    // 保存异步
    async saveSuccess(type) {
      try {
        if (type) {
          this.saveLoading = true
        } else {
          this.btnLoading = true
        }
        if (type || !this.id) {
          await powerGroupApi.addPowerGroup(this.formData)
        } else {
          await powerGroupApi.updatePowerGroup(this.formData)
        }
        if (type) {
          this.saveLoading = false
        } else {
          this.btnLoading = false
        }
        this.$message({
          message: '操作成功！',
          type: 'success'
        })
        this.goBack()
      } catch (e) {
        this.saveLoading = false
        this.btnLoading = false
      }
    },
    // 返回
    goBack() {
      this.$router.go(-1)
    },
    // 当全选点击时的事件
    handleCheckAllChange(checked) {
      this.$refs.treeCard.handleCheckAllToggle(checked)
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/common.scss';
@import './detail/index.scss';
.box-card .no-padding {
  ::v-deep > .el-card__body {
    padding: 0 15px;
  }
}
.form-add {
  width: 90%;
}
.power-roll {
  height: 800px;
  overflow-y: auto;
  &.tree-roll {
    height: 758px;
  }
}
.input-with-select {
  margin-bottom: 10px;
}
.no-data {
  color: #909399;
}
</style>
