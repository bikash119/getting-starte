import type { DealSchema, DealWithIdSchema } from "api/type/deals";
import { DealWithId } from "api/type/deals";
import supabase from "./supabase";
import { z } from 'zod';

const ApiResponseSchema = z.object({
    deals: z.array(DealWithId),
    message: z.string().optional()
});

export async function getallSalesDeals(): Promise<DealWithIdSchema[]> {
    const { data, error } = await supabase
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

export async function addNewDeal(deal: DealSchema) : Promise<DealWithIdSchema|undefined>{
    const {data, error} = await supabase
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

export async function updateDeal(deal:DealSchema,existingDeal:DealWithIdSchema) : Promise<DealWithIdSchema|undefined> {
    const {data, error} = await supabase
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

export async function findDealByName(name:string): Promise<DealWithIdSchema|undefined>{
    const { data, error } = await supabase
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

export async function addOrUpdate(deal:DealSchema): Promise<DealWithIdSchema|undefined>{
    const existingDeal = await findDealByName(deal.name)
    if(existingDeal){
        console.log(`[SalesDeal DB Service] : Sales Rep exist in system. Updating the deal value for sales rep : ${deal.name}`)
        return updateDeal(deal,existingDeal)
    }
    console.log("[SalesDeal DB Service] : Sales Rep exist not found in system. Adding a new record...")
    return addNewDeal(deal)
}