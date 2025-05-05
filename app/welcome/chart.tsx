import type { PostgrestError } from "@supabase/supabase-js"
import { Chart as ReactChart } from 'react-charts';
import type { ChartValue, Position } from 'react-charts'
import React from "react"
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
type MyDatum = { date: Date, stars: number }

export default function Chart({loaderData} : WelcomeProps ){
    console.log("Component Rendered")
    const {salesDeals,error} = loaderData
    const primaryAxis = {
        getValue: (d:{primary: string}) => d.primary,
        scaleType: 'band' as const,
        padding: 0.2,
        position: 'bottom' as Position,
    };

    
    const secondaryAxes = [{
        getValue: (d: { secondary: string}) => d.secondary,
        scaleType: 'linear' as const,
        min: 0,
        max: y_max(),
        padding: {
            top: 20,
            bottom: 40,
        },
    }];
    function y_max() {
        if (salesDeals!.length > 0) {
          const maxSum = Math.max(...salesDeals!.map((m) => m.value));
          return maxSum + 2000;
        }
        return 5000; 
      }
    const chartData = [{data:salesDeals!.map((deal:Deal) => ({primary:deal.name, secondary:String(deal.value)}))}]
    const elems = (
        <div className="w-3xl h-36 flex grow">
            <ReactChart
            options={{
              data: chartData,
              primaryAxis,
              secondaryAxes,
              type: 'bar',
              defaultColors: ['#58d675'],
              tooltip: {
                show: false,
              },
            }}
          />
        </div>
    )
    return (
        <>
            <h2>Chart data here</h2>
            {elems}
        </>
    )
}
{/* <p>{deal.name} : <span className="text-stone-400">{deal.value}</span></p> */}