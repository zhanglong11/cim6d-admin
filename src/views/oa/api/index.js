import http from '@/utils/request'
export const OaApi = {
  // 表单分组列表
  queryFormGroupList: data => {
    return http.processApi.post(`/oa/form/group/list`, data)
  },
  // 表单分组下拉列表
  queryFormGroupSelectList: data => {
    return http.processApi.post(`/oa/form/group/select`, data)
  },
  // 保存表单分组
  saveFormGroup: data => {
    return http.processApi.post(`/oa/form/group/save`, data)
  },
  // 删除表单分组
  deleteFormGroup: id => {
    return http.processApi.get(`/oa/form/group/delete/${id}`)
  },
  // 修改表单分组排序
  updateSortFormGroup: data => {
    return http.processApi.post(`/oa/form/group/updateSort`, data)
  },
  // 审批样式列表
  queryAuditStyleList: data => {
    return http.processApi.post(`/oa/audit/style/list`, data)
  },
  // 保存审批样式
  saveAuditStyle: data => {
    return http.processApi.post(`/oa/audit/style/save`, data)
  },
  // 审批样式详情
  getDetailsAuditStyle: id => {
    return http.processApi.get(`/oa/audit/style/get/${id}`)
  },
  // 启用审批样式
  enableAuditStyle: id => {
    return http.processApi.get(`/oa/audit/style/enable/${id}`)
  },
  // 禁用审批样式
  disableAuditStyle: id => {
    return http.processApi.get(`/oa/audit/style/disable/${id}`)
  },
  // 表单列表
  queryFormList: data => {
    return http.processApi.post(`/oa/form/list`, data)
  },
  // 删除表单
  deleteForm: id => {
    return http.processApi.get(`/oa/form/delete/${id}`)
  },
  // 修改表单排序
  updateSortForm: data => {
    return http.processApi.post(`/oa/form/updateSort`, data)
  },
  // 表单发布
  publishForm: id => {
    return http.processApi.get(`/oa/form/publish/${id}`)
  },
  // 表单重置
  resetForm: id => {
    return http.processApi.get(`/oa/form/reset/${id}`)
  }
}
