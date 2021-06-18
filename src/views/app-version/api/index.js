import http from '@/utils/request'
export default {
  //应用列表
  getList: data => {
    return http.post(`/app/list`, data)
  },
  //添加Add
  addApp: data => {
    return http.post(`/app/add`, data)
  },
  //修改app
  updateApp: data => {
    return http.post(`/app/update`, data)
  },
  //删除app
  deleteApp: id => {
    return http.get(`/app/delete/${id}`)
  },
  //获取记录列表
  getRecordList: data => {
    return http.post(`/app/version/record/list`, data)
  },
  //添加记录列表
  addAppRecord: data => {
    return http.post(`/app/version/record/add`, data)
  },
  //修改记录信息
  updateAppRecord: data => {
    return http.post(`/app/version/record/update`, data)
  },
  //删除记录信息
  deleteAppRecord: id => {
    return http.get(`/app/version/record/delete/${id}`)
  }
}
