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
    <div className="flex flex-col lg:flex-row gap-8 p-4 bg-white rounded-lg shadow-lg">
      {/* Left side - Radar Chart */}
      <div className="flex justify-center items-center lg:justify-start flex-shrink-0">
        <div style={{ width: `${Math.min(width, 350)}px`, height: `${Math.min(height, 350)}px`, maxWidth: '100%' }}>
          <Radar data={data} options={options} />
        </div>
      </div>
      
      {/* Right side - Score Breakdown */}
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <h4 className="text-lg font-semibold text-gray-700 mb-4 text-center">Score Breakdown</h4>
        <div className="space-y-3">
          {Object.entries(scores).map(([category, score]) => (
            <div key={category} className="flex items-center gap p-3 bg-gray-50 rounded-lg">
              {/* Category name - fixed width for alignment */}
              <div className="flex-1 min-w-0">
                <span className="font-medium text-gray-700 text-sm">
                  {category.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </span>
              </div>
              
              {/* Progress bar - fixed width */}
              <div className="w-24 bg-gray-200 rounded-full h-2.5 flex-shrink-0">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${score * 100}%` }}
                ></div>
              </div>
              
              {/* Percentage - fixed width for alignment */}
              <div className="w-12 text-right flex-shrink-0">
                <span className="text-sm font-semibold text-blue-600">
                  {Math.round(score * 100)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RadarChart;