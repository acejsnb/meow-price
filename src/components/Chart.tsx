'use client'
import {useEffect, useRef} from 'react'
import PLChart, {data} from "@/utils/PLChart";

export default function Chart() {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;
    PLChart(chartRef.current, data)
  }, []);

  return (
    <div className="p-5 w-[1000px]">
      <div className="w-full h-[580px]" id="chart" ref={chartRef}></div>
      <div className="flex items-center justify-between pl-[100px] pr-[60px] w-full text-[20px]">
        <section id="MaxLoss" className="flex items-center justify-center gap-2 duration-200">
          <span className="bg-[#ff6a00] rounded-full w-[10px] h-[10px]"></span>
          <span>Max Loss</span>
        </section>
        <section id="Breakeven" className="flex items-center justify-center gap-2 duration-200">
          <span className="bg-black rounded-full w-[10px] h-[10px]"></span>
          <span>Breakeven</span>
        </section>
        <section id="MaxProfit" className="flex items-center justify-center gap-2 duration-200">
          <span className="bg-[#04e330] rounded-full w-[10px] h-[10px]"></span>
          <span>Max Profit</span>
        </section>
      </div>
    </div>
  )
}
