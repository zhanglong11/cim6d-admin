import request from '@/utils/request'

const companyAPI = {
  // 获取所有的公司列表
  getCompanyList: data => {
    return request({
      url: '/admin/companyBase/list',
      method: 'post',
      data
    })
  },
  // 设置企业可用
  setCompanyItemEnable(id) {
    return request({
      url: `/admin/companyBase/enable/${id}`,
      method: 'GET'
    })
  },
  // 设置企业不可用
  setCompanyItemDisabled(id) {
    return request({
      url: `/admin/companyBase/disable/${id}`,
      method: 'GET'
    })
  },
  // 新建企业
  addCompanyItem(data) {
    return request({
      url: `/admin/companyBase/add`,
      method: 'post',
      data
    })
  },
  // 更新企业信息
  updateCompanyItem(data) {
    return request({
      url: `/admin/companyBase/update`,
      method: 'post',
      data
    })
  },
  // 获取企业详细信息
  getCompanyInfo(id) {
    return request({
      url: `/admin/companyBase/get/${id}`,
      method: 'get'
    })
  },
  // 获取图片信息
  getFileList(ids) {
    return request.file({
      url: `/file/manage/list`,
      method: 'post',
      data: ids
    })
  },
  // 获取企业所拥有的权限
  queruAllPower(data) {
    return request({
      url: `/admin/company/all/power`,
      method: 'post',
      data
    })
  },
  // 取消指定权限
  cancelAuthorizationItem({ companyId, serviceId }) {
    return request({
      url: `/admin/company/power/reset/${companyId}/${serviceId}`,
      method: 'GET'
    })
  },
  // 企业权限绑定
  bindPowerCompany(data) {
    return request({
      url: `/admin/company/power/bind`,
      method: 'post',
      data
    })
  },
  // 企业服务授权列表
  queryServiceAuthList(data) {
    return request({
      url: `/admin/company/serviceAuthList`,
      method: 'post',
      data
    })
  },
  // 企业服务授权
  serviceAuthCompany(data) {
    return request({
      url: `/admin/company/serviceAuth`,
      method: 'post',
      data
    })
  },
  // 获取企业可用权限
  getAvailablePowerCompany(companyId, serviceId) {
    return request({
      url: `/admin/company/power/available/${companyId}/${serviceId}`,
      method: 'get'
    })
  }
}

export default companyAPI
