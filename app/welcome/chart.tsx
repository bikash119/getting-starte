import { useFetcher } from "react-router"
type Deal = {
    name: string
    value: number
} 
type WelcomeProps = {
    loaderData: {
        salesDeals: any[]
    }
  }


export default function Chart({loaderData} : WelcomeProps ){
    const {salesDeals} = loaderData 
    const elems = salesDeals.map((deal:Deal) => 
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