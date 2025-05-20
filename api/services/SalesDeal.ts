import type { DealSchema, DealWithIdSchema } from "api/type/deals";
import { DealWithId } from "api/type/deals";
import { z } from 'zod';
import getSupbaseClient  from "./supabase";


const ApiResponseSchema = z.object({
    deals: z.array(DealWithId),
    message: z.string().optional()
});

export async function getallSalesDeals(env:Env): Promise<DealWithIdSchema[]> {
    const { data, error } = await getSupbaseClient(env)
        .from('sales_deals')
        .select(
            `
            id,
            name,
            value
            `,
        )
    if(error){
        throw new Error(error.message, { cause: error })
    }
    return data
    
}

export async function addNewDeal(env:Env,deal: DealSchema) : Promise<DealWithIdSchema|undefined>{
    const {data, error} = await getSupbaseClient(env)
      .from('sales_deals')
      .insert({ 
        name: deal.name, 
        value: deal.value 
      })
      .select()
    if(error){
        throw new Error(error.message,{cause:error})
    }
    if(data.length > 0){
        return data[0]
    }else{
        return undefined
    }
}

export async function updateDeal(env:Env, deal:DealSchema,existingDeal:DealWithIdSchema) : Promise<DealWithIdSchema|undefined> {
    const {data, error} = await getSupbaseClient(env)
      .from('sales_deals')
      .update({ 
        value: deal.value + existingDeal.value
        })
      .eq('id', existingDeal.id)
      .select()
      if(error){
        throw new Error(error.message,{cause:error})
    }
    if(data.length > 0){
        return data[0]
    }else{
        return undefined
    } 
}

export async function findDealByName(env:Env, name:string): Promise<DealWithIdSchema|undefined>{
    const { data, error } = await getSupbaseClient(env)
        .from('sales_deals')
        .select(
            `
            id,
            name,
            value
            `,
    )
        .eq('name', name)
    if(error){
        throw new Error(error.message,{cause:error})
    }
    if(data.length > 0){
        return data[0]
    }else{
        return undefined
    }
}

export async function addOrUpdate(env:Env, deal:DealSchema): Promise<DealWithIdSchema|undefined>{
    const existingDeal = await findDealByName(env,deal.name)
    if(existingDeal){
        console.log(`[SalesDeal DB Service] : Sales Rep exist in system. Updating the deal value for sales rep : ${deal.name}`)
        return updateDeal(env,deal,existingDeal)
    }
    console.log("[SalesDeal DB Service] : Sales Rep exist not found in system. Adding a new record...")
    return addNewDeal(env,deal)
}