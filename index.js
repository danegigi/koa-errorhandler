'use strict';

const Slack = require('node-slack');
const path = require('path');

const handleErrors = (opts) => {

  const slackWebHook = opts.slack || false;
  const env = process.env.NODE_ENV || 'development';
  const template = opts.template || __dirname + '/error.marko';

  return async (ctx, next) => {
    try{
      await next();
      if(404 == ctx.response.status && !ctx.response.body) ctx.throw(404);
    }catch(err){
      ctx.status = err.status || 500;
      
      ctx.app.emit('error', err, ctx);

      if(slackWebHook !== false){
        let slacker = new Slack(slackWebHook);

        let slackMsg = "*" + ctx.status + " Error* \r\n";
        slackMsg += "URL: `" + path.join(ctx.origin, ctx.path) +"` \r\n";
        slackMsg += "```" + err.stack +"```";
        // send error to slack
        slacker.send({
          text: slackMsg 
        });
      }

      // render error
      switch (ctx.accepts('html', 'text', 'json')) {
        case 'text':
          ctx.type = 'text/plain';
          if ('development' == env) ctx.body = err.message
          else if (err.expose) ctx.body = err.message
          else throw err;
          break;

        case 'json':
          ctx.type = 'application/json';
          if ('development' == env) ctx.body = { error: err.message }
          else if (err.expose) ctx.body = { error: err.message }
          else ctx.body = { error: http.STATUS_CODES[ctx.status] }
          break;

        // using marko template
        case 'html':
          let tmplt = require(template);

          ctx.type = 'text/html';

          ctx.body = await tmplt.stream({
            env: env,
            ctx: ctx,
            request: ctx.request,
            response: ctx.response,
            error: err.message,
            stack: err.stack,
            status: ctx.status,
            code: err.code
          });
          break;
      }
    }
  }
}
  

module.exports = handleErrors;