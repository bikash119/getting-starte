import { createRequestHandler } from "react-router";

import { Hono } from "hono";
import dealRouter from "./routes/DealRoutes"
const app = new Hono()

declare module "react-router" {
  export interface AppLoadContext {
    cloudflare: {
      env: Env;
      ctx: ExecutionContext;
    };
  }
}
// Add X-Response-Time header
app.use('*', async (c, next) => {
    const start = Date.now()
    await next()
    const ms = Date.now() - start
    c.header('X-Response-Time', `${ms}ms`)
  })
  
// Custom Not Found Message
app.notFound((c) => {
return c.text('Custom 404 Not Found', 404)
})
  
// Error handling
app.onError((err, c) => {
console.error(`${err}`)
return c.text('Custom Error Message', 500)
})
app.use("*", async (c, next) => {
    await next();
});
const requestHandler = createRequestHandler(
  () => import("virtual:react-router/server-build"),
  import.meta.env.MODE
);
app.route("/salesDeal", dealRouter)

//handle React Router request
app.get("*", async(c) => {
    return requestHandler(c.req.raw, {
        cloudflare: { env: c.env as Env, ctx: c.executionCtx as ExecutionContext },
      });
});
app.post("*", async(c) => {
    return requestHandler(c.req.raw, {
        cloudflare: { env: c.env as Env, ctx: c.executionCtx as ExecutionContext },
      });
});

// Catch-all route for static assets
app.all("/assets/*", async (c) => {
    return c.env.ASSETS.fetch(c.req.raw);
  });
  
export default {
fetch: app.fetch,
};
  