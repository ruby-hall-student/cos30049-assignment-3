import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js';
import {Doughnut} from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip);

export default function SpamDonutChart({
    spamProbability = 0,
    colours = ["rgb(255,0,0)", "rgb(0,255,0)"],
    radius = "100%"
}) {
    const data = {
        labels: [
            "Spam", 
            "Not Spam"
        ],
        datasets: [{
            label: "% Likelihood",
            data: [spamProbability * 100, (1-spamProbability) * 100],
            backgroundColor: colours,
            hoverOffset: 4, 
            radius: radius
        }]
    }

    // const plugins = {
    //     id: "doughnutLabel",
    //     afterDatasetsDraw(chart, args, plugins) {
    //         const {ctx, data} = chart;

    //         const centreX = chart.getDatasetMeta(0).data[0].x;
    //         const centreY = chart.getDatasetMeta(0).data[0].y;

    //         ctx.save();
    //         ctx.font = "bold 90px sans-serif";
    //         ctx.fillStyle = "black";
    //         ctx.textAlign = "center";
    //         ctx.fillText(spamProbability*100 + "%", centreX, centreY);
    //     }
    // };

    return <Doughnut data={data}/>
}

// import * as d3 from "d3";

// export default function SpamDonutChart({
//     diameter = 500,
//     color = [d3.rgb(255, 0,0), d3.rgb(0, 255, 0)]
// }){
//     const data = [
//     { name: 'A', value: 30, x: 10, y: 20 },
//     { name: 'B', value: 50, x: 20, y: 40 },
//     { name: 'C', value: 20, x: 30, y: 10 },
//     { name: 'D', value: 40, x: 40, y: 30 },
//     { name: 'E', value: 60, x: 50, y: 50 },
//   ]
//     const radius = diameter/2;

//     const arc = d3.arc().innerRadius(radius*0.67).outerRadius(radius-1);

//     const pie = d3.pie()
//       .value(d => d.value)
//       .sort(null);

//     const colour = d3.scaleOrdinal(color).domain(data.map(d=>d.label))

//     const svg = d3.create("svg")
//         .attr("width", diameter)
//         .attr("height", diameter)
//         .attr("viewBox", [-diameter/2, -diameter/2, diameter, diameter])
//         .attr("style", "max-width: 100%; height: auto;");

//     svg.append("g")
//         .selectAll()
//         .data(pie(data))
// }