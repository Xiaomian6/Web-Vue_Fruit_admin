import Mock from 'mockjs'

export default {
  getUseradminlist: () => {
    const items = Mock.mock({
      'items|100': [{
        user_id: "0012",
        user_name: "xiaomian",
        user_password: "1234567890",
        role_name: "admin",
        user_phone: "13712789887",
        user_email: "me@xiaomian.love",
        user_creditscore: "70",
        user_avator: "undefined1",
        user_ifrealname: true,
        user_ifeffective: false
      }]
    })
    return {
      code: 20000,
      total: items.length,
      data: items
    }
  },
  getPv: () => ({
    pvData: [{ key: 'PC', pv: 1024 }, { key: 'mobile', pv: 1024 }, { key: 'ios', pv: 1024 }, { key: 'android', pv: 1024 }]
  }),
  createUser: () => ({
    data: 'success'
  }),
  updateUser: () => ({
    data: 'success'
  })
}
