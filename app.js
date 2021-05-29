// 导入express 
const express = require('express')

// 导入 cors 跨域
const cors = require('cors')
const joi = require('@hapi/joi')

// app 实例化
const app = express()

// 配配置 sors
app.use(cors())

// 配置解析表单数据的中间件
app.use(express.urlencoded({ extended: false }))

// 一定要在路由之前，封装 res.cc 函数
app.use((erq, res, next) => {
  // stastus 默认值为1，表示失败的情况
  // err 的值，可能是一个错误对象，也可能是一个错误对象
  res.cc = function (err, status = 1) {
    res.send({
      status,
      message: err instanceof Error ? err.message : err
    })
  }
  next()
})

// 解析 token 的中间件
const expressJWT = require('express-jwt')
const config = require('.//config')
app.use(expressJWT({ secret: config.jwtSecretKey }).unless({ path: [/^\/api/] }))

// 导入并使用用户路由 
const userrouter = require('./router/user')
const { UnauthorizedError } = require('express-jwt')
app.use('/api', userrouter)

// 导入并使用用户信息的路由模块
const userinfoRouter = require('./router/userinfo')
app.use('/my', userinfoRouter)

// 定义错误级别的中间件
app.use((err, req, res, next) => {
  // 验证失败导致的错误
  if (err instanceof joi.ValidationError) return res.cc(err)
  // 这是身份认证失败的错误
  if (err.name === 'UnauthorizedError') return res.cc('身份认证失败！')
  // 未知的错误
  res.cc(err)
})

// 启动服务器
app.listen(3007, () => {
  console.log('aip server running at http://127.0.0.1:3007');
})





