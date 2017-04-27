## Example:
```node
require('marko/node-require');
 
const Koa = require('koa');
const app = new Koa();
const errHandler = require('koa-errorhandler');
 
app
  .use(errHandler({
      slack:  (app.env == 'production') ? config.slack : false,
      template: config.templateDir +  "/error.marko",
  }))
 
app.listen(8080);
```