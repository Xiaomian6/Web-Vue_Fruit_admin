import request from '@/utils/request'

export function applyList(query) {
  return request({
    url: '/apply_vertify/',
    method: 'get',
    params: query
  })
}

export function successList(query) {
  return request({
    url: '/success_vertify/',
    method: 'get',
    params: query
  })
}

export function failList(query) {
  return request({
    url: '/fail_vertify/',
    method: 'get',
    params: query
  })
}

export function updateStatus(data, id) {
  return request({
    url: `/vertify/${id}/`,
    method: 'patch',
    data
  })
}
