import '@babel/polyfill'
import koa from "koa"
import process from "process"
import connectMongoose from "./mongoose/connect_mongodb"
import router from "./restful/route" // restful router
import bodyParser from "koa-bodyparser"
import { timed, graphqlMounted, cors, params } from "./middleware"

const listen = (ctx) => {
  let str = '';
  return new Promise((resolve,reject) => {
    ctx.req.addListener('data',data => {
      debugger
    str += data
  });
    ctx.req.addListener('end',() => {
      console.log(str)
      debugger
      resolve(jsonBodyparser(str))
    });
  });
}

const jsonBodyparser = (str) => str.split("&").reduce((pre, param) => {
  let [key, value] = split("=");
  return {...pre, [key]: value}
},{})

const paraser =  async (ctx, next) => {
  let bodyParser = await listen(ctx);
  ctx.request.body = bodyParser;
  await next();
}

export default connectMongoose
.then(e => {
  const app = new koa()
  app
  .use(timed)
  .use(cors)
  .use(bodyParser())
  // .use(params)
  // .use(paraser)
  .use(graphqlMounted)
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(3000, () => {
    console.log("the server started at: localhost:3000")
  })
})
.catch(e => process.exit())
