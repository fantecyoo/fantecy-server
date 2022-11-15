const { exec, escape } = require("../db/mysql")
const { genPassword } = require("../utils/cryp")

const login = async (username, password) => {
  username = escape(username)

  // 生成加密密码
  password = genPassword(password)
  password = escape(password)

  const sql = `
        select username, realname from users where username=${username} and password=${password}
    `
  // console.log('sql is', sql)

  const rows = await exec(sql)
  return rows[0] || {}
}

const register = async username => {
  username = escape(username)

  const sql = `
      insert into users (name) values (${username});
  `

  const rows = await exec(sql)
  return rows.insertId || ""
}

const userList = async () => {
  const sql = `
    select * from users;
  `
  const data = await exec(sql)
  return data
}

const deleteUser = async userId => {
  const sql1 = `
    delete from users where id = '${userId}';
  `
  const sql2 = `
    delete from user_menu where userId = '${userId}';
  `
  let pList = [exec(sql1), exec(sql2)]
  const data = await pList
  return data
}

module.exports = {
  login,
  register,
  userList,
  deleteUser
}
