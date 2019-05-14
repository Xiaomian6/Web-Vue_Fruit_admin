import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/shop/',
    method: 'get',
    params: query
  })
}

export function updateStore(data, id) {
  return request({
    url: `/shop/${id}/`,
    method: 'patch',
    data
  })
}

export function deleteStore(id) {
  return request({
    url: `/shop/${id}/`,
    method: 'delete'
  })
}

export function goodsList(query) {
  return request({
    url: '/goods/',
    method: 'get',
    params: query
  })
}

export function updateGoods(data, id) {
  return request({
    url: `/goods/${id}/`,
    method: 'patch',
    data
  })
}

export function ordersList(query) {
  return request({
    url: '/order/',
    method: 'get',
    params: query
  })
}

