import { BarChart } from "@mui/x-charts";

export default function HomeBars({ barChartData }: { barChartData: any }) {
    return (
        <BarChart
            xAxis={barChartData.xAxis}
            series={barChartData.series}
            width={500}
            height={300}
        />
    )
}