import request from '@/utils/request'

export function transportList(query) {
  return request({
    url: '/transport/',
    method: 'get',
    params: query
  })
}

export function transportTaskList(query) {
  return request({
    url: '/transport_task/',
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
