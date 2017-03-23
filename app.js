const Koa = require('koa');
const app = new Koa();


const exec = require('child_process').exec;



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


app.use(async (ctx, next) => {

    if ( (ctx.request.url.indexOf("index.js.map") > -1) || (ctx.request.url.indexOf("favicon.ico") > -1) ){
        ctx.status = 404;
    }else{
        let host = "baidu.com";
        let time = 4;

        let query = ctx.request.query;

        if (query.host){
            host = query.host;
        }

        if (query.time){
            time = query.time;
        }

        console.log(host,time);
        const pingResult = await execPromise(`ping -c ${time} ${host}`);
        ctx.body = pingResult;
    }


});
// response
// app.use(ctx => {
//     ctx.body = 'Hello Koa';
// });

app.listen(4000);