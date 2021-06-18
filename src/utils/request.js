import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
let configEnv = process.env.VUE_APP_BASE_API // 环境变量
// configEnv = '-test'
const timeout = 30000

// 超管API
const service = axios.create({
  baseURL: `/cim6d-admin${configEnv}`, // process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout, // request timeout
  showLoading: false
})
// 管理员API
const system = axios.create({
  baseURL: `/cim6d-system${configEnv}`, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout // request timeout
})

// 文件相关API
const file = axios.create({
  baseURL: `/cim6d-file${configEnv}`,
  timeout
})

// 微信相关API
const wx = axios.create({
  baseURL: `/cim6d-wx${configEnv}`,
  timeout
})

// OA相关API
const processApi = axios.create({
  baseURL: `/cim6d-process${configEnv}`,
  timeout
})

function addInterceptor(service) {
  // request interceptor
  service.interceptors.request.use(
    config => {
      if (store.getters.token) {
        // let each request carry token
        // ['X-Token'] is a custom headers key
        // please modify it according to the actual situation
        config.headers['x-access-token'] = getToken()
      }
      config.headers['platform'] = store.state.user.serviceId
      config.headers['application-type'] = 'pc'
      return config
    },
    error => {
      // do something with request error
      console.log(error) // for debug
      return Promise.reject(error)
    }
  )

  // response interceptor
  service.interceptors.response.use(
    /**
     * If you want to get http information such as headers or status
     * Please return  response => response
     */

    /**
     * Determine the request status by custom code
     * Here is just an example
     * You can also judge the status by HTTP Status Code
     */
    response => {
      if (response.config.responseType === 'blob') {
        return response
      }
      const res = response.data
      // if the custom code is not 200, it is judged as an error.
      if (res.code !== 200) {
        Message({
          message: res.message || 'Error',
          type: 'error',
          duration: 3 * 1000
        })

        // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
        if (res.code === 1000) {
          // to re-login
          store.dispatch('user/logout')
          location.reload()
        }
        if (res.code === 500) {
          return Promise.reject(res)
        }
        return Promise.reject(new Error(res.message || 'Error'))
      } else {
        return res
      }
    },
    error => {
      console.log('err' + error) // for debug
      Message({
        message: error.message,
        type: 'error',
        duration: 3 * 1000
      })
      return Promise.reject(error)
    }
  )
}
addInterceptor(service)
addInterceptor(system)
addInterceptor(file)
addInterceptor(wx)
addInterceptor(processApi)
service.system = system
service.file = file
service.wx = wx
service.processApi = processApi

export default service
