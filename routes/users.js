const router = require("koa-router")()
const { register } = require("../controller/user")
const { ErrorModel, SuccessModel } = require("../model/resModel")

router.prefix("/users")

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
    ctx.body = new SuccessModel()
    return
  }
  ctx.body = new ErrorModel("登录失败")
})

module.exports = router
