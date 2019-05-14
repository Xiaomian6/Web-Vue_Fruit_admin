import request from '@/utils/request'

export function buyList(query) {
  return request({
    url: '/buy/',
    method: 'get',
    params: query
  })
}

export function buyTaskList(query) {
  return request({
    url: '/buy_task/',
    method: 'get',
    params: query
  })
}

export function updateTask(data, id) {
  return request({
    url: `/taskdetail/${id}/`,
    method: 'patch',
    data
  })
}
