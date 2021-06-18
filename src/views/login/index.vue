<template>
  <div class="login-container">
    <canvas id="canvas" width="1636" height="1249" />

    <h3 class="logo" />

    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      label-position="left"
      size="large"
    >
      <div class="title-container">
        <h3 class="title">登 录</h3>
      </div>
      <el-form-item prop="loginName">
        <span class="svg-container">
          <svg-icon icon-class="mobile" />
        </span>
        <el-input
          ref="loginName"
          v-model.trim="loginForm.loginName"
          placeholder="手机号"
          name="loginName"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model.trim="loginForm.password"
          :type="passwordType"
          placeholder="密码"
          name="password"
          tabindex="2"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>
      <el-button
        size="large"
        :loading="loading"
        type="primary"
        style="width: 100%; margin-top: 10px"
        @click.prevent="handleLogin"
        >登 录</el-button
      >
    </el-form>
  </div>
</template>

<script>
import $ from 'jquery'
import tencentCaptchaPromise from '@/utils/tencentCaptchaPromise'
export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入手机号'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        isAdminPlatform: 1,
        loginName: '',
        password: '',
        loginAuto: false,
        verificationCode: ''
      },
      loginRules: {
        loginName: [
          {
            required: true,
            trigger: 'blur',
            validator: validateUsername
          }
        ],
        password: [
          {
            required: true,
            trigger: 'blur',
            validator: validatePassword
          }
        ],
        verificationCode: [{ required: true, trigger: 'blur', message: '请输入合格验证码' }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      imgUrl: null
    }
  },
  computed: {
    loginAuto() {
      return this.$store.state.user.loginAuto
    },
    token() {
      return this.$store.state.user.token
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  created() {},
  mounted() {
    this.loadingAnimation()
    // if (this.loginAuto) {
    //   this.$router.push({
    //     path: this.redirect || '/'
    //   })
    // }
  },
  methods: {
    // 动画
    loadingAnimation() {
      $(function () {
        var canvas = document.querySelector('canvas')
        var ctx = canvas.getContext('2d')
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        ctx.lineWidth = 0.3
        ctx.strokeStyle = new Color(150).style

        var mousePosition = {
          x: (30 * canvas.width) / 100,
          y: (30 * canvas.height) / 100
        }

        var dots = {
          nb: 250,
          distance: 100,
          d_radius: 150,
          array: []
        }

        function colorValue(min) {
          return Math.floor(Math.random() * 255 + min)
        }

        function createColorStyle(r, g, b) {
          return 'rgba(' + r + ',' + g + ',' + b + ', 0.8)'
        }

        function mixComponents(comp1, weight1, comp2, weight2) {
          return (comp1 * weight1 + comp2 * weight2) / (weight1 + weight2)
        }

        function averageColorStyles(dot1, dot2) {
          var color1 = dot1.color
          var color2 = dot2.color

          var r = mixComponents(color1.r, dot1.radius, color2.r, dot2.radius)
          var g = mixComponents(color1.g, dot1.radius, color2.g, dot2.radius)
          var b = mixComponents(color1.b, dot1.radius, color2.b, dot2.radius)
          return createColorStyle(Math.floor(r), Math.floor(g), Math.floor(b))
        }

        function Color(min) {
          min = min || 0
          this.r = colorValue(min)
          this.g = colorValue(min)
          this.b = colorValue(min)
          this.style = createColorStyle(this.r, this.g, this.b)
        }

        function Dot() {
          this.x = Math.random() * canvas.width
          this.y = Math.random() * canvas.height

          this.vx = -0.5 + Math.random()
          this.vy = -0.5 + Math.random()

          this.radius = Math.random() * 2

          this.color = new Color()
          // console.log(this)
        }

        Dot.prototype = {
          draw: function () {
            ctx.beginPath()
            ctx.fillStyle = this.color.style
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
            ctx.fill()
          }
        }

        function createDots() {
          for (let i = 0; i < dots.nb; i++) {
            dots.array.push(new Dot())
          }
        }

        function moveDots() {
          for (let i = 0; i < dots.nb; i++) {
            var dot = dots.array[i]

            if (dot.y < 0 || dot.y > canvas.height) {
              dot.vx = dot.vx
              dot.vy = -dot.vy
            } else if (dot.x < 0 || dot.x > canvas.width) {
              dot.vx = -dot.vx
              dot.vy = dot.vy
            }
            dot.x += dot.vx
            dot.y += dot.vy
          }
        }

        function connectDots() {
          for (let i = 0; i < dots.nb; i++) {
            for (let j = 0; j < dots.nb; j++) {
              const i_dot = dots.array[i]
              const j_dot = dots.array[j]

              if (
                i_dot.x - j_dot.x < dots.distance &&
                i_dot.y - j_dot.y < dots.distance &&
                i_dot.x - j_dot.x > -dots.distance &&
                i_dot.y - j_dot.y > -dots.distance
              ) {
                if (
                  i_dot.x - mousePosition.x < dots.d_radius &&
                  i_dot.y - mousePosition.y < dots.d_radius &&
                  i_dot.x - mousePosition.x > -dots.d_radius &&
                  i_dot.y - mousePosition.y > -dots.d_radius
                ) {
                  ctx.beginPath()
                  ctx.strokeStyle = averageColorStyles(i_dot, j_dot)
                  ctx.moveTo(i_dot.x, i_dot.y)
                  ctx.lineTo(j_dot.x, j_dot.y)
                  ctx.stroke()
                  ctx.closePath()
                }
              }
            }
          }
        }

        function drawDots() {
          for (let i = 0; i < dots.nb; i++) {
            var dot = dots.array[i]
            dot.draw()
          }
        }

        function animateDots() {
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          moveDots()
          connectDots()
          drawDots()

          requestAnimationFrame(animateDots)
        }

        $('canvas').on('mousemove', function (e) {
          mousePosition.x = e.pageX
          mousePosition.y = e.pageY
        })

        $('canvas').on('mouseleave', function (e) {
          mousePosition.x = canvas.width / 2
          mousePosition.y = canvas.height / 2
        })

        createDots()
        requestAnimationFrame(animateDots)
      })
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    async handleLogin() {
      await this.$refs.loginForm.validate()
      const isProd = process.env.NODE_ENV === 'production'
      let loginForm = _.cloneDeep(this.loginForm)
      if (isProd) {
        const { ticket, randstr } = await tencentCaptchaPromise()
        _.assign(loginForm, { ticket, randstr })
      }
      this.loading = true
      this.$store
        .dispatch('user/login', loginForm)
        .then(() => {
          this.$router.push({
            path: this.redirect || '/'
          })
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>
<style lang="scss" scoped>
$dark_gray: #889aa4;

.login-container {
  background: url('../../assets/images/login-bg.jpg') no-repeat;
  background-size: cover;
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 2;
  #canvas {
    position: absolute;
    z-index: -1;
  }
  .login-form {
    width: 460px;
    background: rgba(255, 255, 255, 0.9);
    margin-top: 50px;
    padding: 40px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
  }

  .svg-container {
    // padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 40px;
    display: inline-block;
    text-align: center;
  }

  .title-container {
    position: relative;

    .title {
      padding: 6px;
      text-align: center;
      font-weight: 600;
      font-size: 20px;
      margin: 0;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 0;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .code {
    margin-bottom: 10px;
    ::v-deep > div {
      display: flex;
      justify-content: space-between;
    }
    .codeImg {
      width: 100px;
      height: 40px;
      cursor: pointer;
    }
  }

  .logo {
    width: 450px;
    height: 44px;
    background: url('../../assets/images/login-logo.png');
    margin: -50px 0 0;
    background-size: cover;
  }

  .el-button--large {
    font-size: 16px;
  }
}
</style>
<style lang="scss">
$bg: #283443;
$cursor: #fff;

.login-container {
  .el-form-item {
    border-radius: 5px;
    border: 1px solid #d9d9d9;

    &.setting {
      border: none;

      .el-form-item__content {
        &::before,
        &::after {
          content: none;
        }

        display: flex;
        padding: 0 15px;
        justify-content: space-between;
      }
    }

    .el-input__inner {
      border: none;
      padding-right: 30px;
      padding-left: 40px;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }

    .svg-container {
      position: absolute;
      top: 0;
      bottom: 0;
      z-index: 5;
    }

    .svg-container {
      left: 0;
    }
  }
}
</style>
