// PieChartComponent.js
import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

// Helper function to generate random colors
const generateRandomColors = (numColors) => {
  const colors = [];
  for (let i = 0; i < numColors; i++) {
    const randomColor = `hsl(${Math.floor(Math.random() * 360)}, 100%, 70%)`; // Generating random HSL colors
    colors.push(randomColor);
  }
  return colors;
};

const PieChartComponent = ({ categoryData }) => {
  const labels = categoryData.map((item) => item.category);
  const dataValues = categoryData.map((item) => item.amount);

  // Dynamically generate colors based on the number of categories
  const backgroundColors = generateRandomColors(labels.length);

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Category-wise Expenses",
        data: dataValues,
        backgroundColor: backgroundColors,
        hoverBackgroundColor: backgroundColors,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Hide default legend
      },
    },
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      {/* Pie Chart */}
      <div className="w-[200px] sm:w-[300px] h-[200px] sm:h-[300px]">
        <Pie data={data} options={options} />
      </div>

      {/* Custom Legend */}
      <div className="w-[90%] mx-auto">
        <table className="text-left mx-auto col-span-2">
          <tbody>
            {categoryData.map((item, index) => (
              <tr key={item.category}>
                 <td className="px-6 py-4 whitespace-nowrap text-[10px] sm:text-[12px] text-white">
                 <div
                className="w-4 h-4 sm:w-5 sm:h-5 mr-2 rounded-full transform"
                style={{ backgroundColor: backgroundColors[index] }}
              ></div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-[10px] sm:text-[12px] text-white">
                  {item.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-[10px] sm:text-[12px] text-white">
                  {item.amount.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PieChartComponent;
