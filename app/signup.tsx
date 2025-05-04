import type { Route } from "./+types/signup";
import { redirect, useFetcher, useLoaderData,data } from "react-router";
import { sales_deals } from "../data/sales_deals.json" 

export default function Signup(_: Route.ComponentProps) {
  const fetcher = useFetcher();
  const loaderData = useLoaderData()
  const errors = fetcher.data?.message;
  console.log("the errors are ", errors)
  const elems = loaderData.sales_deals.map((deal,index) =>  (
        <>
            <h2 key={index}>{deal.name}</h2>
        </>
  ))
  return (
    <>
        {elems}
    <fetcher.Form method="post">
        {errors && Object.keys(errors)}
      <p>
        <input className="w-5xl border-2" placeholder="joe@joe.com" type="email" name="email" />
        {errors?.email ? <em>{errors.email}</em> : null}
      </p>

      <p>
        <input className="w-3xl border-2" placeholder="*****" type="password" name="password" />
        {errors?.password ? (
          <em>{errors.password}</em>
        ) : null}
      </p>

      <button type="submit">Sign Up</button>
    </fetcher.Form>
    </>
  );
}
export async function loader() {
    return { sales_deals };
  }
  
export async function action({
    request,
  }: Route.ActionArgs) {
    const formData = await request.formData();
    const email = String(formData.get("email"));
    const password = String(formData.get("password"));
    console.log("hi")
    const message = {
        email: email,
        password: password
    };
  
    return data({ message }, { status: 200 });
}
