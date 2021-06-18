import request from '@/utils/request'
// 服务模板功能
const powerGroupApi = {
  // 查询列表
  queryPowerGroupList: data => {
    return request({
      url: `/powerGroup/list`,
      method: 'post',
      data
    })
  },
  // 添加
  addPowerGroup: data => {
    return request({
      url: `/powerGroup/add`,
      method: 'post',
      data
    })
  },
  // 修改
  updatePowerGroup: data => {
    return request({
      url: `/powerGroup/update`,
      method: 'post',
      data
    })
  },
  // 删除
  deletePowerGroup: id => {
    return request({
      url: `/powerGroup/delete/${id}`,
      method: 'get'
    })
  },
  // 详情
  getPowerGroupDetail: id => {
    return request({
      url: `/powerGroup/get/${id}`,
      method: 'get'
    })
  }
}

export default powerGroupApi
