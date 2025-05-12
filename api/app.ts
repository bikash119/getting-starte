import { createRequestHandler } from "react-router";
import { Hono } from "hono";
import { logger } from 'hono/logger'
import { cors } from 'hono/cors'
import dealsRouter from "./routes/DealRoutes";
import { getallSalesDeals } from "./services/SalesDeal";

const app = new Hono()
app.use(logger())

app.use(async function logger(c, next) {
  await next()
  c.req.matchedRoutes.forEach(({ handler, method, path }, i) => {
    const name =
      handler.name ||
      (handler.length < 2 ? '[handler]' : '[middleware]')
    console.log(
      method,
      ' ',
      path,
      ' '.repeat(Math.max(10 - path.length, 0)),
      name,
      handler.name,
      i === c.req.routeIndex ? '<- respond from here' : ''
    )
  })
})
// API routes

app.route("/api/v1", dealsRouter)

// React Router request handler
const requestHandler = createRequestHandler(
  () => import("virtual:react-router/server-build"),
  import.meta.env.MODE,
);
// Handle React Router requests
app.get("*", async (c) => {
  return requestHandler(c.req.raw, {
    cloudflare: { env: c.env, ctx: c.executionCtx },
  });
});

export default {
    async fetch(request, env, ctx) {
      return requestHandler(request, {
        cloudflare: { env, ctx },
      });
    },
  } satisfies ExportedHandler<Env>;
  
