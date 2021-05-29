// 导入 mysql
const mysql = require('mysql')


const db = mysql.createPool({
  host: '1.15.236.39',
  user: 'server_xiaoxiong',
  password: '4x6WknJiWWsKEtDP',
  database: 'server_xiaoxiong'
})

module.exports = db