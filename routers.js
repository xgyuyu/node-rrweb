const Router = require('koa-router')
const fs = require('fs');
const router = new Router({
  // prefix: '/api'
})

const handleError = ({ ctx, message = '请求失败', err = null }) => {
  ctx.body = { code: 0, message, debug: err }
}
const handleSuccess = ({ ctx, message = '请求成功', result = null }) => {
  ctx.response.body = { code: 1, message, result }
}

router
  .get('/getRRwebJs', async (ctx) => {
    const js = fs.readFileSync("./testRRweb.js", "binary");
    ctx.response.body = js
  })
  .get('/getRRwebHtml', async (ctx) => {
    const html = fs.readFileSync("./rrwebPlayer.html", "binary");
    ctx.response.body = html
  })
  // 得到data接口，链接
  .get('/getData', async(ctx, next) => {
    if (!ctx.query.name) {
      return handleError({
        ctx,
        message: '失败'
      })
    }
    let data = await fs.readFileSync('index.json');
    const events = JSON.parse(data).find(v => v.name === ctx.query.name)
    handleSuccess({
      ctx,
      result: events,
      message: '获取成功'
    })
  })
  // 得到data
  .post('/getData', async(ctx, next) => {
    let data = await fs.readFileSync('index.json');
    const { name, startTime } = ctx.request.body
    let events = JSON.parse(data).find(v => v.name === name)
    events = events.data.find(v => v.startTime === startTime)
    handleSuccess({
      ctx,
      result: events,
      message: '获取成功'
    })
  })
  // setData
  .post('/setData', (ctx) => {
    let data = fs.readFileSync('index.json');

    data = JSON.parse(data)
    const index = data.findIndex(v => v.name === ctx.request.body.name)
    if (index == -1) {
      data.push({
        name: ctx.request.body.name,
        data: [
          {
            startTime: ctx.request.body.startTime,
            endTime: ctx.request.body.endTime,
            events: ctx.request.body.events,
          }
        ]
      })
    } else {
      const data2 = data.find(v => v.name === ctx.request.body.name)
      const index2 = data2.data.findIndex(v => v.startTime === ctx.request.body.startTime);

      if (index2 == -1) {
        data2.data.push({
          startTime: ctx.request.body.startTime,
          endTime: ctx.request.body.endTime,
          events: ctx.request.body.events,
        })
      } else {
        data2.data[index2] = {
          startTime: ctx.request.body.startTime,
          endTime: ctx.request.body.endTime,
          events: ctx.request.body.events,
        }
      }
      // console.log("data2========", data2)
      // console.log("data[index]========", data[index])
    }
    
    console.log("data========", data)
    fs.writeFileSync('index.json', JSON.stringify(data), function(err, data) {
      if (err) {throw err}
    });
    handleSuccess({
      ctx,
      result: 1,
      message: '保存成功'
    })

})

module.exports = router
