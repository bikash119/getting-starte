import { Chart } from 'react-charts';
import type {  Position } from 'react-charts'
import { z } from 'zod';

const WelcomePropsSchema = z.object({
    salesDeals: z.array(z.object({name: z.string(), value: z.number()})).optional(),
    error: z.string().optional(),
    status: z.number().optional()
  })
  
  type WelcomeProps = z.infer<typeof WelcomePropsSchema>;


export default function DealsChart(props : WelcomeProps){
    const {salesDeals,error,status } = props
    if (salesDeals?.length === 0) return <p>{`No data : ${status}`}</p>
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
    const chartData = [{data:salesDeals!.map((deal:z.infer<typeof DealSchema>) => ({primary:deal.name, secondary:String(deal.value)}))}]
    
    const elems = (
        <div className="w-2xl h-60 flex grow pl-12.5">
            <Chart
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
            { elems}
        </>
    )
}
{/* <p>{deal.name} : <span className="text-stone-400">{deal.value}</span></p> */}