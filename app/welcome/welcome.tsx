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
      <header >
          <h1 
            className="flex w-full h-13.5 bg-green-900 justify-center align-center gap-4 text-5xl text-white font-bold ">
              
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ marginRight: '8px' , marginTop: '10px'}}
            >
            <path d="M12 2v8M12 14v8M4.93 4.93l5.66 5.66M13.41 13.41l5.66 5.66M2 12h8M14 12h8M4.93 19.07l5.66-5.66M13.41 10.59l5.66-5.66" 
            stroke="#29d952" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
            Sales Team Dashboard
          </h1>
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


