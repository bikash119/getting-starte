import { useFetcher } from "react-router";
import DealsChart from "./chart";
import { z } from 'zod';
import { useRef } from 'react'

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
  const formRef = useRef<HTMLFormElement>(null)
  const {loaderData} = props
  const isSubmitting = fetcher.state === 'submitting'
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    fetcher.submit(formData, { method: 'post' })
    
    // Reset immediately for optimistic UI
    formRef.current?.reset()
  }
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
                <fetcher.Form 
                  id="add-deal" 
                  method="post" 
                  onSubmit={handleSubmit}
                  ref={formRef}
                >
                  <section>
                      <p>
                        <span>Sales Rep:</span>
                        <input 
                          aria-label="Rep Name"
                          name="name"
                          placeholder="sales rep name"
                          type="text"
                          disabled={isSubmitting}
                          />
                        <span>Sale Value:</span>
                        <input 
                          aria-label="Sales Value"
                          name="value"
                          placeholder="sale value"
                          type="text"
                          disabled={isSubmitting}
                          />
                        <button 
                          className="border-2 bg-stone-300 cursor-pointer" 
                          type="submit"
                          >{isSubmitting ? 'Adding...' : 'Add'}
                          </button>
                      </p>
                  </section>
                </fetcher.Form>
            </main>
    </>
  );
}


