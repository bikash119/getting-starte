import { Hono } from "hono"
// import supabase from "~/supabase"
import { logger } from 'hono/logger'
import { addOrUpdate, getallSalesDeals } from "api/services/SalesDeal"
import { Deal } from "api/type/deals"

const app = new Hono()
app.use(logger())

app.get("/", async (c) => c.json(await getallSalesDeals(c.env as Env)))

app.post("/", async (c) => {
    console.log(`[DealRouter] Post invocation`)
    const formData = await c.req.json()
    const deal = Deal.parse(formData)
    const dbDeal = await addOrUpdate(c.env as Env,deal)
    return c.json({deal: dbDeal})
})

export default app
