### 说明
这个项目是大概一年半前为了玩下graphql而写的node, 技术栈基于koa,graphql,mongoose, jwt；不过也写了restful形式的api后面考虑服务器磁盘小　便想把它打包之后直接将打包之后的js（压缩混淆之后1.94M左右）丢服务器来部署；尝试了几波pm2来管理node服务，最终arch上貌似用这个有些问题, 后面用systemctl来管理好了，找到了阮一峰老师写的博客　复制下来改改　能用哈哈

通过socket 来起服务可以，配合systemctl 来按需启动服务，通过nginx来配一层负载均衡器
```
 upstream test{ 
    server 0.0.0.0:6666 weight=1; 
    server 0.0.0.0:5555 weight=2;
    server 0.0.0.0:8888 backup;
}
```

\# node-secket-server.service
```
[Unit]
Description=node server

[Service]
ExecStart=/usr/bin/node /opt/node/test/socketApp.js
Restart=always
User=weigu
Group=weigu
Environment=PATH=/usr/bin:/usr/local/bin
Environment=NODE_ENV=production
WorkingDirectory=/opt/node/test
```


\# node-secket-server.socket
```
[Socket]
ListenStream=3000

[Install]
WantedBy=sockets.target
```

![一个截图如下](./screenshot.png)