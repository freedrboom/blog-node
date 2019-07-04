require("systemd")

var net = require('net');

var Server = net.Server;
Server.prototype.autoQuit = function (options) {
    var self = this;

    options = options || {};
    options.timeOut = options.timeOut || 600;
    self._autoQuit = {
        options: options,
        connections: 0,
        lastActive: null,
        timeOutHandler: null
    };

    var aquit = self._autoQuit;

    var shutdown = function () {
        try {
            self.close();
        } catch (e) {
            // Ignore, nothing we can do about it (fails on some older Node.js versions).
        }
        if (aquit.options.exitFn) {
            aquit.options.exitFn();
        } else {
            process.exit(0);
        }
    };

    var shutdownIfNeeded = function () {
        aquit.timeOutHandler = null;
        if (aquit.connections > 0) {
            // Still have connections!
            return;
        }

        var closeAt = aquit.lastActive + aquit.options.timeOut * 1000;
        if (closeAt > new Date().getTime()) {
            // Reschedule when we actually need to shut down.
            aquit.timeOutHandler = setTimeout(shutdownIfNeeded, closeAt - new Date().getTime());
            return;
        }

        shutdown();
    };

    var isInactive = function () {
        // We don't have any connections anymore, schedule a shutdown.
        aquit.lastActive = new Date().getTime();
        if (aquit.timeOutHandler == null) {
            var interval = aquit.options.timeOut * 1000;
            aquit.timeOutHandler = setTimeout(shutdownIfNeeded, interval);
        }
    };

    var countConnection = function (request) {
        aquit.connections += 1;
        request.on('end', countDisconnect);
    };

    var countDisconnect = function () {
        aquit.connections -= 1;
        if (aquit.connections === 0) {
            isInactive();
        }
    };

    self.on('request', countConnection);

    isInactive();
};


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
  Server.prototype.autoQuit.call(app,{timeOut: 60})
  app.listen('systemd')
})
.catch(e => process.exit())
