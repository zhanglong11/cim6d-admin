let mask = document.querySelector('.mask')
let fileDom = document.querySelector('.file')
let tis = document.querySelector('.tis')
let progress = document.querySelector('.tis-progress')
let cancel = document.querySelector('.cancel-btn')

let createUpload = (file, url, key = 'file', header = {}, data = {},type='') => {
  console.log(`
	上传地址:${url}\n
	请求头:${JSON.stringify(header)}\n
	参数:${JSON.stringify(data)}
	`)
  if (!url) {
    return
  }
  tis.style.display = 'flex'

  let formData = new FormData()
  formData.append(key, file)

  for (let keys in data) {
    formData.append(keys, data[keys])
  }

  let xhr = new XMLHttpRequest()
  xhr.open('POST', url, true)

  for (let keys in header) {
    xhr.setRequestHeader(keys, header[keys])
  }
  xhr.upload.addEventListener(
    'progress',
    function(event) {
      if (event.lengthComputable) {
        let percent = Math.ceil((event.loaded * 100) / event.total) + '%'
        progress.innerText = `努力上传中..${percent}`
      }
    },
    false
  )

  xhr.ontimeout = function() {
    // xhr请求超时事件处理
    progress.innerText = '请求超时'
    setTimeout(() => {
      tis.style.display = 'none'
      plus.webview.currentWebview().close()
    }, 1000)
  }

  xhr.onreadystatechange = ev => {
    if (xhr.readyState == 4) {
      if (xhr.status == 200) {
        progress.innerText = '上传成功'
        let res=xhr.responseText
        console.log(res)
        if(type==='oda'){
          let sourceFileUrl= JSON.parse(res).data.sourceFileUrl
          let targetFileUrl= JSON.parse(res).data.targetFileUrl
          location.href = `callback?fileName=${file.name}&sourceFileUrl=${sourceFileUrl}&targetFileUrl=${targetFileUrl}`
        }else{
          let id=JSON.parse(res).data
          console.log(id)
          location.href = `callback?fileName=${file.name}&id=${id}`
        }
      } else {
        progress.innerText = '上传失败了'
      }

      setTimeout(() => {
        tis.style.display = 'none'
        plus.webview.currentWebview().close()
      }, 1000)
    }
  }
  xhr.send(formData)

  cancel.addEventListener('click', () => {
    xhr.abort()
    plus.webview.currentWebview().close()
  })
}

mask.addEventListener('click', () => {
  plus.webview.currentWebview().close()
})

document.addEventListener('UniAppJSBridgeReady', () => {
  let { url, key, header, formData,type } = plus.webview.currentWebview()
  console.log(header.type)
  if (header.type && header.type.indexOf('xls') > 0) {
    fileDom.setAttribute('accept', 'application/vnd.ms-excel')
  } else {
    fileDom.removeAttribute('accept')
  }
  fileDom.addEventListener(
    'change',
    event => {
      let file = fileDom.files[0]
      if (header.type) {
        if (header.type.indexOf(file.name.split('.')[1]) < 0) {
          plus.nativeUI.toast('格式不对')
          return
        }
      }
      if (file.size > 1024 * 1024 * 100) {
        plus.nativeUI.toast('单个文件不能超过100M,请重新上传')
        return
      }
      createUpload(file, url, key, header, formData,type)
    },
    false
  )
})
