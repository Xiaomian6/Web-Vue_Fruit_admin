import request from '@/utils/request'

export function procureList(query) {
  return request({
    url: '/procure/',
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

export function updateGoods(data, id) {
  return request({
    url: `/goods/${id}/`,
    method: 'patch',
    data
  })
}

export function procureTaskList(query) {
  return request({
    url: '/procure_task/',
    method: 'get',
    params: query
  })
}

