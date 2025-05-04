import type { PostgrestError } from "@supabase/supabase-js"
import { Chart as ReactChart } from 'react-charts';
type Deal = {
    name: string
    value: number
} 
type WelcomeProps = {
    loaderData: {
      salesDeals: any[] | null
      error: PostgrestError | null
    }
  }


export default function Chart({loaderData} : WelcomeProps ){
    const {salesDeals,error} = loaderData 
    const elems = salesDeals?.map((deal:Deal) => 
        <div key={deal.name}>
            <h2> {deal.name} </h2>
            <p> { deal.value }</p>
        </div>
    )
    return (
        <>
            <h2>Chart data here</h2>
            {elems}
        </>
    )
}