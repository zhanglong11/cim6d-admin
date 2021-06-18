import request from '@/utils/request'

const API = {
  // 获取当前服务下的模块
  getModuleList: data => {
    return request({
      url: `/admin/service/power/tree`,
      method: 'post',
      data
    })
  },
  // 新建模块
  AddModuleItem: data => {
    return request({
      url: `/admin/service/power/add`,
      method: 'post',
      data
    })
  },
  // 编辑模块的基本信息
  updateModuleItem: data => {
    return request({
      url: `/admin/service/power/update`,
      method: 'post',
      data
    })
  },
  // 删除模块
  DeleteModuleItem: id => {
    return request({
      url: `admin/service/power/delete/${id}`,
      method: 'get'
    })
  }
}

export default API
