import request from '@/utils/request'
import upload from '@/utils/upload'

const serviceAPI = {
  // 获取所有的服务项列表
  getServiceList: data => {
    return request({
      url: '/admin/sys/service/list',
      method: 'post',
      data
    })
  },
  // 新建服务项
  AddServiceItem: data => {
    return request({
      url: '/admin/sys/service/add',
      method: 'post',
      data
    })
  },
  // 编辑服务项及编辑服务项可用状态
  updateServiceItem: data => {
    return request({
      url: '/admin/sys/service/update',
      method: 'post',
      data
    })
  },
  // 设置服务可用
  setServiceItemEnable(id) {
    return request({
      url: `/admin/sys/service/enable/${id}`,
      method: 'GET'
    })
  },
  // 设置服务不可用
  setServiceItemDisabled(id) {
    return request({
      url: `/admin/sys/service/disable/${id}`,
      method: 'GET'
    })
  },
  // 查询当前服务下的模块
  queryServiceItemInfo: data => {
    return request({
      url: '/admin/service/power/tree',
      method: 'POST',
      data
    })
  },
  // 删除当前服务
  deleteServiceItem: id => {
    return request({
      url: `/admin/sys/service/delete/${id}`,
      method: 'get'
    })
  },
  // 上传文件
  uploadFile: data => {
    return upload({
      url: `/file/common/upload`,
      method: 'POST'
    })
  },
  // 获取当前服务下的模块
  getModuleList: data => {
    return request({
      url: `/admin/service/power/tree`,
      method: 'post',
      data
    })
  },
  // 微信推送配置 启用 @author yangjiaqi
  enableWxMessage: id => {
    return request({
      url: `/admin/sys/service/wxMessage/enable/${id}`,
      method: 'get'
    })
  },
  // 微信推送配置 禁用 @author yangjiaqi
  disableWxMessage: id => {
    return request({
      url: `/admin/sys/service/wxMessage/disable/${id}`,
      method: 'get'
    })
  }
}

export default serviceAPI
