import { PostgrestError } from "@supabase/supabase-js"
import { Hono } from "hono"
import supabase from "~/supabase"
import { Deal, DealsResponse, DealWithId } from "api/type/deals"
import { z } from 'zod'

const dealsRouter = new Hono()

// Request validation schemas
const UpdateDealSchema = z.object({
  newDeal: Deal,
  existingDeal: DealWithId
})

dealsRouter.get("/", async (c) => {
  try {
    console.log("[GET] Fetching all deals")
    const {data, error} = await supabase.from("sales_deals").select('name,value,id')
    
    if (error) {
      console.error("[GET] Database error:", error)
      return c.json({deals: [], message: error.message}, 500)
    }

    const validatedData = z.array(DealWithId).parse(data)
    console.log(`[GET] Successfully fetched ${validatedData.length} deals`)
    return c.json({deals: validatedData, message: undefined})
  } catch (error) {
    console.error("[GET] Validation error:", error)
    return c.json({deals: [], message: "Failed to validate response data"}, 500)
  }
})

dealsRouter.post("/", async (c) => {
  try {
    console.log("[POST] Creating new deal")
    const rawDeal = await c.req.json()
    const deal = Deal.parse(rawDeal)
    
    const {data, error} = await supabase
      .from('sales_deals')
      .insert({ 
        name: deal.name, 
        value: deal.value 
      })
      .select()
    
    if (error) {
      console.error("[POST] Database error:", error)
      return c.json({deals: [], message: error.message}, 500)
    }

    const validatedData = z.array(DealWithId).parse(data)
    console.log(`[POST] Successfully created deal: ${deal.name}`)
    return c.json({deals: validatedData, message: "Created!"}, 201)
  } catch (error) {
    console.error("[POST] Validation error:", error)
    return c.json({deals: [], message: "Invalid request data"}, 400)
  }
})

dealsRouter.patch("/", async (c) => {
  try {
    console.log("[PATCH] Updating deal")
    const rawData = await c.req.json()
    const {newDeal, existingDeal} = UpdateDealSchema.parse(rawData)
    
    const {data, error} = await supabase
      .from('sales_deals')
      .update({ 
        value: newDeal.value + existingDeal.value
      })
      .eq('id', existingDeal.id)
      .select()
    
    if (error) {
      console.error("[PATCH] Database error:", error)
      return c.json({deals: [], message: error.message}, 500)
    }

    const validatedData = z.array(DealWithId).parse(data)
    console.log(`[PATCH] Successfully updated deal: ${existingDeal.name}`)
    return c.json({deals: validatedData, message: "Updated!"}, 200)
  } catch (error) {
    console.error("[PATCH] Validation error:", error)
    return c.json({deals: [], message: "Invalid request data"}, 400)
  }
})

export default dealsRouter