import { Line } from '@ant-design/plots';

interface GraphDataItem {
    date: string;
    amount: number;
}

interface DashboardGraphProps {
    graphData?: GraphDataItem[];
}

export const DashboardGraph = ({ graphData }: DashboardGraphProps) => {
    const DemoLine = () => {

        const data = graphData?.sort((a, b) => (a.date > b.date ? 1 : -1)).map(item => ({
            date: item?.date,
            amount: item?.amount,
        }))
        const config = {
            data,
            xField: 'date',
            yField: 'amount',
            shapeField: 'smooth', 
            axis: { y: false, },
            height:300,
            // scale: {
            //     y: {
            //         domainMin: 0,
            //     },
            // },
            interaction: {
                tooltip: {
                    marker: false,
                },
            },
            style: {
                lineWidth: 2,
            },
        };
        return <Line {...config} />;
    };
    return <DemoLine />;
}