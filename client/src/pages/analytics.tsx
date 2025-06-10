import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, DollarSign, Target, Users } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export default function Analytics() {
  const { data: campaigns } = useQuery({
    queryKey: ["/api/campaigns"],
  });

  const { data: metrics } = useQuery({
    queryKey: ["/api/metrics"],
  });

  // Process campaign data for charts
  const campaignsByType = (campaigns || []).reduce((acc: any, campaign: any) => {
    acc[campaign.type] = (acc[campaign.type] || 0) + 1;
    return acc;
  }, {});

  const typeChartData = Object.entries(campaignsByType).map(([type, count]) => ({
    name: type,
    value: count,
  }));

  const campaignsByStatus = (campaigns || []).reduce((acc: any, campaign: any) => {
    acc[campaign.status] = (acc[campaign.status] || 0) + 1;
    return acc;
  }, {});

  const statusChartData = Object.entries(campaignsByStatus).map(([status, count]) => ({
    status: status.charAt(0).toUpperCase() + status.slice(1),
    campaigns: count,
  }));

  // Mock performance data over time
  const performanceData = [
    { month: 'Jan', conversions: 2.1, budget: 12000, roi: 180 },
    { month: 'Feb', conversions: 2.8, budget: 15000, roi: 220 },
    { month: 'Mar', conversions: 3.2, budget: 18000, roi: 245 },
    { month: 'Apr', conversions: 2.9, budget: 16000, roi: 210 },
    { month: 'May', conversions: 3.5, budget: 20000, roi: 280 },
    { month: 'Jun', conversions: 3.2, budget: 22000, roi: 245 },
  ];

  const budgetTrendData = (campaigns || []).map((campaign: any, index: number) => ({
    name: campaign.name.slice(0, 15) + (campaign.name.length > 15 ? '...' : ''),
    budget: parseFloat(campaign.budget),
    progress: campaign.progress,
  }));

  return (
    <>
      <Header 
        title="Analytics"
        subtitle="Performance insights and campaign analytics"
        showCreateButton={false}
      />
      
      <div className="p-6 space-y-6">
        {/* Key Metrics Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl card-shadow border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Campaigns</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{(campaigns || []).length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Target className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl card-shadow border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Conversion Rate</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{metrics?.conversionRate || 0}%</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl card-shadow border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Budget</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{formatCurrency(metrics?.totalBudget || 0)}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <DollarSign className="text-yellow-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl card-shadow border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. ROI</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{metrics?.roi || 0}%</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="text-purple-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Campaign Status Distribution */}
          <div className="bg-white rounded-xl card-shadow border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Campaign Status Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="status" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="campaigns" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Campaign Types */}
          <div className="bg-white rounded-xl card-shadow border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Campaign Types</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={typeChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {typeChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Performance Trends */}
          <div className="bg-white rounded-xl card-shadow border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Trends</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="conversions" stroke="#10B981" strokeWidth={2} name="Conversion Rate %" />
                  <Line type="monotone" dataKey="roi" stroke="#3B82F6" strokeWidth={2} name="ROI %" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Budget vs Progress */}
          <div className="bg-white rounded-xl card-shadow border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget vs Progress</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={budgetTrendData.slice(0, 5)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Bar yAxisId="left" dataKey="budget" fill="#F59E0B" name="Budget ($)" />
                  <Bar yAxisId="right" dataKey="progress" fill="#10B981" name="Progress %" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Insights Panel */}
        <div className="bg-white rounded-xl card-shadow border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Campaign Performance</h4>
              <p className="text-sm text-blue-700">
                {campaigns?.filter((c: any) => c.status === 'active').length || 0} active campaigns generating strong ROI
              </p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-900 mb-2">Budget Utilization</h4>
              <p className="text-sm text-green-700">
                {formatCurrency(metrics?.totalBudget || 0)} total budget allocated across campaigns
              </p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h4 className="font-medium text-purple-900 mb-2">Optimization Opportunity</h4>
              <p className="text-sm text-purple-700">
                Focus on high-performing campaign types for better conversion rates
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}