'use client';

import {
    Chart as ChartJS,
    ChartOptions,
    Filler,
    Legend,
    LineElement,
    PointElement,
    RadialLinearScale,
    Tooltip
} from 'chart.js';
import React from 'react';
import { Radar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface CategoryScores {
  [key: string]: number; // Values should be between 0.0 and 1.0
}

interface RadarChartProps {
  scores: CategoryScores;
  title?: string;
  width?: number;
  height?: number;
  primaryColor?: string;
  backgroundColor?: string;
}

const RadarChart: React.FC<RadarChartProps> = ({
  scores,
  title = "Personal Growth Categories",
  width = 400,
  height = 400,
  primaryColor = 'rgb(54, 162, 235)',
  backgroundColor = 'rgba(54, 162, 235, 0.2)'
}) => {
  // Convert scores object to Chart.js format
  const categories = Object.keys(scores);
  const values = Object.values(scores).map(score => Math.round(score * 100)); // Convert to percentage (0-100)

  const data = {
    labels: categories.map(category => 
      // Format category names for display (convert camelCase to Title Case)
      category.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
    ),
    datasets: [
      {
        label: 'Your Scores',
        data: values,
        borderColor: primaryColor,
        backgroundColor: backgroundColor,
        borderWidth: 3,
        pointBackgroundColor: primaryColor,
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: primaryColor,
        pointRadius: 6,
        pointHoverRadius: 8,
        fill: true,
      },
    ],
  };

  const options: ChartOptions<'radar'> = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      title: {
        display: !!title,
        text: title,
        font: {
          size: 18,
          weight: 'bold',
        },
        padding: 20,
        color: '#374151', // Gray-700
      },
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 14,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.label}: ${context.parsed.r}%`;
          }
        },
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: primaryColor,
        borderWidth: 1,
      }
    },
    scales: {
      r: {
        beginAtZero: true,
        min: 0,
        max: 100,
        ticks: {
          stepSize: 20,
          callback: function(value) {
            return value + '%';
          },
          font: {
            size: 12,
          },
          color: '#6B7280', // Gray-500
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
          lineWidth: 1,
        },
        angleLines: {
          color: 'rgba(0, 0, 0, 0.1)',
          lineWidth: 1,
        },
        pointLabels: {
          font: {
            size: 13,
            weight: 'bold',
          },
          color: '#374151', // Gray-700
          padding: 10,
        }
      },
    },
    elements: {
      line: {
        borderJoinStyle: 'round',
      },
      point: {
        borderWidth: 2,
      },
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutCubic',
    },
  };

  return (
    <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg">
      <div style={{ width: `${width}px`, height: `${height}px`, maxWidth: '100%' }}>
        <Radar data={data} options={options} />
      </div>
      
      {/* Score Summary */}
      <div className="mt-6 w-full max-w-md">
        <h4 className="text-lg font-semibold text-gray-700 mb-3 text-center">Score Breakdown</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
          {Object.entries(scores).map(([category, score]) => (
            <div key={category} className="flex justify-between items-center px-3 py-2 bg-gray-50 rounded">
              <span className="font-medium text-gray-700">
                {category.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </span>
              <span className="font-bold text-blue-600">
                {Math.round(score * 100)}%
              </span>
            </div>
          ))}
        </div>
        
        {/* Overall Score */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg text-center">
          <span className="text-sm text-blue-700 font-medium">Overall Average: </span>
          <span className="text-lg font-bold text-blue-800">
            {Math.round((Object.values(scores).reduce((sum, score) => sum + score, 0) / Object.values(scores).length) * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default RadarChart;