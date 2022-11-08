const xss = require("xss")
const { exec } = require("../db/mysql")

const getList = async (author, keyword) => {
  let sql = `select * from blogs where 1=1 `
  if (author) {
    sql += `and author='${author}' `
  }
  if (keyword) {
    sql += `and title like '%${keyword}%' `
  }
  sql += `order by createtime desc;`

  return await exec(sql)
}

const getDetail = async id => {
  const sql = `select * from blogs where id='${id}'`
  const rows = await exec(sql)
  return rows[0]
}

const newMenu = async menuName => {
  // blogData 是一个博客对象，包含 title content author 属性
  const name = xss(menuName)

  const sql = `
        insert into menu (name)
        values ('${name}');
    `

  const insertData = await exec(sql)
  return {
    id: insertData.insertId
  }
}

const menuScore = async data => {
  // blogData 是一个博客对象，包含 title content author 属性
  const menuId = xss(data.menu)
  const userId = xss(data.user)
  const score = xss(data.score)
  console.log(data, menuId, userId, score)
  const getScore = `
        select * from user_menu where userId='${userId}' and menuId='${menuId}';
        `
  const scoreList = await exec(getScore)
  if (!scoreList.length) {
    const insert = `insert into user_menu (userId,menuId,score) values (${userId},${menuId},${score});`
    const res = await exec(insert)
    return {
      id: res.insertId
    }
  } else {
    const update = `update user_menu set score=${score} where userId=${userId} and menuId=${menuId}`
    console.log(update)
    const res = await exec(update)
    if (res.affectedRows > 0) {
      return true
    } else {
      return false
    }
  }
}

const menuList = async () => {
  const getList = `
      select * from menu
  `
  const menuList = await exec(getList)

  console.log(menuList)

  const getUserList = `
      select * from users
  `
  const userList = await exec(getUserList)

  for (var i = 0; i < menuList.length; i++) {
    let menu = menuList[i]
    const getScore = `
      select * from user_menu where menuId=${menu.id}
    `
    const scoreList = await exec(getScore)
    console.log(scoreList)
    menu.favorUsers = scoreList.map(v => {
      return {
        userId: v.userId,
        score: v.score,
        username: userList.find(item => item.id === v.userId).name
      }
    })
  }
  return menuList
}

const userScore = async userId => {
  const getList = `
      select * from menu
  `
  const menuList = await exec(getList)

  const getUserScore = `
      select * from user_menu where userId=${userId}
  `
  const userScoreList = await exec(getUserScore)

  menuList.forEach(item => {
    let temp = userScoreList.find(v => v.menuId == item.id)
    item.score = temp ? temp.score : 0
  })
  return menuList
}

const updateBlog = async (id, blogData = {}) => {
  // id 就是要更新博客的 id
  // blogData 是一个博客对象，包含 title content 属性

  const title = xss(blogData.title)
  const content = xss(blogData.content)

  const sql = `
        update blogs set title='${title}', content='${content}' where id=${id}
    `

  const updateData = await exec(sql)
  if (updateData.affectedRows > 0) {
    return true
  }
  return false
}

const delBlog = async (id, author) => {
  // id 就是要删除博客的 id
  const sql = `delete from blogs where id='${id}' and author='${author}';`
  const delData = await exec(sql)
  if (delData.affectedRows > 0) {
    return true
  }
  return false
}

module.exports = {
  getList,
  getDetail,
  updateBlog,
  delBlog,
  newMenu,
  menuScore,
  menuList,
  userScore
}
