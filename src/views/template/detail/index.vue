<template>
  <el-container v-loading="loading" class="view-body">
    <el-main>
      <el-card :body-style="{ padding: '0' }" class="box-card">
        <div slot="header" class="box-card-header">
          <div class="header-left">
            <span>基础服务</span><i class="el-icon-edit-outline" @click="handleEditBaseInfo" />
          </div>
          <div>创建日期：2020-09-21</div>
        </div>
        <div class="card-body pad10">
          <el-form label-width="100px" :model="form" class="base-info">
            <el-row :gutter="20">
              <el-col :span="6">
                <el-form-item label="模板名称:">
                  <el-input
                    ref="form_name"
                    v-model.trim="form.name"
                    placeholder="请输入模板名称"
                    :disabled="!contenteditable"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="状态:">
                  <el-select v-model="form.status" placeholder="请选择" :disabled="!contenteditable">
                    <el-option label="启用" :value="1" />
                    <el-option label="禁用" :value="0" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="备注:">
                  <el-input
                    v-model.trim="form.remark"
                    type="textarea"
                    autosize
                    placeholder="请输入备注信息"
                    resize="none"
                    :disabled="!contenteditable"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </el-card>
      <!-- 配置信息 -->
      <el-card :body-style="{ padding: '0' }" class="box-card flex-auto">
        <div slot="header" class="box-card-header">
          <div class="header-left"><span>配置信息</span></div>
        </div>
        <div class="card-body">
          <el-container>
            <el-aside width="240px" class="pad15">
              <el-input v-model.trim="keyword" suffix-icon="el-icon-search" class="mb10" />
              <el-card :body-style="{ padding: '10px' }" class="flex-auto anchor-card" shadow="never">
                <!-- <Anchor :affix="false">
                  <el-tree ref="tree" :data="list" node-key="id" :props="defaultProps" default-expand-all :filter-node-method="filterNode" :expand-on-click-node="false">
                    <span slot-scope="{ node }" class="custom-tree-node">
                      <AnchorLink slot-scope="{ node }" class="custom-tree-node" :href="`#menu_${node.id}`" :title="node.label" />
                    </span>
                  </el-tree>
                </Anchor> -->

                <el-tree
                  ref="tree"
                  :data="list"
                  node-key="id"
                  :props="defaultProps"
                  default-expand-all
                  :filter-node-method="filterNode"
                  :expand-on-click-node="false"
                >
                  <span
                    slot-scope="{ node, data }"
                    :name="'menu_' + node.id"
                    class="custom-tree-node"
                    @click="handleNodeClick(data)"
                  >
                    {{ node.label }}
                  </span>
                </el-tree>
              </el-card>
            </el-aside>
            <el-main class="pad15">
              <el-collapse v-model="activeNames">
                <el-collapse-item
                  v-for="item in list"
                  :id="'menu_' + item.id"
                  :ref="'menu_' + item.id"
                  :key="item.id"
                  :name="String(item.id)"
                  :title="item.menuText"
                >
                  <div class="pad15">
                    <template v-if="item.children && item.children.length">
                      <!-- 一级菜单 -->
                      <div
                        v-for="(subItem, subIndex) in item.children"
                        :id="'menu_' + subItem.id"
                        :key="subItem.id"
                        class="border"
                        :class="{ mt15: subIndex > 0, shadow: subItem.tagList && subItem.tagList.length }"
                      >
                        <div class="title pad0_15" :class="{ 'bg-grey': subItem.tagList && subItem.tagList.length }">
                          {{ subItem.menuText }}
                        </div>
                        <!-- 二级菜单，有功能配置项 start -->
                        <div v-if="subItem.tagList && subItem.tagList.length" class="tag-body pad15">
                          <el-checkbox v-model="checkAll" class="selectAll" :indeterminate="isIndeterminate"
                            >全选</el-checkbox
                          >
                          <el-checkbox-group v-model="checkedItem">
                            <el-row :gutter="20">
                              <el-col
                                v-for="(tagItem, tagIndex) in subItem.tagList"
                                :key="tagItem.name + '_' + subItem.id"
                                class="mb10"
                                :span="6"
                                :offset="tagIndex == 0 ? 6 : 0"
                              >
                                <el-checkbox :label="tagItem.text">{{ tagItem.text }}</el-checkbox>
                              </el-col>
                            </el-row>
                          </el-checkbox-group>
                        </div>
                        <!-- 二级菜单由功能配置项 end -->
                        <!--  -->
                        <!-- 二级菜单无功能配置项 start -->
                        <div v-else class="pad15">
                          <!-- 三级菜单配置 -->
                          <template v-if="subItem.children && subItem.children.length" />
                          <div
                            v-for="(item_3, item3Index) in subItem.children"
                            :id="'menu_' + item_3.id"
                            :key="item_3.id"
                            class="border"
                            :class="{ mt15: item3Index > 0, shadow: item_3.tagList && item_3.tagList.length }"
                          >
                            <div class="title pad0_15" :class="{ 'bg-grey': item_3.tagList && item_3.tagList.length }">
                              {{ item_3.menuText }}
                            </div>
                            <div v-if="item_3.tagList && item_3.tagList.length" class="tag-body pad15">
                              <el-checkbox v-model="checkAll" class="selectAll" :indeterminate="isIndeterminate"
                                >全选</el-checkbox
                              >
                              <el-checkbox-group v-model="checkedItem">
                                <el-row :gutter="20">
                                  <el-col
                                    v-for="(tagItem, tagIndex) in item_3.tagList"
                                    :key="tagItem.name + '_' + item_3.id"
                                    class="mb10"
                                    :span="6"
                                    :offset="tagIndex == 0 ? 6 : 0"
                                  >
                                    <el-checkbox :label="tagItem.text">{{ tagItem.text }}</el-checkbox>
                                  </el-col>
                                </el-row>
                              </el-checkbox-group>
                            </div>
                            <div v-else class="pad15" />
                          </div>
                        </div>

                        <!-- 二级菜单无功能配置项 end -->
                      </div>
                    </template>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </el-main>
          </el-container>
        </div>
      </el-card>
    </el-main>
    <el-footer>
      <el-button type="primary">另存为模板</el-button>
      <el-button @click="handleGoBack">取消</el-button>
      <el-button type="primary">提 交</el-button>
    </el-footer>
  </el-container>
</template>

<script>
export default {
  name: 'TemplateDetail',
  data() {
    return {
      loading: false,
      form: {
        parentId: '',
        id: '',
        name: '模板名称',
        status: 1,
        remark:
          '备注信息备注信息备注信息备注信息备注信息备注信息备注信息备注信息备注信息备注信息备注信息备注信息备注信息备注信息备注信息备注信息备注信息备注信息备注信息'
      },
      contenteditable: false, // 是否允许修改基本信息
      defaultProps: {
        children: 'children',
        label: 'menuText'
      },
      list: [
        {
          id: 1,
          menuText: '角色管理',
          tagList: [],
          children: [
            {
              id: 11,
              menuText: '角色分类',
              tagList: [
                {
                  text: '新建',
                  name: 'add'
                },
                {
                  text: '编辑',
                  name: 'update'
                },
                {
                  text: '查询',
                  name: 'search'
                },
                {
                  text: '删除',
                  name: 'delete'
                },
                {
                  text: '启用',
                  name: 'enable'
                },
                {
                  text: '预览',
                  name: 'prview'
                },
                {
                  text: '下载',
                  name: 'dowmload'
                }
              ]
            },
            {
              id: 12,
              menuText: '角色信息',
              tagList: [
                {
                  text: '新建',
                  name: 'add'
                },
                {
                  text: '编辑',
                  name: 'update'
                },
                {
                  text: '查询',
                  name: 'search'
                },
                {
                  text: '删除',
                  name: 'delete'
                }
              ]
            }
          ]
        },
        {
          id: 2,
          menuText: '项目管理',
          tagList: []
        },
        {
          id: 5,
          menuText: '用户管理',
          tagList: [],
          children: [
            {
              id: '5-1',
              menuText: '用户信息',
              children: [
                {
                  id: '5-1-1',
                  menuText: '用户信息-1'
                },
                {
                  id: '5-1-2',
                  menuText: '用户信息-2'
                }
              ]
            },
            {
              id: '5-2',
              menuText: '用户管理3-2'
            }
          ]
        },
        {
          id: 4,
          menuText: '部门管理',
          tagList: [
            {
              text: '新建',
              name: 'add'
            },
            {
              text: '编辑',
              name: 'update'
            },
            {
              text: '查询',
              name: 'search'
            },
            {
              text: '删除',
              name: 'delete'
            }
          ]
        },
        {
          id: 3,
          menuText: '用户管理',
          tagList: [],
          children: [
            {
              id: '3-1',
              menuText: '用户信息',
              children: [
                {
                  id: '3-1-1',
                  menuText: '用户信息-1'
                },
                {
                  id: '3-1-2',
                  menuText: '用户信息-2'
                }
              ]
            },
            {
              id: '3-2',
              menuText: '用户管理3-2'
            }
          ]
        },
        {
          id: 6,
          menuText: 'item6',
          tagList: [],
          children: [
            {
              id: '6-1',
              menuText: 'item6-1',
              children: [
                {
                  id: '6-1-1',
                  menuText: 'item6-1-1',
                  tagList: [
                    {
                      text: '新建',
                      name: 'add'
                    },
                    {
                      text: '编辑',
                      name: 'update'
                    },
                    {
                      text: '查询',
                      name: 'search'
                    },
                    {
                      text: '删除',
                      name: 'delete'
                    }
                  ]
                },
                {
                  id: '6-1-2',
                  menuText: 'item6-1-2'
                }
              ]
            },
            {
              id: '6-2',
              menuText: 'item6-2'
            }
          ]
        },
        {
          id: 7,
          menuText: 'item7',
          tagList: [],
          children: [
            {
              id: '7-1',
              menuText: 'item7-1',
              children: [
                {
                  id: '7-1-1',
                  menuText: 'item7-1-2'
                },
                {
                  id: '7-1-2',
                  menuText: 'item7-1-2',
                  tagList: [
                    {
                      text: '新建',
                      name: 'add'
                    },
                    {
                      text: '编辑',
                      name: 'update'
                    },
                    {
                      text: '查询',
                      name: 'search'
                    },
                    {
                      text: '删除',
                      name: 'delete'
                    },
                    {
                      text: '启用',
                      name: 'enable'
                    },
                    {
                      text: '预览',
                      name: 'prview'
                    },
                    {
                      text: '下载',
                      name: 'dowmload'
                    }
                  ]
                }
              ]
            },
            {
              id: '7-2',
              menuText: 'item7-2',
              tagList: [
                {
                  text: '新建',
                  name: 'add'
                },
                {
                  text: '编辑',
                  name: 'update'
                },
                {
                  text: '查询',
                  name: 'search'
                },
                {
                  text: '删除',
                  name: 'delete'
                },
                {
                  text: '启用',
                  name: 'enable'
                },
                {
                  text: '预览',
                  name: 'prview'
                },
                {
                  text: '下载',
                  name: 'dowmload'
                }
              ]
            }
          ]
        }
      ],
      keyword: '',
      activeNames: '',
      checkedItem: '',
      isIndeterminate: false,
      checkAll: false
    }
  },
  watch: {
    keyword(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
    this.handleQueryTemplateInfo(this.$route.query.id)
    this.hanldeSetCollapseOpend()
  },
  methods: {
    // 获取当前模板的具体信息
    handleQueryTemplateInfo(id) {
      if (!id) {
        this.$message.error('参数错误')
        return
      }
    },
    // 编辑模板的基本信息
    handleEditBaseInfo() {
      this.contenteditable = true
      this.$nextTick(() => {
        this.$refs.form_name.focus()
      })
    },
    // 根据关键字搜索
    filterNode(value, data) {
      if (!value) return true
      return data.menuText.toLowerCase().includes(value.toLowerCase())
    },
    // 展开所有的一级折叠面板
    hanldeSetCollapseOpend() {
      this.activeNames = this.list.map(item => String(item.id))
      // console.log(this.activeNames)
    },
    // 点击锚点
    handleNodeClick(data) {
      document.getElementById('menu_' + data.id).scrollIntoView({
        block: 'start',
        behavior: 'smooth'
      })
      // this.$refs['menu_' + data.id].scrollIntoView({ block: 'start', behavior: 'smooth' })
    },
    // 返回模板列表
    handleGoBack() {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/common.scss';
@import './index.scss';
</style>
