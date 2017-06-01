const Koa = require('koa');
const app = new Koa();
const cors = require('kcors');
const router = require('koa-router')();


const exec = require('child_process').exec;

let ping = async (query)=> {
  let host = "127.0.0.1";
  let time = 4;


  if (query.host){
    host = query.host;
  }

  if (query.time){
    time = query.time;
  }

  console.log(host,time);
  const pingResult = await execPromise(`ping -i 2 -c ${time} ${host}`);

  return pingResult;
};

function parsePingResult(output){
  let reg1 = /PING ([\w\.]+) \(([\d\.]+)\): [\d]+ data bytes/g;
  let reg2 = /(\d+) packets transmitted, (\d+) packets received, ([\d\.\%]+) packet loss/g;
  let reg3 = /round-trip min\/avg\/max\/stddev = ([\d\.]+)\/([\d\.]+)\/([\d\.]+)\/3.124 ms/g

  let r1 = reg1.exec(output);
  let r2 = reg2.exec(output);

//  console.log(output);

  return {
    'host':r1[1],
    'ip':r1[2],
    'packets_transmitted': r2[1],
    'packets_received': r2[2],
    'packet_loss': r2[3],
    'output':output
  }
}

router.get('/', async(ctx,next)=>{
  if ( (ctx.request.url.indexOf("index.js.map") > -1) || (ctx.request.url.indexOf("favicon.ico") > -1) ){
    ctx.status = 404;
  }else{
    const pingResult = await ping(ctx.request.query);
    ctx.body = pingResult;
  }
});


router.get('/ping', async(ctx,next)=>{

  let query = ctx.request.query;

  const pingResult = await ping(query);

  ctx.body = parsePingResult(pingResult);
});


function execPromise(cmd) {
    return new Promise((y,n)=>{
        exec(cmd, (error, stdout, stderr) => {
            if (error) {
                n(stderr);
                return;
            }

            y(stdout);

        });
    });
}



app.use(cors());

// app.use(async (ctx, next) => {
//
//
// });

app
  .use(router.routes())
  .use(router.allowedMethods());
// response
// app.use(ctx => {
//     ctx.body = 'Hello Koa';
// });

app.listen(4000);