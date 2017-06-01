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
  const pingResult = await execPromise(`ping -w 6 -c ${time} ${host}`);

  return pingResult;
};

function parsePingResult(output,ok){
  let reg1 = /PING ([\w\.]+) \(([\d\.]+)\)/g;
  let reg2 = /(\d+) packets transmitted, (\d+) received, ([\d\.\%]+) packet loss, time ([\d]+ms)/g;
  let reg3 = /rtt min\/avg\/max\/mdev = ([\d\.]+)\/([\d\.]+)\/([\d\.]+)\/([\d\.]+) ms/g

  let r1 = reg1.exec(output);
  let r2 = reg2.exec(output);

//  console.log(output);
  let result = {
  	'alive':ok,
    'host':r1[1],
    'ip':r1[2],
    'packets_transmitted': r2[1],
    'packets_received': r2[2],
    'packet_loss': r2[3],
    'time': r2[4],
    'output':output
  };

  if(ok){
  	  let r3 = reg3.exec(output);
  	  result['min'] = `${r3[1]}ms`
  	  result['avg'] = `${r3[2]}ms`
  	  result['max'] = `${r3[3]}ms`
  	  result['mdev'] = `${r3[4]}ms`
  }

  return result;
}

router.get('/', async(ctx,next)=>{
  if ( (ctx.request.url.indexOf("index.js.map") > -1) || (ctx.request.url.indexOf("favicon.ico") > -1) ){
    ctx.status = 404;
  }else{
    const [pingResult,ok] = await ping(ctx.request.query);
    ctx.body = pingResult;
  }
});


router.get('/ping', async(ctx,next)=>{

  let query = ctx.request.query;

  const [pingResult,ok] = await ping(query);

  ctx.body = parsePingResult(pingResult,ok);
});


function execPromise(cmd) {
    return new Promise((y,n)=>{
        exec(cmd, (error, stdout, stderr) => {
            let ok = true;
            if (error) {
            	ok = false;
            }

            y([stdout,ok]);

        });
    });
}

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = err.message;
    ctx.app.emit('error', err, ctx);
  }
});


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
