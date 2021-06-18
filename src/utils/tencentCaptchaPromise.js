import settings from '@/settings'

export default function () {
  return new Promise((resolve, reject) => {
    const captcha = new TencentCaptcha(settings.tencentCaptchaAppId, res => {
      if (res.ret === 0) {
        resolve({ ticket: res.ticket, randstr: res.randstr })
      } else {
        reject(new Error('验证失败'))
      }
    })
    captcha.show()
  })
}
