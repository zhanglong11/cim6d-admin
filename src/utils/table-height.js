export function setTableMaxHeight(target = '.el-table', hasPagation = true) {
  const docHeight = document.documentElement.clientHeight
  const top = document.querySelector(target) && document.querySelector(target).getBoundingClientRect().top
  const pagationHeight = hasPagation ? 58 : 0
  return docHeight - top - pagationHeight - 20 - 15
}
