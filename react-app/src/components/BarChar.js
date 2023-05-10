import {useState, useEffect} from 'react';
import React from 'react';
import {Bar} from 'react-chartjs-2';
import { API_URL } from '../Config';
import {Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);


const options = {
    indexAxis: 'x',
    elements:{
        bar: {
            borderWidth: 2,
        },
    },
    responsive: true,
    plugins:{
        legend:{
            position: 'left',
        },
        title: {
            display: true,
            text: 'Total Number of Todos as per dates added',
        },
    },
};

function BarChart() {
    const [data, setData] = useState({
      labels: [],
      datasets:[
        {
            data:[],
            borderColor: 'rgb(255,99,132)',
            backgroundColor: 'rgba(255,99,132,0.5)',
        },
        ],
      });

    useEffect(() => {
      const fetchData = async () => {
        const count = {};
        const uniqueDates = [];
        try {
          const url = await fetch(`${API_URL}/data`);
          const jsnData = await url.json();
          for (const val of jsnData){
            const dateStr = val.createdAt.slice(0, 10); // extract the date from the createdAt field
                if (count[dateStr]) {
                    count[dateStr]++;
                } else {
                    count[dateStr] = 1;
                    uniqueDates.push(dateStr);
                }
          }
          setData({
            labels: uniqueDates,
            datasets:[
              {
                  label:'Dataset 1',
                  data: count,
                  borderColor: 'rgb(255,99,132)',
                  backgroundColor: 'rgba(255,99,132,0.5)',
              },
              ],
            })
          //setData(jsnData);
        } catch (error) {
          console.log(error);
        }
      };
      fetchData();
    }, []);
    //console.log(Ttldata);
    
  return (
    <div style={{display:'flex', alignItems:'center', justifyContent: 'center'}}>
    <div style={{width:'50vw', height:'20%'}}>
      <Bar data={data} options={options}/>
    </div>
    </div>
  )
}

export default BarChart
