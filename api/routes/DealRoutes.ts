import { Hono } from "hono"
// import supabase from "~/supabase"
import { logger } from 'hono/logger'
import { addOrUpdate, getallSalesDeals } from "api/services/SalesDeal"
import { Deal } from "api/type/deals"

const app = new Hono()
app.use(logger())

app.get("/salesDeal", async (c) => c.json(await getallSalesDeals()))

app.post("/salesDeal", async (c) => {
    console.log("[DealRouter] Post invocation ")
    const formData = await c.req.json()
    const deal = Deal.parse(formData)
    const dbDeal = await addOrUpdate(deal)
    return c.json({deal: dbDeal})
})

export default app











// const app = new Hono()
// app.use(logger())

// if(supabase){
//     console.log(`Supabase client created ${supabase}`)
// }else {
//     console.error("Supabase client failed initialization")
// }
// Request validation schemas
// const UpdateDealSchema = z.object({
//   newDeal: Deal,
//   existingDeal: DealWithId
// })

// app.get("/", async (c) => {
//   try {
//     console.log("[GET] Fetching all deals")
    // const {data, error} = await supabase.from("sales_deals").select('name,value,id')
    
    // if (error) {
    //   console.error("[GET] Database error:", error)
    //   return c.json({deals: [], message: error.message}, 500)
    // }

    // const validatedData = z.array(DealWithId).parse(data)
    // console.log(`[GET] Successfully fetched ${validatedData.length} deals`)
    // return c.json({deals: validatedData, message: undefined})
//   } catch (error) {
//     console.error("[GET] Validation error:", error)
//     return c.json({deals: [], message: "Failed to validate response data"}, 500)
//   }
// })

// app.post("/", async (c) => {
//   try {
//     console.log("[POST] Creating new deal")
//     const rawDeal = await c.req.json()
//     const deal = Deal.parse(rawDeal)
    
//     const {data, error} = await supabase
//       .from('sales_deals')
//       .insert({ 
//         name: deal.name, 
//         value: deal.value 
//       })
//       .select()
    
//     if (error) {
//       console.error("[POST] Database error:", error)
//       return c.json({deals: [], message: error.message}, 500)
//     }

//     const validatedData = z.array(DealWithId).parse(data)
//     console.log(`[POST] Successfully created deal: ${deal.name}`)
//     return c.json({deals: validatedData, message: "Created!"}, 201)
//   } catch (error) {
//     console.error("[POST] Validation error:", error)
//     return c.json({deals: [], message: "Invalid request data"}, 400)
//   }
// })

// app.patch("/", async (c) => {
//   try {
//     console.log("[PATCH] Updating deal")
//     const rawData = await c.req.json()
//     const {newDeal, existingDeal} = UpdateDealSchema.parse(rawData)
    
//     const {data, error} = await supabase
//       .from('sales_deals')
//       .update({ 
//         value: newDeal.value + existingDeal.value
//       })
//       .eq('id', existingDeal.id)
//       .select()
    
//     if (error) {
//       console.error("[PATCH] Database error:", error)
//       return c.json({deals: [], message: error.message}, 500)
//     }

//     const validatedData = z.array(DealWithId).parse(data)
//     console.log(`[PATCH] Successfully updated deal: ${existingDeal.name}`)
//     return c.json({deals: validatedData, message: "Updated!"}, 200)
//   } catch (error) {
//     console.error("[PATCH] Validation error:", error)
//     return c.json({deals: [], message: "Invalid request data"}, 400)
//   }
// })
