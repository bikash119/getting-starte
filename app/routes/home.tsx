import type { Route } from "./+types/home";
import Welcome from "../welcome/welcome"
import { Deal, DealWithId } from "api/type/deals";
import { z } from 'zod';

// Response validation schema
const ApiResponseSchema = z.object({
  deals: z.array(DealWithId),
  message: z.string().optional()
});

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader({request}: Route.LoaderArgs) {
  try {
    console.log("[Loader] Fetching deals")
    const url = new URL(request.url)
    const response = await fetch(`${url.origin}/salesDeal`)
    
    if (!response.ok) {
      const message = `Deals API returned status: ${response.status}`
      console.warn("[Loader] API error:", message);
      return {salesDeals: [], error: message, status: response.status}
    }
    const rawData = await response.json()
    const validatedData = ApiResponseSchema.parse(rawData)
    console.log(`[Loader] Successfully fetched ${validatedData.deals.length} deals`)
    return {
      salesDeals: validatedData.deals,
      error: validatedData.message,
      status: response.status
    };
  } catch (error) {
    const message = `Unexpected error in deals loader: ${error}`
    console.error("[Loader] Error:", message);
    return {salesDeals: [], error: message, status: 500}
  }
}

const addOrUpdate = async (newDeal: z.infer<typeof Deal>, request: Request) => {
  try {
    console.log("[addOrUpdate] Checking for existing deal:", newDeal.name)
    const url = new URL(request.url)
    const response = await fetch(`${url.origin}/salesDeal`)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch deals: ${response.status}`)
    }

    const rawData = await response.json()
    const validatedData = ApiResponseSchema.parse(rawData)
    const existingDeal = validatedData.deals.find(deal => deal.name === newDeal.name);
    
    if (existingDeal) {
      console.log("[addOrUpdate] Found existing deal, updating")
      return await update(newDeal, existingDeal, request);
    } else {
      console.log("[addOrUpdate] No existing deal found, inserting")
      return await insert(newDeal, request);
    }
  } catch (error) {
    console.error('[addOrUpdate] Error:', error);
    return { salesDeals: [], error: "Failed to add or update deal" };
  }
};

async function update(deal: z.infer<typeof Deal>, 
                     existingDeal: z.infer<typeof DealWithId>, 
                     request: Request) {
  try {
    console.log("[Update] Updating deal:", existingDeal.name)
    const url = new URL(request.url)
    const body = { newDeal: deal, existingDeal: existingDeal }
    const response = await fetch(`${url.origin}/salesDeal`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    })

    if (!response.ok) {
      throw new Error(`Update failed: ${response.status}`)
    }

    const rawData = await response.json()
    const validatedData = ApiResponseSchema.parse(rawData)
    console.log("[Update] Successfully updated deal")
    return { salesDeals: validatedData.deals, error: validatedData.message }
  } catch (error) {
    console.error("[Update] Error:", error)
    return { salesDeals: [], error: "Update failed" }
  }
}

async function insert(deal: z.infer<typeof Deal>, request: Request) {
  try {
    console.log("[Insert] Creating new deal:", deal.name)
    const url = new URL(request.url)
    const response = await fetch(`${url.origin}/salesDeal`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(deal)
    })

    if (!response.ok) {
      throw new Error(`Insert failed: ${response.status}`)
    }

    const rawData = await response.json()
    const validatedData = ApiResponseSchema.parse(rawData)
    console.log("[Insert] Successfully created deal")
    return { salesDeals: validatedData.deals, error: validatedData.message }
  } catch (error) {
    console.error("[Insert] Error:", error)
    return { salesDeals: [], error: "Insert failed" }
  }
}

export async function action({request}: Route.ActionArgs) {
  try {
    console.log("[Action] Processing form submission")
    const formData = await request.formData();
    const salesRepName = String(formData.get("name") ?? "")
    const saleValue = Number(formData.get("value") ?? 0)
    
    const newDeal = Deal.parse({ name: salesRepName, value: saleValue })
    return await addOrUpdate(newDeal, request);
  } catch (error) {
    console.error("[Action] Error:", error)
    return { salesDeals: [], error: "Invalid form data" }
  }
}

const DealsLoaderDataSchema = z.object({
  salesDeals: z.array(DealWithId),
  error: z.string(),
  status: z.number()
});

type DealsLoaderData = z.infer<typeof DealsLoaderDataSchema>;

export default function Home({ loaderData }: { loaderData: DealsLoaderData }) {
  const {salesDeals, error, status} = loaderData
  return (
    <Welcome loaderData={{salesDeals, error, status}} />
  );
}
