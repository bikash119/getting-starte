import type { Route } from "./+types/home";
import Welcome from "../welcome/welcome"
import { z } from 'zod';
import { getallSalesDeals } from "api/services/SalesDeal";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}
export async function clientAction({request}: Route.ClientActionArgs){
  console.log(`[Client Action function]`)
  const formData = await request.formData()
  try{
    const requestBody = z.object({
      name: z.string(),
      value: z.string().transform((val) => Number(val)),
      // Add more fields as needed
    })
    
    const data = requestBody.parse({
      name: formData.get('name'),
      value: formData.get('value'),
    })
    
    console.log('Parsed form data:', data)

    const createOrUpdateDeal = await fetch("/api/v1/salesDeal", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    })
    
    if(createOrUpdateDeal.ok){
      const deal = await createOrUpdateDeal.json()
      return {deal, status: "ok", statusCode: createOrUpdateDeal.status}
    }
  }catch(error){
    console.log(`Error occurred for client action : ${error}`)
    return {undefined, status: "error", statusCode: 500}
  }
}

export async function loader({context,request}: Route.LoaderArgs) {
  try {
    console.log(`[Loader] Fetching deals`)
    const cloudflare = context.cloudflare as { env: Env };
    const data = await getallSalesDeals(cloudflare.env)
    return {salesDeals: data, error: "",status: data.length === 0?500:200}
  } catch (error) {
    const message = `Unexpected error in deals loader: ${error}`
    console.error("[Loader] Error:", message);
    return {salesDeals: [], error: message, status: 500}
  }
}

export default function Home({loaderData}: Route.ComponentProps) {
  const {salesDeals, error, status} = loaderData
  return (
      <Welcome loaderData={{salesDeals, error, status}} />
  );
}
