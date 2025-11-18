import React from 'react';
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts';

interface ScoreGaugeProps {
  score: number;
}

const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score }) => {
  // Determine color based on score
  const getColor = (val: number) => {
    if (val >= 80) return '#10b981'; // Green
    if (val >= 60) return '#f59e0b'; // Yellow
    if (val > 0) return '#ef4444'; // Red
    return '#e5e7eb'; // Gray for 0/Unknown
  };

  const data = [
    {
      name: 'Score',
      value: score,
      fill: getColor(score),
    },
  ];

  return (
    <div className="w-full h-64 relative flex flex-col items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart 
          innerRadius="70%" 
          outerRadius="100%" 
          barSize={20} 
          data={data} 
          startAngle={180} 
          endAngle={0}
        >
          <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
          <RadialBar
            background
            dataKey="value"
            cornerRadius={10}
          />
        </RadialBarChart>
      </ResponsiveContainer>
      
      <div className="absolute bottom-10 text-center">
        <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Posture Score</p>
        <p className={`text-5xl font-bold`} style={{ color: getColor(score) }}>
          {score}
        </p>
      </div>
    </div>
  );
};

export default ScoreGauge;