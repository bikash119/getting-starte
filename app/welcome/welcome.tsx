import { Form , useFetcher } from "react-router";
import Chart from "./chart"
import type { PostgrestError } from "@supabase/supabase-js";

type WelcomeProps = {
  loaderData: {
    salesDeals: any[] | null
    error: PostgrestError | null
  }
}

export default function Welcome({loaderData}: WelcomeProps) {
  const fetcher = useFetcher()
  return (
    <>
      <header className="flex w-full bg-slate-400">
          <nav>
            <h1 className="text-2xl">Getting Started</h1>
          </nav>
        </header>
            <main>
                <section>
                  <Chart loaderData= { loaderData }/>
                </section>
                <fetcher.Form id="add-deal" method="post">
                  <section>
                      <p>
                        <span>Sales Rep:</span>
                        <input 
                          aria-label="Rep Name"
                          name="name"
                          placeholder="sales rep name"
                          type="text"
                          />
                        <span>Sale Value:</span>
                        <input 
                          aria-label="Sales Value"
                          name="value"
                          placeholder="sale value"
                          type="text"
                          />
                        <button 
                          className="border-2 bg-stone-300 cursor-pointer" 
                          type="submit"
                          >Add</button>
                      </p>
                  </section>
                </fetcher.Form>
            </main>
    </>
  );
}


