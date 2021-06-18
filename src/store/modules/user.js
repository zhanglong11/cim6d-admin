import { login } from '@/api/user'
import settingAPI from '@/api/setting'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import { userEncryption } from '@/utils'

const getDefaultState = () => {
  return {
    token: getToken(),
    loginAuto: localStorage.getItem('loginAuto') || false,
    name: localStorage.getItem('name') || '', // localStorge 为了解决页面刷新后name和avatar 丢失的问题
    avatar: localStorage.getItem('avatar') || '',
    config: JSON.parse(localStorage.getItem('systemConfig') || '{}'), // 全局参数缓存,
    companyAddTemp: localStorage.getItem('companyAddTemp') ? JSON.parse(localStorage.getItem('companyAddTemp')) : '', // 临时存储未保存的企业信息
    cacheTimer: '', // 自动缓存定时器
    serviceId: localStorage.getItem('serviceId') || '', // 服务类型
    saveTime: localStorage.getItem('companyAddTempSaveTime') || '' // 上次自动保存时间
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: state => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_CONFIG: (state, config) => {
    state.config = config
  },
  SET_LOGINAUTO: (state, loginAuto) => {
    state.loginAuto = loginAuto
  },
  // 修改服务类型
  setServiceId(state, serviceId) {
    localStorage.setItem('serviceId', serviceId)
    state.serviceId = serviceId
  },
  // 自动缓存未保存的项目数据
  autoSaveCompanyTemp(state, data) {
    state.cacheTimer = setInterval(() => {
      const time = new Date()
      const h = time.getHours() < 10 ? '0' + time.getHours() : time.getHours()
      const m = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes()
      const saveTime = `，保存时间 ${h}:${m}`
      localStorage.setItem('companyAddTempSaveTime', saveTime)
      state.saveTime = saveTime
      localStorage.setItem('companyAddTemp', JSON.stringify(data))
      state.companyAddTemp = data
    }, 2000)
  },
  // 关闭定时器
  closeCacheTimer(state) {
    clearInterval(state.cacheTimer)
  },
  // 关闭定时器并清除项目缓存数据
  clearCompanyTemp(state) {
    clearInterval(state.cacheTimer)
    localStorage.setItem('companyAddTemp', '')
    state.companyAddTemp = ''
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    // 登录加密
    const params = userEncryption(userInfo)
    return new Promise((resolve, reject) => {
      login(Object.assign({}, userInfo, params))
        .then(response => {
          const { data } = response
          commit('SET_TOKEN', data)
          setToken(data)
          /**
           * 暂无获取用户信息的接口，保存用户登录名
           * **/
          commit('SET_NAME', userInfo.loginName)
          localStorage.setItem('name', userInfo.loginName)
          commit('SET_LOGINAUTO', userInfo.loginAuto)
          localStorage.setItem('loginAuto', userInfo.loginAuto)
          localStorage.setItem('avatar', '')
          this.dispatch('user/setSystemConfigStorage')
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  // 设置全局参数缓存
  /*
  通过value 获取系统参数label
  group 分组参数
  value 参数编码
  this.$getLabelFromArg(group, value)
  */
  setSystemConfigStorage({ commit }) {
    return new Promise((resolve, reject) => {
      const params = {
        module: 'construction'
      }
      settingAPI
        .queryTreeArg(params)
        .then(result => {
          const datas = result.data || []
          const list = {}
          datas.map(items => {
            const listItems = {
              id: items.id,
              label: items.argText,
              value: items.argCode,
              argGroup: items.argGroup,
              children: []
            }
            if (items.children) {
              items.children.map(item => {
                listItems.children.push({
                  label: item.argText,
                  value: item.argCode,
                  argGroup: item.argGroup,
                  deleteFlag: item.deleteFlag
                })
              })
            }
            list[items.argCode] = listItems
          })
          localStorage.setItem('systemConfig', JSON.stringify(list))
          commit('SET_CONFIG', list)
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      resolve()
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise(resolve => {
      // if (!state.loginAuto) { // 非自动登录时
      // removeToken() // must remove  token  first
      // localStorage.removeItem('loginAuto')
      // commit('SET_LOGINAUTO', false)
      // }
      removeToken()
      localStorage.removeItem('name', '')
      localStorage.removeItem('avatar', '')
      commit('clearCompanyTemp')
      resetRouter()
      commit('RESET_STATE')
      resolve()
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
