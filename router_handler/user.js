// 导入 数据库操作模块
const db = require('../db/index')
// 导入 bcrypt 这个包
const bcrypt = require('bcryptjs')
// 导入 生成token 的包
const jwt = require('jsonwebtoken')
// 导入全局的配置文件
const config = require('../config')
// 注册新用户的处理函数
exports.reguser = (req, res) => {
  // 获取客户端提交到服务器的用户信息
  const userInfo = req.body
  // 对表单中的数据合法性的校验
  // if (!userInfo.username || !userInfo.password) {
  //   return res.send({
  //     status: 1,
  //     message: '用户名或者密码不合法'
  //   })
  // }

  // 定义 SQL语句，查询用户名是都被占用
  const sqlStr = 'select * from ev_user where username=?'
  db.query(sqlStr, userInfo.username, (err, results) => {
    if (err) {
      return res.send({ status: 1, message: err.message })
    }
    // res.send('错误')
    if (results.length > 0) {
      return res.send(({ status: 1, message: '用户名被占用！' }))
    }
  })
  // 调用bcrypt.hashSync() 对密码进行加密
  userInfo.password = bcrypt.hashSync(userInfo.password, 10)
  // 定义插入新用户的 sql 语句
  const sql = 'insert into ev_user set ?'
  // 调用 db.query()
  db.query(sql, { username: userInfo.username, password: userInfo.password }, (err, results) => {
    // 判断 sql 是否执行成功
    // if (err) return res.send({ status: 1, message: err.message })
    if (err) return console.log(err.message)
    // 判断影响行数是否为1
    if (results.affectedRows !== 1) return res.send({ status: 1, message: '祝此次用户失败，请稍后重试' })
    // 注册成功
    // res.send({ status: 0, message: '注册成功！' })
    res.cc('注册成功！', 0)
  })
}

// 登录的处理函数
exports.login = (req, res) => {
  // 接收表单的数据
  const userinfo = req.body
  // 定义 sql 语句
  const sql = 'select * from ev_user where username=?'
  // 执行 sql 语句
  db.query(sql, userinfo.username, (err, results) => {
    // 执行 sql 语句失败了
    if (err) return res.cc(err)
    // 查询数据条数
    if (results.length !== 1) return res.cc('没有注册，请先去注册！')
    // 按断密码是否正确
    const compareResult = bcrypt.compareSync(userinfo.password, results[0].password)
    if (!compareResult) return res.cc('登录失败111')
    // 在服务器端生成，Token 字符串
    const user = { ...results[0], password: '', user_pic: '' }
    // 对用户的信息进行加密，生成 Token 字符串
    const tokenStr = jwt.sign(user, config.jwtSecretKey, { expiresIn: config.expiresIn })
    // 调用 res.send 将 Token 响应给客户端
    res.send({
      status: 0,
      message: '登录成功！',
      token: 'Bearer ' + tokenStr
    })
  })

}