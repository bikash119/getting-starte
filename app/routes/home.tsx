import type { Route } from "./+types/home";
import  Welcome  from "../welcome/welcome"
import { sales_deals as initialSales} from "../../data/sales_deals.json" 

import { data, useFetcher, useLoaderData,Form, useActionData ,createCookie} from "react-router";

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
const prefs = createCookie("prefs")

export async function loader({request}: Route.LoaderArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await prefs.parse(cookieHeader)) || {salesDeals : [...initialSales]};
  return data({ salesDeals : cookie.salesDeals})
}

export async function action({request}: Route.ActionArgs){
  const cookieHeader = request.headers.get("Cookie")
  const cookie = (await prefs.parse(cookieHeader)) || {salesDeals : [...initialSales]};
  const formData = await request.formData();
  const salesRepName = String(formData.get("name")?? "")
  const saleValue = Number(formData.get("value") ?? 0)
  const newDeal = { name: salesRepName, value: saleValue}
  const updatedSalesDeals = cookie.salesDeals.some((deal:Deal) => deal.name === salesRepName) ?
    cookie.salesDeals.map( (deal:Deal) => deal.name === salesRepName ? {...deal, value : deal.value += saleValue} : deal )
    :
    [...cookie.salesDeals,newDeal];
  cookie.salesDeals = updatedSalesDeals
  return data(updatedSalesDeals,{
    headers: {
      "Set-Cookie": await prefs.serialize(cookie)
    }
  })
}

export default function Home({loaderData}: Route.ComponentProps) {

  return (<Welcome loaderData={ loaderData }/>
  );
}
