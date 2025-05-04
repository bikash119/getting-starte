import type { Route } from "./+types/home";
import  Welcome  from "../welcome/welcome"
import { sales_deals as initialSales} from "../../data/sales_deals.json" 
import supabase from "~/supabase";
import { data as reactData, useFetcher, useLoaderData,Form, useActionData ,createCookie} from "react-router";

type Deal = {
  name: string
  value: number
} 

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}


export async function loader({request}: Route.LoaderArgs) {
  const { data, error } = await supabase
        .from('sales_deals')
        .select(
          `
          name,
          value
          `,
        )
  return reactData({ salesDeals : data,error: error}, {status: 200})
}
const addOrUpdate = async (newDeal: Deal) => {
  try {
    const { data: selectData, error: selectError } = await supabase
      .from('sales_deals')
      .select('name, value, id');
      
    if (selectError) throw selectError;
    
    const existingDeal = selectData.find((deal: Deal) => deal.name === newDeal.name);
    
    if (existingDeal) {
      return await update(newDeal, existingDeal);
    } else {
      return await insert(newDeal);
    }
  } catch (error) {
    console.error('Error in addOrUpdate:', error);
    throw error;
  }
}; 
async function update(deal: Deal, existingDeal: { name: any; value: any; id: any; }) {
  const { data, error } = await supabase
    .from('sales_deals')
    .update({ 
      value: deal.value + existingDeal.value
    })
    .eq('id', existingDeal.id)
    .select();
    
  return { data, error };
}
async function insert(deal: Deal) {
  const { data, error } = await supabase
    .from('sales_deals')
    .insert({ 
      name: deal.name, 
      value: deal.value 
    })
    .select();
    
  return { data, error };
}
export async function action({request}: Route.ActionArgs){
  
  const formData = await request.formData();
  const salesRepName = String(formData.get("name")?? "")
  const saleValue = Number(formData.get("value") ?? 0)
  const newDeal = { name: salesRepName, value: saleValue}
  const {data,error} = await addOrUpdate(newDeal)
  
  return reactData({ salesDeals : data,error: error}, {status: 200})
}


export default function Home({loaderData}: Route.ComponentProps) {

  return (<Welcome loaderData={ loaderData }/>
  );
}
