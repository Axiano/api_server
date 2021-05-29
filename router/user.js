// 导入 express
const express = require('express')
// 创建路由对象
const router = express.Router()

// 导入用户路由处理函数对应的模块
const user_handler = require('../router_handler/user')

// 导入验证数据的中间件
const expressjoi = require('@escook/express-joi')

// 导入需要的验证规则对象
const { reg_login_schema } = require('../schema/user')

// 注册新用户
router.post('/reguser', expressjoi(reg_login_schema), user_handler.reguser)

// 登录
router.post('/login', expressjoi(reg_login_schema), user_handler.login)

// 共享出去 router
module.exports = router