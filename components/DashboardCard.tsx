interface DashboardCardProps {
  title: string;
  icon: string;
  value: string | number;
  description: string;
  color?: 'primary' | 'gold' | 'green';
}

export default function DashboardCard({ 
  title, 
  icon, 
  value, 
  description, 
  color = 'primary' 
}: DashboardCardProps) {
  const colorClasses = {
    primary: 'border-primary-200 bg-primary-50',
    gold: 'border-gold-200 bg-gold-50',
    green: 'border-green-200 bg-green-50'
  };

  const textColorClasses = {
    primary: 'text-primary-700',
    gold: 'text-gold-700',
    green: 'text-green-700'
  };

  return (
    <div className={`bg-white p-6 rounded-lg shadow-lg border-2 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="text-3xl">{icon}</div>
        <div className="text-right">
          <div className={`text-2xl font-bold ${textColorClasses[color]}`}>
            {value}
          </div>
        </div>
      </div>
      <h3 className="text-lg font-serif font-semibold text-gray-800 mb-2">
        {title}
      </h3>
      <p className="text-gray-600 text-sm">
        {description}
      </p>
    </div>
  );
}