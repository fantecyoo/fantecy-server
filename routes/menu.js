const router = require("koa-router")()
const {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog
} = require("../controller/blog")

const {
  newMenu,
  menuScore,
  menuList,
  userScore
} = require("../controller/menu")

const { SuccessModel, ErrorModel } = require("../model/resModel")
const loginCheck = require("../middleware/loginCheck")

router.prefix("/menu")

router.get("/list1", async function (ctx, next) {
  let author = ctx.query.author || ""
  const keyword = ctx.query.keyword || ""

  if (ctx.query.isadmin) {
    console.log("is admin")
    // 管理员界面
    if (ctx.session.username == null) {
      console.error("is admin, but no login")
      // 未登录
      ctx.body = new ErrorModel("未登录")
      return
    }
    // 强制查询自己的博客
    author = ctx.session.username
  }

  const listData = await getList(author, keyword)
  ctx.body = new SuccessModel(listData)
})

router.get("/detail", async function (ctx, next) {
  const data = await getDetail(ctx.query.id)
  ctx.body = new SuccessModel(data)
})

router.post("/new", loginCheck, async function (ctx, next) {
  const body = ctx.request.body
  body.author = ctx.session.username
  const data = await newBlog(body)
  ctx.body = new SuccessModel(data)
})

router.post("/update", loginCheck, async function (ctx, next) {
  const val = await updateBlog(ctx.query.id, ctx.request.body)
  if (val) {
    ctx.body = new SuccessModel()
  } else {
    ctx.body = new ErrorModel("更新博客失败")
  }
})

router.post("/del", loginCheck, async function (ctx, next) {
  const author = ctx.session.username
  const val = await delBlog(ctx.query.id, author)
  if (val) {
    ctx.body = new SuccessModel()
  } else {
    ctx.body = new ErrorModel("删除博客失败")
  }
})

router.post("/new-menu", async function (ctx, next) {
  const { name } = ctx.request.body
  const val = await newMenu(name)
  if (val) {
    ctx.body = new SuccessModel(val)
  } else {
    ctx.body = new ErrorModel("创建菜单失败")
  }
})

router.post("/score", async function (ctx, next) {
  const data = ctx.request.body
  console.log(data)
  const val = await menuScore(data)
  if (val) {
    ctx.body = new SuccessModel()
  } else {
    ctx.body = new ErrorModel("打分失败")
  }
})

router.get("/list", async function (ctx, next) {
  const list = await menuList()
  if (list) {
    ctx.body = new SuccessModel(list)
  } else {
    ctx.body = new ErrorModel("获取菜单失败")
  }
})

router.get("/score/:userId", async function (ctx, next) {
  const { userId } = ctx.params
  const list = await userScore(userId)
  if (list) {
    ctx.body = new SuccessModel(list)
  } else {
    ctx.body = new ErrorModel("获取菜单失败")
  }
})

module.exports = router
