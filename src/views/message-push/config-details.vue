<template>
  <div class="is-footer">
    <!-- 推送配置 start -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>推送配置</span>
        <div v-if="powerKey" style="float: right">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="paramConfigShow = true"
            >字段库配置</el-button
          >
          <el-button type="primary" icon="el-icon-s-tools" size="mini" @click="dialogFormVisible = true"
            >编辑推送机制</el-button
          >
        </div>
      </div>
      <!-- 字段库配置 start -->
      <ParamConfig
        v-if="powerKey"
        v-model="paramConfigShow"
        :powerKey="powerKey"
        :powerName="powerName"
        @onClose="paramConfigShow = false"
      />
      <!-- 字段库配置 end -->
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
                :filter-node-method="filterNode"
                :expand-on-click-node="true"
                accordion
                @node-click="handleNodeClick"
              >
                <span slot-scope="{ node }" class="custom-tree-node">
                  <span>{{ node.label }}</span>
                </span>
              </el-tree>
            </div>
          </el-card>
        </el-col>
        <el-col :md="18">
          <el-card>
            <template v-if="tabList.length > 0">
              <el-tabs v-model="tabIndex" type="card" @tab-click="clickTab">
                <el-tab-pane
                  v-for="item in tabList"
                  :key="item.value"
                  :name="item.value"
                  :label="item.label"
                ></el-tab-pane>
              </el-tabs>
              <!-- 新增数据 start -->
              <template v-if="tabIndex">
                <el-card class="box-card">
                  <div slot="header" class="clearfix">
                    <span>是否启用</span>
                  </div>
                  <el-form :label-width="labelWidth">
                    <el-form-item label="是否启用：" required>
                      <el-radio v-model="formData.status" :label="1">启用</el-radio>
                      <el-radio v-model="formData.status" :label="0">禁用</el-radio>
                    </el-form-item>
                  </el-form>
                </el-card>
                <el-card class="box-card">
                  <div slot="header" class="clearfix">
                    <span>推送字段配置</span>
                  </div>
                  <el-form :label-width="labelWidth">
                    <el-form-item label="可推送字段：">
                      <el-button type="primary" plain icon="el-icon-plus" @click="selectWxParam()">选择</el-button>
                      <div class="tags">
                        <el-tag
                          v-for="(tag, i) in formData.selectField"
                          :key="tag.key"
                          size="medium"
                          type="success"
                          closable
                          @close="closeTag(tag.key, i)"
                        >
                          {{ tag.label }}
                        </el-tag>
                      </div>
                    </el-form-item>
                  </el-form>
                </el-card>
                <!-- 可推送字段 模态框 start -->
                <el-dialog title="选择字段" :visible.sync="selectFieldPamams.show" width="680px">
                  <el-transfer
                    v-model="selectFieldPamams.selectValue"
                    :titles="['所有字段', '可推送字段']"
                    :data="selectFieldPamams.list"
                  >
                    <span slot-scope="{ option }" class="custom-transfer">
                      <i :class="{ active: option.isRequired }">*</i>
                      {{ option.label }}
                    </span>
                  </el-transfer>
                  <div slot="footer" class="dialog-footer">
                    <el-button @click="selectFieldPamams.show = false">取 消</el-button>
                    <el-button type="primary" @click="saveSelectField">确 定</el-button>
                  </div>
                </el-dialog>
                <!-- 可推送字段 模态框 end -->
                <el-card class="box-card">
                  <div slot="header" class="clearfix">
                    <span>推送跳转地址</span>
                  </div>
                  <el-form
                    ref="formRef"
                    :model="formData"
                    :label-width="labelWidth"
                    :rules="formRules"
                    style="width: 70%"
                  >
                    <el-form-item label="PC跳转地址：" prop="pcJumpUrl">
                      <el-input v-model="formData.pcJumpUrl" placeholder="请输入..."></el-input>
                    </el-form-item>
                    <el-form-item label="APP跳转地址：" prop="appJumpUrl">
                      <el-input v-model="formData.appJumpUrl" placeholder="请输入..."></el-input>
                    </el-form-item>
                    <el-form-item label="微信跳转地址：" prop="wxJumpUrl">
                      <el-input v-model="formData.wxJumpUrl" placeholder="请输入..."></el-input>
                    </el-form-item>
                  </el-form>
                </el-card>
                <el-card class="box-card">
                  <div slot="header" class="clearfix">
                    <span>模板字段配置</span>
                    <div style="float: right">
                      <el-button type="primary" icon="el-icon-plus" size="mini" @click="templateVisible = true">
                        选择模板
                      </el-button>
                    </div>
                    <SelectTemplate
                      v-model="templateVisible"
                      :selectTemplateRow="selectTemplateData"
                      @onClose="templateVisible = false"
                      @change="changeTemplate"
                    />
                  </div>
                  <div v-if="selectTemplateData" class="template-details">
                    <div class="details-left">
                      <p class="title">模板标题：{{ selectTemplateData.title }}</p>
                      <div class="details-content">
                        <span>详细内容：</span>
                        <div class="desc">
                          <p
                            v-for="(item, i) in selectTemplateData.contentNewHtml"
                            :key="i"
                            :class="{ active: formData.templateList[i].value }"
                            @click="clickTemplateTag(i)"
                            v-html="item"
                          ></p>
                          <AssociatedFields
                            v-model="associatedVisible"
                            :powerKey="powerKey"
                            :defaultParmas="
                              formData.templateList[templateIndex] ? formData.templateList[templateIndex].value : ''
                            "
                            :index="templateIndex"
                            @change="changeAssociated"
                            @close="associatedVisible = false"
                          />
                        </div>
                      </div>
                    </div>
                    <div class="details-right">
                      <p>内容示例</p>
                      <div class="details-example">
                        <div class="desc" v-html="selectTemplateData.exampleHtml"></div>
                        <p class="details-view"><span>详情</span></p>
                      </div>
                    </div>
                  </div>
                </el-card>
                <el-button type="primary" size="lg" :loading="btnLoading" @click="saveWxMessage()">提交</el-button>
              </template>
              <!-- 新增数据 end -->
            </template>
            <div v-else class="no-config">
              <template v-if="powerKey">
                <p>当前模块暂未设置推送配置，如需设置，请先选择要配置的推送机制</p>
                <el-button type="text" @click="dialogFormVisible = true">选择推送机制</el-button>
              </template>
              <template v-else>
                <p>还没有选择要配置的模块，请选择左侧模块</p>
              </template>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-card>
    <!-- 推送配置 end -->
    <div class="footer-btn">
      <el-button size="lg" @click="goBack">返回</el-button>
    </div>
    <!-- 选择要配置的推送机制 start -->
    <el-dialog title="选择要配置的推送机制" :visible.sync="dialogFormVisible" width="500px">
      <el-form ref="subForm" :model="subForm" label-width="100px">
        <el-form-item label="推送机制：">
          <el-checkbox-group v-model="subForm.checkList">
            <el-checkbox
              v-for="item in subForm.list"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button :loading="saveAsLoading" type="primary" @click="saveConfig">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 选择要配置的推送机制 end -->
  </div>
</template>

<script>
import serviceAPI from '@/api/service'
import wxMessageApi from './api'
import ParamConfig from './components/param-config' // 字段库配置
import SelectTemplate from './components/select-template' // 选择模板
import AssociatedFields from './components/associated-fields' // 关联字段
import _ from 'lodash'
import templateApi from '@/api/template'
export default {
  name: 'MessagePushConfigDetails',
  components: {
    ParamConfig,
    SelectTemplate,
    AssociatedFields
  },
  data() {
    // 这里存放数据
    return {
      id: this.$route.query.id,
      paramConfigShow: false,
      labelWidth: '150px',
      templateVisible: false, // 模板模态框状态
      selectTemplateData: '', // 选择的模板
      associatedVisible: false, // 关联字段模态框
      formData: {
        id: '',
        selectField: [],
        sendParams: '',
        pcJumpUrl: '',
        appJumpUrl: '',
        wxJumpUrl: '',
        templateId: '',
        mechanismType: '',
        templateList: [],
        sendParamList: [],
        status: 1
      },
      formDataBack: {},
      formRules: {
        // pcJumpUrl: [{ required: true, message: '请输入PC跳转地址', trigger: 'blur' }],
        // appJumpUrl: [{ required: true, message: '请输入APP跳转地址', trigger: 'blur' }],
        // wxJumpUrl: [{ required: true, message: '请输入微信跳转地址', trigger: 'blur' }]
      },
      defaultProps: {
        children: 'children',
        label: 'powerName'
      },
      list: [],
      keyword: '',
      activeNames: '',
      btnLoading: false,
      // 另存为时修改模板名称等信息
      dialogFormVisible: false,
      subForm: {
        list: this.$getArgList('push_mechanism'), // 所有推送机制
        checkList: []
      },
      tabList: [],
      tabIndex: '',
      allTabData: '', // 所有选项卡数据
      powerName: '',
      powerKey: '',
      saveAsLoading: false,
      templateIndex: 0, // 模板索引
      // 选择字段
      selectFieldPamams: {
        show: false,
        selectValue: [],
        list: []
      }
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    Object.assign(this.formDataBack, this.formData)
    this.queryServiceItemInfo()
  },
  // 方法集合
  methods: {
    // 查询当前服务下的模块
    async queryServiceItemInfo() {
      const result = await serviceAPI.queryServiceItemInfo({
        serviceId: this.id
      })
      const datas = result.data
      const list = datas.children || []
      const formatArray = array => {
        array.map(item => {
          if (item.children && item.children[0].type !== 3) {
            formatArray(item.children)
          } else {
            item.children = null
          }
        })
      }
      formatArray(list)
      this.list = list
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
      if (!data.children) {
        this.powerName = data.powerName
        this.queryWxMessageList(data.powerKey)
      }
    },
    // 切换推送机制选项卡
    clickTab(obj) {
      let tabIndex = obj.name
      this.setCurrentTab(tabIndex)
    },
    // 选择可推送字段
    async selectWxParam() {
      this.selectFieldPamams.show = true
      let params = {
        page: 1,
        rows: 200,
        paramName: '',
        paramType: 1,
        powerKey: this.powerKey,
        serviceId: this.$route.query.id
      }
      let result = await wxMessageApi.queryWxParamList(params)
      let datas = result.data
      let list = datas.records || []
      let selectField = []
      list.map(item => {
        selectField.push({
          key: item.paramKey,
          label: item.paramName,
          isRequired: item.isRequired
        })
      })
      this.selectFieldPamams.list = selectField
    },
    // 关联字段
    changeAssociated(obj) {
      this.formData.templateList[obj.index].value = obj.data
      this.associatedVisible = false
    },
    // 推送配置 查看列表
    async queryWxMessageList(powerKey, type = false, defaultCheckList = []) {
      this.powerKey = powerKey
      let result = await wxMessageApi.queryWxMessageList({ powerKey })
      let datas = result.data
      if (type && Object.keys(datas).length === 0) {
        let selectMechanism = this.subForm.list.filter(item => this.subForm.checkList.includes(item.label))
        let selectMechanismList = _.map(selectMechanism, 'value')
        this.tabIndex = selectMechanismList[0]
        this.setCurrentTab(this.tabIndex)
        return
      }
      this.allTabData = Object.assign({}, datas)
      let list = Object.keys(datas)
      let tabIndex = type ? list[0] : this.tabIndex
      let checkList = defaultCheckList
      let tabList = []
      this.subForm.list.map(item => {
        if (list.includes(item.value) || checkList.includes(item.label)) {
          if (!tabIndex) {
            tabIndex = item.value
          }
          if (!checkList.includes(item.label)) {
            checkList.push(item.label)
          }
          tabList.push(item)
        }
      })
      this.tabList = tabList
      this.subForm.checkList = checkList
      this.tabIndex = tabIndex
      this.setCurrentTab(tabIndex)
    },
    // 设置当前选项卡数据
    setCurrentTab(tabIndex) {
      this.selectTemplateData = ''
      if (tabIndex && this.allTabData[tabIndex]) {
        let formData = this.allTabData[tabIndex]
        let selectField = []
        formData.sendParamList.map(item => {
          selectField.push({
            label: item.name,
            key: item.key
          })
        })
        this.selectFieldPamams.selectValue = _.map(selectField, 'key')
        formData.selectField = selectField
        this.formData = Object.assign({}, formData)
        if (formData.templateId) {
          this.getDetailsTempMsg(formData.templateId)
        } else {
          this.selectTemplateData = ''
        }
      } else {
        Object.assign(this.formData, this.formDataBack, {
          mechanismType: tabIndex
        })
        this.selectFieldPamams.selectValue = []
        this.selectTemplateData = ''
      }
    },
    // 获取模板详情
    async getDetailsTempMsg(templateId) {
      if (!templateId) {
        return
      }
      let result = await wxMessageApi.getDetailsTempMsg(templateId)
      let datas = result.data
      datas.contentHtml = datas.content ? datas.content.replace(/↵|\n/g, '<br>') : ''

      let contentList = datas.content
        ? datas.content
            .replace(/↵|\n/g, '<br>')
            .replace(/}}.*?{{/g, '}},{{')
            .split(',')
        : []
      let list = []
      contentList.map(e => {
        list.push(e.replace(/{{|}}/g, '').split('.')[0])
      })
      datas.contentList = list
      datas.exampleHtml = datas.example ? datas.example.replace(/↵|\n/g, '<br>') : '暂无...'
      this.changeTemplate(datas, true)
    },
    // 保存推送机制
    saveConfig() {
      let tabList = []
      this.subForm.list.map(item => {
        if (this.subForm.checkList.includes(item.label)) {
          tabList.push(item)
        }
      })
      this.tabList = tabList
      this.tabIndex = tabList.length > 0 ? tabList[0].value : ''
      let mechanismTypeList = this.subForm.list.filter(item => !this.subForm.checkList.includes(item.label))
      let mechanismTypeListNew = _.map(mechanismTypeList, 'value')
      let selectMechanism = this.subForm.list.filter(item => this.subForm.checkList.includes(item.label))
      let selectMechanismList = _.map(selectMechanism, 'value')
      let allTabData = Object.keys(this.allTabData)
      this.dialogFormVisible = false
      if (allTabData.join(',') === selectMechanismList.join(',')) {
        this.tabIndex = allTabData[0]
        this.setCurrentTab(this.tabIndex)
        // 判断选择的推送机制是否与当前相同
        return
      }
      this.bathDeleteWxMessage(mechanismTypeListNew, this.subForm.checkList)
    },
    // 推送配置 批量删除
    async bathDeleteWxMessage(mechanismTypeList, tabList) {
      if (mechanismTypeList.length === 0) {
        return
      }
      await wxMessageApi.bathDeleteWxMessage(this.powerKey, mechanismTypeList)
      this.$message({
        type: 'success',
        message: `操作成功!`
      })
      this.tabIndex = ''
      this.queryWxMessageList(this.powerKey, true, tabList)
    },
    // 保存可推送字段
    saveSelectField() {
      let list = []
      this.selectFieldPamams.list.map(item => {
        if (this.selectFieldPamams.selectValue.includes(item.key)) {
          list.push(item)
        }
      })
      this.formData.selectField = list
      this.selectFieldPamams.show = false
    },
    // 删除可推送字段
    closeTag(key, i) {
      this.formData.selectField.splice(i, 1)
      this.selectFieldPamams.selectValue.splice(i, 1)
    },
    // 应用模板回调事件
    changeTemplate(obj, type) {
      let contentNewHtml = obj.contentHtml
        .replace(/{{/g, '<span class="link">{{')
        .replace(/}}/g, '}}</span>')
        .split('<br>')
      obj.contentNewHtml = contentNewHtml
      this.selectTemplateData = Object.assign({}, obj)
      this.formData.templateId = obj.templateId
      let templateList = []
      obj.contentList.map(item => {
        templateList.push({
          name: item,
          color: '',
          value: ''
        })
      })
      if (!type) {
        this.formData.templateList = templateList
      }
    },
    // 模板标签点击事件
    clickTemplateTag(index) {
      this.associatedVisible = true
      this.templateIndex = index
    },
    // 保存推送配置
    saveWxMessage() {
      // if (this.formData.selectField.length === 0) {
      //   this.$message({
      //     type: 'error',
      //     message: `请选择可推送字段!`
      //   })
      //   return
      // }
      this.formData.sendParams = _.map(this.formData.selectField, 'key').join(',')
      this.formData.mechanismType = this.tabIndex
      this.formData.powerKey = this.powerKey
      this.formData.serviceId = this.id
      this.$refs.formRef.validate(valid => {
        if (valid) {
          // if (!this.formData.templateId) {
          //   this.$message({
          //     type: 'error',
          //     message: `请选择模板!`
          //   })
          //   return
          // }
          this.addWxMessage()
        }
      })
    },
    // 推送配置 添加
    async addWxMessage() {
      try {
        this.btnLoading = true
        if (this.formData.id) {
          // 修改
          await wxMessageApi.updateWxMessage(this.formData)
        } else {
          // 添加
          await wxMessageApi.addWxMessage(this.formData)
        }
        this.$message({
          type: 'success',
          message: `操作成功!`
        })
        this.queryWxMessageList(this.powerKey, true)
        this.btnLoading = false
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
@import './config-details.scss';
</style>
