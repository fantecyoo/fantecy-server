const router = require("koa-router")()
const { register, userList, deleteUser } = require("../controller/user")
const { ErrorModel, SuccessModel } = require("../model/resModel")

router.prefix("/api/users")

router.get("/", function (ctx, next) {
  ctx.body = "this is a users response!"
})

router.get("/bar", function (ctx, next) {
  ctx.body = "this is a users/bar response"
})

router.post("/new-user", async function (ctx, next) {
  const { username } = ctx.request.body
  const data = await register(username)
  if (data) {
    ctx.body = new SuccessModel(data)
  } else {
    ctx.body = new ErrorModel("登录失败")
  }
})

router.get("/list", async function (ctx, next) {
  const data = await userList()
  console.log(data)
  if (data) {
    ctx.body = new SuccessModel(data)
  } else {
    ctx.body = new ErrorModel("登录失败")
  }
})

router.delete("/:userId", async function (ctx, next) {
  const data = await deleteUser(ctx.params.userId)
  if (data) {
    ctx.body = new SuccessModel(data)
  } else {
    ctx.body = new ErrorModel("登录失败")
  }
})

module.exports = router
