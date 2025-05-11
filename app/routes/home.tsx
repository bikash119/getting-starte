import type { Route } from "./+types/home";
import { useFetcher, Form } from 'react-router';
import Welcome from "../welcome/welcome"
import { Deal, DealWithId } from "api/type/deals";
import { z } from 'zod';
import { getallSalesDeals } from "api/services/SalesDeal";


// Response validation schema


export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader({context,request}: Route.LoaderArgs) {
  try {
    console.log("[Loader] Fetching deals")
    const data = await getallSalesDeals()
    return {salesDeals: data, error: "",status: data.length === 0?500:200}
  } catch (error) {
    const message = `Unexpected error in deals loader: ${error}`
    console.error("[Loader] Error:", message);
    return {salesDeals: [], error: message, status: 500}
  }
}

export async function clientAction({request}:Route.ClientActionArgs) {
  const data = await request.formData()
  console.log(`[Action] Processing form submission : ${data} `)
}

const DealsLoaderDataSchema = z.object({
  salesDeals: z.array(DealWithId),
  error: z.string(),
  status: z.number()
});

type DealsLoaderData = z.infer<typeof DealsLoaderDataSchema>;

export default function Home({loaderData}: Route.ComponentProps) {
  const fetcher = useFetcher()
  const {salesDeals, error, status} = loaderData
  return (
    <>
      <h1>{salesDeals.length}</h1>
        <Welcome loaderData={{salesDeals, error, status}} />
    </>
  );
}
