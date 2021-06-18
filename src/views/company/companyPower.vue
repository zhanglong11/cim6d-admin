<template>
  <div class="is-footer company-con">
    <!-- 选择模板 start -->
    <!-- <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>选择模板</span>
      </div>
      <el-form ref="formRef" :model="formData" :label-width="labelWidth" :rules="formRules" class="form-add">
        <el-row>
          <el-col :md="12">
            <el-form-item label="模板名称：">
              <el-select v-model.trim="templateId" clearable @change="changeTemplate">
                <el-option v-for="(item, i) in templateList" :key="i" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card> -->
    <!-- 选择模板 end -->
    <!-- 配置信息 start -->
    <el-card class="box-card company-power">
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
          <el-card class="box-card">
            <span v-if="list.length === 0" class="no-data">暂无数据</span>
            <div class="power-roll">
              <el-alert type="warning" class="is-all" :closable="false">
                <el-checkbox v-model="isAllChecked" label="全选" @change="changeAll"></el-checkbox>
              </el-alert>
              <TreeCard
                v-if="list && list.length > 0"
                :template-id="id"
                :default-data="list"
                :all-data="list"
                :role-id="roleId"
                :power-list-role="powerListRole"
                class="tree-roll-power"
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
        :disabled="formData.powerList.length === 0"
        :loading="btnLoading"
        @click="save()"
        >提交</el-button
      >
    </div>
  </div>
</template>

<script>
import serviceAPI from '@/api/service'
import companyAPI from '@/api/company'
import templateApi from '@/api/template'
import TreeCard from '@/components/tree-card'
import _ from 'lodash'
import treeForEach from '@/utils/treeForEach'
export default {
  name: 'CompanyPower',
  components: {
    TreeCard
  },
  data() {
    // 这里存放数据
    return {
      id: this.$route.query.id,
      companyId: this.$route.query.companyId,
      labelWidth: '150px',
      serviceList: [],
      formData: {
        powerList: [],
        serviceId: '',
        serviceName: '',
        templateName: '',
        status: 1,
        remark: ''
      },
      formRules: {
        templateName: [{ required: true, message: '请输入服务名称', trigger: 'blur' }],
        serviceId: [{ required: true, message: '请选择服务', trigger: 'change' }],
        status: [{ required: true, message: '请选择服务', trigger: 'change' }]
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
      templateId: '',
      templateList: [],
      isAllChecked: false // 是否全选
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    this.init()
  },
  // 方法集合
  methods: {
    // 初始化
    init() {
      this.getAvailablePowerCompany()
      this.queryServiceTemplateList()
      this.changeService(this.id)
    },
    // 获取企业可用权限
    async getAvailablePowerCompany() {
      const result = await companyAPI.getAvailablePowerCompany(this.companyId, this.id)
      const datas = result.data
      this.powerListRole = datas
    },
    // 查询模板列表
    async queryServiceTemplateList() {
      const params = {
        page: 1,
        rows: 100,
        serviceId: this.id
      }
      const result = await templateApi.queryServiceTemplateList(params)
      const datas = result.data
      const list = datas.records || []
      const templateList = []
      list.map(item => {
        templateList.push({
          value: item.id,
          label: item.templateName
        })
      })
      this.templateList = templateList
    },
    // 全选
    changeAll(e) {
      let powerList = []
      treeForEach(this.list, item => {
        powerList.push(item.id)
      })
      this.powerListRole = e ? powerList : []
    },
    // 选择模板
    changeTemplate(e) {
      this.getDetailsServiceTemplate(e)
    },
    // 选中的权限
    changePower(array) {
      let powerList = []
      treeForEach(this.list, item => {
        powerList.push(item.id)
      })
      this.formData.powerList = array
      this.isAllChecked = array.length > 0 && array.length >= powerList.length
    },
    // 获取模板详情
    async getDetailsServiceTemplate(templateId) {
      if (!this.templateId) {
        return
      }
      const result = await templateApi.getDetailsServiceTemplate(this.templateId)
      const datas = result.data
      const powerList = datas.powerList || []
      this.powerListRole = _.map(powerList, 'powerId')
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
          if (item.children) {
            item.children.map(e => {
              const powerItem = _.find(this.formData.powerList, { powerId: e.id })
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
    },
    // 展开所有的一级折叠面板
    hanldeSetCollapseOpend() {
      this.activeNames = this.list.map(item => String(item.id))
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
    // 保存
    save(type) {
      this.saveSuccess(type)
    },
    // 保存异步
    async saveSuccess(type) {
      try {
        const powerIdList = _.map(this.formData.powerList, 'powerId')
        this.btnLoading = true
        const params = {
          companyId: this.companyId,
          powerIdList: powerIdList,
          serviceId: this.id
        }
        await companyAPI.bindPowerCompany(params)
        this.btnLoading = false
        this.$message({
          message: '操作成功！',
          type: 'success'
        })
        this.goBack()
      } catch (e) {
        this.btnLoading = false
      }
    },
    // 返回
    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/common.scss';
@import '@/views/template/detail/index.scss';
.company-con {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  .company-power {
    flex: 1;
    display: flex;
    flex-direction: column;
    &::v-deep .box-card {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    &::v-deep .el-card__body {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      .el-row {
        height: 100%;
        .el-col {
          height: 100%;
          display: flex;
          flex-direction: column;
        }
      }
    }
  }
}
.form-add {
  width: 90%;
}
.power-roll {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  &.tree-roll,
  &::v-deep .tree-roll-power {
    flex: 1;
    overflow-y: auto;
    .custom-tree .el-tree-node {
      margin-top: 0;
    }
  }
}
.input-with-select {
  margin-bottom: 10px;
}
.no-data {
  color: #909399;
}
.is-all {
  margin-bottom: 15px;
}
</style>
