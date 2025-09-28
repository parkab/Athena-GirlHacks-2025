'use client';

import RadarChart from '@/components/RadarChart';

export default function RadarChartDemo() {
  // Sample data sets for different user profiles
  const sampleScores1 = {
    creativity: 0.4,
    mindset: 0.8,
    consistency: 0.6,
    impulseControl: 0.5,
    stressRecovery: 0.7,
    reactionSpeed: 0.3,
    focusEndurance: 0.9
  };

  const sampleScores2 = {
    habits: 0.9,
    mindset: 0.6,
    relationships: 0.7,
    health: 0.8,
    creativity: 0.3,
    purpose: 0.9,
    learning: 0.5
  };

  const sampleScores3 = {
    discipline: 0.2,
    motivation: 0.8,
    socialSkills: 0.9,
    physicalFitness: 0.4,
    emotionalStability: 0.6,
    creativity: 0.7,
    productivity: 0.3
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4 text-gray-800">
          Radar Chart Visualization Demo
        </h1>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Interactive radar charts for visualizing personal growth categories. 
          Each chart shows different user profiles with varying strengths and areas for improvement.
        </p>

        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {/* Chart 1: Balanced Professional */}
          <div className="flex flex-col">
            <h3 className="text-xl font-semibold mb-4 text-center text-gray-700">
              🎯 Professional Growth Focus
            </h3>
            <RadarChart 
              scores={sampleScores1}
              title="Performance Profile"
              width={400}
              height={400}
              primaryColor="rgb(59, 130, 246)" // Blue
              backgroundColor="rgba(59, 130, 246, 0.1)"
            />
            <p className="text-sm text-gray-600 mt-4 text-center px-4">
              Strong in focus and mindset, developing creativity and reaction speed
            </p>
          </div>

          {/* Chart 2: Holistic Wellness */}
          <div className="flex flex-col">
            <h3 className="text-xl font-semibold mb-4 text-center text-gray-700">
              🌱 Holistic Wellness Journey  
            </h3>
            <RadarChart 
              scores={sampleScores2}
              title="Life Balance Assessment"
              width={400}
              height={400}
              primaryColor="rgb(34, 197, 94)" // Green
              backgroundColor="rgba(34, 197, 94, 0.1)"
            />
            <p className="text-sm text-gray-600 mt-4 text-center px-4">
              Excellent habits and purpose, working on creativity and learning
            </p>
          </div>

          {/* Chart 3: Personal Development */}
          <div className="flex flex-col lg:col-span-2 xl:col-span-1">
            <h3 className="text-xl font-semibold mb-4 text-center text-gray-700">
              ⚡ Personal Development
            </h3>
            <RadarChart 
              scores={sampleScores3}
              title="Growth Areas Map"
              width={400}
              height={400}
              primaryColor="rgb(168, 85, 247)" // Purple
              backgroundColor="rgba(168, 85, 247, 0.1)"
            />
            <p className="text-sm text-gray-600 mt-4 text-center px-4">
              Strong social skills and motivation, building discipline and productivity
            </p>
          </div>
        </div>

        {/* Usage Example */}
        <div className="mt-16 bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">How to Use</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-3 text-blue-600">Sample Data Format</h3>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`const scores = {
  creativity: 0.4,
  mindset: 0.8, 
  consistency: 0.6,
  impulseControl: 0.5,
  stressRecovery: 0.7,
  reactionSpeed: 0.3,
  focusEndurance: 0.9
};`}
              </pre>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3 text-green-600">React Component Usage</h3>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`<RadarChart 
  scores={scores}
  title="My Growth Profile"
  width={500}
  height={500}
  primaryColor="rgb(59, 130, 246)"
  backgroundColor="rgba(59, 130, 246, 0.1)"
/>`}
              </pre>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Key Features:</h4>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• <strong>Responsive design</strong> - Works on all screen sizes</li>
              <li>• <strong>Interactive tooltips</strong> - Hover to see exact percentages</li>
              <li>• <strong>Customizable colors</strong> - Match your brand or theme</li>
              <li>• <strong>Score breakdown</strong> - Detailed view below the chart</li>
              <li>• <strong>Overall average</strong> - Quick assessment summary</li>
              <li>• <strong>Smooth animations</strong> - Engaging user experience</li>
            </ul>
          </div>
        </div>

        {/* Integration Info */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Ready to integrate into your dashboard? Check out the{' '}
            <a href="/test-analysis" className="text-blue-600 hover:text-blue-800 font-semibold">
              Assessment Analysis page
            </a>
            {' '}to see real-time Gemini AI analysis with radar chart visualization.
          </p>
        </div>
      </div>
    </div>
  );
}