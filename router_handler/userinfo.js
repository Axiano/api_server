// 导入数据库操作模块
const { query } = require('express')
const db = require('../db/index')
const router = require('../router/user')
// 导入处理密码的模块
const bcrypt = require('bcryptjs')


// 获取用户基本信息的处理函数
exports.getUserInfo = (req, res) => {
  // 定义 SQL 语句
  const sqlStr = 'select id, username, nickname, email, user_pic from ev_user where id=?'
  // 调用 db.query 执行 sql 富裕
  db.query(sqlStr, req.user.id, (err, results) => {
    // 执行 sql 语句失败
    if (err) return res.cc(err)
    // 执行sql 语句成功，但是查询的结果可能为空
    if (results.length !== 1) return res.cc('获取用户信息失败！')
    res.send({
      status: 0,
      message: '获取用户信息成功',
      data: results[0]
    })
  })
}

// 更新用户基本信息的基本函数
exports.updateUserInfo = (req, res) => {
  // 定义执行的 sql 语句
  const sql = 'update ev_user set ? where id=?'
  db.query(sql, [req.body, req.body.id], (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows != 1) return res.cc('更新用户信息失败')
    res.cc('更新用户信息成功！', 0)
  })
}

// 更新用户摩玛的处理函数
exports.updatePassword = (req, res) => {
  // 定义 sql 语句
  const sql = 'select * from ev_user where id=?'
  db.query(sql, req.user.id, (err, results) => {
    // 执行 sql 语句失败
    if (err) return res.cc(err)
    // 判断结果是否存在
    if (results.length !== 1) return res.cc('用户不存在')
    // 判断用户输出的旧密码是否正确
    const ccompareResult = bcrypt.compareSync(req.body.oldPwd, results[0].password)
    if (!ccompareResult) return res.cc('旧密码错误！')
    // 更新数据库中的密码
    // 定义更新密码 sql 语句
    const sql = 'update ev_user set password=? where id=?'
    // 对新密码加密处理
    const newPwd = bcrypt.hashSync(req.body.newPwd, 10)
    // 调用 db.qery 执行 sql 语句
    db.query(sql, [newPwd, req.user.id], (err, results) => {
      if (err) return res.cc(err)
      if (results.affectedRows != 1) return res.cc('更新密码失败')
      res.cc('更新密码成功', 0)
    })
  })
}

// 更新用户头像的处理函数
exports.updateAvatar = (req, res) => {
  // 定义更新头像的 sql 语句
  const sql = 'update ev_user set user_pic=? where id=?'
  // 调用 db.query 执行 sql 语句
  db.query(sql, [req.body.avatar, req.user.id], (err, results) => {
    // 判断 sql 语句是否执行成功
    if (err) return res.cc(err)
    // sql 语句执行成功，判断是否添加成功
    if (results.affectedRows != 1) return res.cc('更新用户头像失败！')
    res.cc('更新用户头像成功！', 0)
  })
}