import axios from "axios";
import { format } from "date-fns";
import { LineChart } from "@mui/x-charts";
import { Box, Chip, Grid } from "@mui/material";
import { useQuery } from "@tanstack/react-query";

import { Home } from "../widgets";
import { useBoundStore, useDatesStore } from "../store/store";

type TEvent = {
    id: number;
    name: string;
    number: number;
    date: string;
    createdAt: string;
    updatedAt: string;
    type: number;
    categoryId: number;
};

const fetchEventsByUser = async (userId?: number, startDate?: string, endDate?: string) => {
    if (!userId) {
        throw new Error('provide user id!');
    }

    const params = new URLSearchParams();
    if (startDate) params.append('startDate', format(startDate, 'yyyy-MM-dd'));
    if (endDate) params.append('endDate', format(endDate, 'yyyy-MM-dd'));

    const response = await axios.get(`http://localhost:5254/api/Event/user?${params.toString()}`);
    return response.data?.$values;
};

const useEventsByUser = (userId?: number, startDate?: string, endDate?: string) => {
    return useQuery<TEvent[]>({
        queryKey: ['get-events-by-user', userId, startDate, endDate],
        queryFn: () => fetchEventsByUser(userId, startDate, endDate),
        enabled: !!userId
    });
};

// Helper function to group data by type and format for charts
const formatChartData = (events: TEvent[] | undefined) => {
    if (!events || (events && events.length === 0)) {
        return { pieChartData: [], barChartData: { xAxis: [], series: [] } }
    }

    const profitData = events.filter(event => event.type === 0).map(event => ({
        label: event.name,
        value: event.number,
        color: 'green',
        type: 'profit'
    }));

    const costData = events.filter(event => event.type === 1).map(event => ({
        label: event.name,
        value: event.number,
        color: 'red',
        type: 'cost'
    }));

    // Format data for pie chart
    const pieChartData = [...profitData, ...costData];

    // Format data for bar chart
    const xAxisData = [...new Set(events.map(event => event.name))];
    const profitSeries = xAxisData.map(name => profitData.find(event => event.label === name)?.value || 0);
    const costSeries = xAxisData.map(name => costData.find(event => event.label === name)?.value || 0);

    const barChartData = {
        xAxis: [{ scaleType: 'band', data: xAxisData }],
        series: [
            { data: profitSeries },
            { data: costSeries }
        ]
    };

    return { pieChartData, barChartData };
};

export default function HomePage() {
    const user = useBoundStore(state => state.user)
    const dates = useDatesStore(state => state.dates);
    const { error, data, isLoading } = useEventsByUser(user !== null ? user.id : undefined, dates.start, dates.end);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {JSON.stringify(error)}</div>;

    const { pieChartData, barChartData } = formatChartData(data);

    // Initialize sum variables
    let sumOfProfits = 0;
    let sumOfCosts = 0;
    let netProfit = 0;

    // Check if barChartData has valid data
    if (barChartData && barChartData.series && barChartData.series.length === 2) {
        // Calculate sum of all profits
        sumOfProfits = barChartData.series[0].data.reduce((acc: number, curr: number) => acc + curr, 0);

        // Calculate sum of all costs
        sumOfCosts = barChartData.series[1].data.reduce((acc: number, curr: number) => acc + curr, 0);

        // Calculate net profit
        netProfit = sumOfProfits - sumOfCosts;
    }

    // Modify the worldElectricityProduction dataset to include only relevant data for the LineChart
    const lineChartData = data?.map(event => ({
        year: new Date(event.date).getFullYear(), // Assuming event.date is the date of the event
        [event.type === 0 ? 'profit' : 'cost']: event.number, // Group by type (profit or cost)
    }));

    // Define the configuration for the LineChart
    const lineChartConfig = {
        xAxis: [
            {
                dataKey: 'year',
                valueFormatter: (value) => value.toString(),
                min: 2022,
                max: 2040,
            },
        ],
        series: [
            {
                dataKey: 'profit',
                label: 'Profit',
                color: 'green', // Customize color as needed
                showMark: true,
                area: true,
            },
            {
                dataKey: 'cost',
                label: 'Cost',
                color: 'red', // Customize color as needed
                showMark: true,
                area: true,
            }
        ],
        dataset: lineChartData,
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={5}>
                <Grid item xs={12} xl={6}>
                    <Home.HomeBox>
                        <Box component={'h2'}>Головна Діаграмa Бюджету:</Box>
                        <Home.HomeMainChart pieChartData={pieChartData} />
                    </Home.HomeBox>
                </Grid>
                <Grid item xs={12} xl={6}>
                    <Home.HomeBox>
                        <Box component={'h2'}>Шкала доходів та витрат:</Box>
                        <Home.HomeBars barChartData={barChartData} />
                    </Home.HomeBox>
                </Grid>
                <Grid item xs={12} xl={6}>
                    <Home.HomeBox>
                        <Box component={'h2'}>Результат: (UAH)</Box>
                        <h3>Сума всіх прибутків: <Chip sx={{ fontSize: 18 }} label={sumOfProfits ?? ''} color='success' /> (UAH)</h3>
                        <h3>Сума всіх витрат: <Chip sx={{ fontSize: 18 }} label={sumOfCosts ?? ''} color='error' /> (UAH)</h3>
                        <h3>Чистий дохід: <Chip sx={{ fontSize: 20 }} label={netProfit ?? ''} color={netProfit >= 0 ? 'success' : 'error'} /> (UAH)</h3>
                    </Home.HomeBox>
                </Grid>
                <Grid item xs={12} xl={6}>
                    <Home.HomeBox>
                        <Box component={'h2'}>Графік доходів та витрат:</Box>
                        <LineChart
                            xAxis={lineChartConfig.xAxis}
                            series={lineChartConfig.series}
                            dataset={lineChartConfig.dataset}
                            width={500}
                            height={200}
                        />
                    </Home.HomeBox>
                </Grid>
            </Grid>
        </Box>
    )
}
