import http from '@/utils/request'
export default {
  // 推送配置 查看列表 @author zhangyiheng
  queryWxMessageList: data => {
    return http.post(`/wxMessage/list`, data)
  },
  // 推送配置 添加 @author zhangyiheng
  addWxMessage: data => {
    return http.post(`/wxMessage/add`, data)
  },
  // 推送配置 修改 @author zhangyiheng
  updateWxMessage: data => {
    return http.post(`/wxMessage/update`, data)
  },
  // 推送配置 批量删除 @author yangjiaqi
  bathDeleteWxMessage: (powerId, data) => {
    return http.post(`/wxMessage/bathDelete/${powerId}`, data)
  },
  // 字段库配置 查询列表 @author zhangyiheng
  queryWxParamList: data => {
    return http.post(`/wxParam/list`, data)
  },
  // 字段库配置 新增 @author zhangyiheng
  addWxParam: data => {
    return http.post(`/wxParam/add`, data)
  },
  // 字段库配置 编辑 @author zhangyiheng
  updateWxParam: data => {
    return http.post(`/wxParam/update`, data)
  },
  // 字段库配置 删除 @author zhangyiheng
  deleteWxParam: id => {
    return http.get(`/wxParam/delete/${id}`)
  },
  // 获取模板列表 @author yangjiaqi
  getTempMsgList: type => {
    return http.wx.get(`/noToken/wx/temp/getTempMsgList/${type}`)
  },
  // 获取模板详情 @author yangjiaqi
  getDetailsTempMsg: templateId => {
    return http.wx.get(`/noToken/wx/temp/get/${templateId}`)
  }
}
