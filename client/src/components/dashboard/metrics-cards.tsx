import { Rocket, DollarSign, TrendingUp, ChartLine } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function MetricsCards() {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ["/api/metrics"],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl card-shadow border border-gray-200 p-6 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-8 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
            </div>
            <div className="flex items-center mt-4">
              <div className="h-4 bg-gray-200 rounded w-20"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: "Active Campaigns",
      value: metrics?.activeCampaigns || 0,
      change: "+2",
      changeText: "from last month",
      icon: Rocket,
      iconColor: "text-green-600",
      iconBg: "bg-green-100",
    },
    {
      title: "Total Budget",
      value: `$${metrics?.totalBudget?.toLocaleString() || 0}`,
      change: "12%",
      changeText: "increase",
      icon: DollarSign,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-100",
    },
    {
      title: "Conversion Rate",
      value: `${metrics?.conversionRate || 0}%`,
      change: "+0.3%",
      changeText: "this quarter",
      icon: ChartLine,
      iconColor: "text-cyan-600",
      iconBg: "bg-cyan-100",
    },
    {
      title: "ROI",
      value: `${metrics?.roi || 0}%`,
      change: "+18%",
      changeText: "vs target",
      icon: TrendingUp,
      iconColor: "text-purple-600",
      iconBg: "bg-purple-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <div key={index} className="bg-white rounded-xl card-shadow border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{card.title}</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{card.value}</p>
            </div>
            <div className={`w-12 h-12 ${card.iconBg} rounded-lg flex items-center justify-center`}>
              <card.icon className={card.iconColor} size={24} />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <span className="text-green-600 font-medium">{card.change}</span>
            <span className="text-gray-500 ml-1">{card.changeText}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
