import { Form , useFetcher } from "react-router";
import DealsChart from "./chart";
import { z } from 'zod';
import type { DealSchema ,DealsResponseSchema} from "api/type/deals";
import { loader } from "~/routes/home";

const WelcomePropsSchema = z.object({
  loaderData: z.object({
    salesDeals: z.array(z.object({name: z.string(), value: z.number()})),
    error: z.string(),
    status: z.number()
  })
});

type WelcomeProps = z.infer<typeof WelcomePropsSchema>;

export default function Welcome(props: WelcomeProps) {
  const fetcher = useFetcher()
  const {loaderData} = props
  return (
    <>
      <header className="flex w-full bg-slate-400">
          <nav>
            <h1 className="text-2xl">Getting Started</h1>
          </nav>
        </header>
            <main>
                <section>
                  <DealsChart salesDeals={loaderData.salesDeals} error={loaderData.error} status={loaderData.status} />
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


