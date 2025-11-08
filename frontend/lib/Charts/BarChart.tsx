import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip } from 'chart.js';
import {Bar} from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

export default function SpamBarChart({
    labels = [""],
    spamFeatureData = [0],
    colour = "rgb(0,0,0)"
}){
    const data = {
        labels: labels,
        datasets: [{
            data: spamFeatureData,
            backgroundColor: colour,
        }]
    }
    return <Bar data={data}/>
}