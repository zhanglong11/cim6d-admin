import request from '@/utils/request'
// 服务模板功能
const templateApi = {
  // 查询列表
  queryServiceTemplateList: data => {
    return request({
      url: `/serviceTemplate/list`,
      method: 'post',
      data
    })
  },
  // 添加
  addServiceTemplate: data => {
    return request({
      url: `/serviceTemplate/add`,
      method: 'post',
      data
    })
  },
  // 修改
  updateServiceTemplate: data => {
    return request({
      url: `/serviceTemplate/update`,
      method: 'post',
      data
    })
  },
  // 删除
  deleteServiceTemplate: id => {
    return request({
      url: `/serviceTemplate/delete/${id}`,
      method: 'get'
    })
  },
  // 详情
  getDetailsServiceTemplate: id => {
    return request({
      url: `/serviceTemplate/get/${id}`,
      method: 'get'
    })
  },
  // 启用/禁用
  updateStatusServiceTemplate: (id, status) => {
    return request({
      url: `/serviceTemplate/${id}/updateStatus/${status}`,
      method: 'get'
    })
  }
}

export default templateApi
