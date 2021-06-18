import request from '@/utils/request'

const settingAPI = {
  // 删除参数
  deleteArg: id => {
    return request.system({
      url: `/cim6d/arg/delete/${id}`,
      method: 'get'
    })
  },
  // 添加普通参数
  addGeneralArg: data => {
    return request.system({
      url: '/cim6d/arg/general/add',
      method: 'post',
      data
    })
  },
  // 获取所有参数
  getAllArg: () => {
    return request.system({
      url: '/cim6d/arg/get/all',
      method: 'get'
    })
  },
  // 分组内参数详情
  getGroupArg: data => {
    return request.system({
      url: '/cim6d/arg/getGroupArg',
      method: 'post',
      data
    })
  },
  // 添加参数分组
  addGroupArg: data => {
    return request.system({
      url: '/cim6d/arg/group/add',
      method: 'post',
      data
    })
  },
  // 编辑参数分组
  updateGroupArg: data => {
    return request.system({
      url: '/cim6d/arg/group/update',
      method: 'post',
      data
    })
  },
  // 删除参数分组
  deleteGroupArg: id => {
    return request.system({
      url: `/cim6d/arg/group/delete/${id}`,
      method: 'get'
    })
  },
  // 获取所有参数分组（按模块）
  queryGroupArgList: data => {
    return request.system({
      url: '/cim6d/arg/group/list',
      method: 'post',
      data
    })
  },
  // 刷新参数数据
  refreshArg: projectId => {
    return request.system({
      url: `/cim6d/arg/refresh/${projectId}`,
      method: 'get'
    })
  },
  // 根据模块获取单号参数列表
  getSequenceListArg: module => {
    return request.system({
      url: `/cim6d/arg/sequence/getSequenceList/${module}`,
      method: 'get'
    })
  },
  // 添加系统参数
  addSystemArg: data => {
    return request.system({
      url: '/cim6d/arg/system/add',
      method: 'post',
      data
    })
  },
  // 参数树
  queryTreeArg: data => {
    return request.system({
      url: '/cim6d/arg/tree',
      method: 'post',
      data
    })
  },
  // 更新参数
  updateArg: data => {
    return request.system({
      url: '/cim6d/arg/update',
      method: 'post',
      data
    })
  },
  // 批量删除参数
  batchDeleteArg: data => {
    return request.system({
      url: `/cim6d/arg/batchDelete`,
      method: 'post',
      data
    })
  },
  // 获取模块集合
  getArgModuleList: () => {
    return request.system({
      url: `/cim6d/arg/module/list`,
      method: 'post'
    })
  },
  // 添加模块
  addArgModule: data => {
    return request.system({
      url: `/cim6d/arg/module/add`,
      method: 'post',
      data
    })
  },
  // 编辑模块
  updateArgModule: (model, data) => {
    return request.system({
      url: `/cim6d/arg/module/update/${module}`,
      method: 'post',
      data
    })
  },
  // 删除模块
  deleteArgModule: module => {
    return request.system({
      url: `/cim6d/arg/module/delete/${module}`,
      method: 'get'
    })
  },
  // 获取模块集合 @author yangjiaqi
  queryModuleList: () => {
    return request.system({
      url: `/cim6d/arg/module/list`,
      method: 'post'
    })
  },
  // 添加模块 @author yangjiaqi
  addModule: data => {
    return request.system({
      url: `/cim6d/arg/module/add`,
      method: 'post',
      data
    })
  },
  // 编辑模块 @author yangjiaqi
  updateModule: data => {
    return request.system({
      url: `/cim6d/arg/module/update`,
      method: 'post',
      data
    })
  },
  // 删除模块 @author yangjiaqi
  deleteModule: module => {
    return request.system({
      url: `/cim6d/arg/module/delete/${module}`,
      method: 'get'
    })
  }
}

export default settingAPI
