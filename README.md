## Example:
```node
require('marko/node-require');
 
const Koa = require('koa');
const app = new Koa();
const errHandler = require('koa-errorhandler');
 
app
  // it would be nice to have this at the very start of the stack 
  // to be able to catch all errors
  .use(errHandler({
      slack:  (app.env == 'production') ? config.slack : false,
      template: config.templateDir +  "/error.marko",
  }))
  
  // more code goes here

 
app
  .listen(8080)
  .on('error',(err, ctx) => {
    // console.log(err, ctx);
    console.log(err);
  });
```