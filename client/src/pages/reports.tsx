import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Download, Calendar as CalendarIcon, FileText, TrendingUp, DollarSign, Target } from "lucide-react";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import { format } from "date-fns";

export default function Reports() {
  const [reportType, setReportType] = useState("campaign-summary");
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });

  const { data: campaigns } = useQuery({
    queryKey: ["/api/campaigns"],
  });

  const { data: metrics } = useQuery({
    queryKey: ["/api/metrics"],
  });

  const { data: auditLogs } = useQuery({
    queryKey: ["/api/audit-logs"],
  });

  const generateReport = () => {
    let reportData: any[] = [];
    let headers: string[] = [];
    let filename = "";

    switch (reportType) {
      case "campaign-summary":
        headers = ["Campaign Name", "Type", "Status", "Budget", "Progress", "Start Date", "End Date"];
        reportData = campaigns?.map((campaign: any) => [
          campaign.name,
          campaign.type,
          campaign.status,
          campaign.budget,
          `${campaign.progress}%`,
          format(new Date(campaign.startDate), "yyyy-MM-dd"),
          format(new Date(campaign.endDate), "yyyy-MM-dd"),
        ]) || [];
        filename = "campaign-summary-report";
        break;

      case "budget-analysis":
        headers = ["Campaign Name", "Budget", "Status", "Performance Score"];
        reportData = campaigns?.map((campaign: any) => [
          campaign.name,
          formatCurrency(campaign.budget),
          campaign.status,
          `${campaign.progress}/100`,
        ]) || [];
        filename = "budget-analysis-report";
        break;

      case "performance-metrics":
        headers = ["Metric", "Value", "Period"];
        reportData = [
          ["Total Campaigns", campaigns?.length || 0, "Current"],
          ["Active Campaigns", metrics?.activeCampaigns || 0, "Current"],
          ["Total Budget", formatCurrency(metrics?.totalBudget || 0), "Current"],
          ["Average ROI", `${metrics?.roi || 0}%`, "Current"],
          ["Conversion Rate", `${metrics?.conversionRate || 0}%`, "Current"],
        ];
        filename = "performance-metrics-report";
        break;

      case "audit-trail":
        headers = ["Timestamp", "User", "Action", "Resource", "Changes"];
        reportData = auditLogs?.logs?.map((log: any) => [
          formatDate(log.timestamp),
          log.userName,
          log.action,
          log.resource,
          log.changes || "",
        ]) || [];
        filename = "audit-trail-report";
        break;
    }

    // Generate CSV
    const csvContent = [
      headers.join(","),
      ...reportData.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const reportTypes = [
    { value: "campaign-summary", label: "Campaign Summary" },
    { value: "budget-analysis", label: "Budget Analysis" },
    { value: "performance-metrics", label: "Performance Metrics" },
    { value: "audit-trail", label: "Audit Trail" },
  ];

  const previewData = () => {
    switch (reportType) {
      case "campaign-summary":
        return campaigns?.slice(0, 5) || [];
      case "budget-analysis":
        return campaigns?.slice(0, 5) || [];
      case "performance-metrics":
        return [
          { metric: "Total Campaigns", value: campaigns?.length || 0 },
          { metric: "Active Campaigns", value: metrics?.activeCampaigns || 0 },
          { metric: "Total Budget", value: formatCurrency(metrics?.totalBudget || 0) },
          { metric: "Average ROI", value: `${metrics?.roi || 0}%` },
          { metric: "Conversion Rate", value: `${metrics?.conversionRate || 0}%` },
        ];
      case "audit-trail":
        return auditLogs?.logs?.slice(0, 5) || [];
      default:
        return [];
    }
  };

  return (
    <>
      <Header 
        title="Reports"
        subtitle="Generate comprehensive reports and analytics"
        showCreateButton={false}
      />
      
      <div className="p-6 space-y-6">
        {/* Report Configuration */}
        <div className="bg-white rounded-xl card-shadow border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Configuration</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {reportTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dateRange.from && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL dd, y")} -{" "}
                          {format(dateRange.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex items-end">
              <Button 
                onClick={generateReport}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white flex items-center space-x-2"
              >
                <Download size={16} />
                <span>Generate Report</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl card-shadow border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Reports Generated</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">24</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="text-blue-600" size={20} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl card-shadow border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Data Points</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{campaigns?.length || 0}</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Target className="text-green-600" size={20} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl card-shadow border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Budget Tracked</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(metrics?.totalBudget || 0)}</p>
              </div>
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <DollarSign className="text-yellow-600" size={20} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl card-shadow border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Performance</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{metrics?.avgProgress || 0}%</p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="text-purple-600" size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* Report Preview */}
        <div className="bg-white rounded-xl card-shadow border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Report Preview</h3>
            <p className="text-sm text-gray-500 mt-1">
              {reportTypes.find(t => t.value === reportType)?.label} - Preview of first 5 entries
            </p>
          </div>
          
          <div className="p-6">
            {reportType === "campaign-summary" && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 px-4 font-medium text-gray-700">Campaign</th>
                      <th className="text-left py-2 px-4 font-medium text-gray-700">Type</th>
                      <th className="text-left py-2 px-4 font-medium text-gray-700">Status</th>
                      <th className="text-left py-2 px-4 font-medium text-gray-700">Budget</th>
                      <th className="text-left py-2 px-4 font-medium text-gray-700">Progress</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewData().map((campaign: any, index: number) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-2 px-4 text-sm">{campaign.name}</td>
                        <td className="py-2 px-4 text-sm">{campaign.type}</td>
                        <td className="py-2 px-4 text-sm">
                          <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                            {campaign.status}
                          </span>
                        </td>
                        <td className="py-2 px-4 text-sm">{formatCurrency(campaign.budget)}</td>
                        <td className="py-2 px-4 text-sm">{campaign.progress}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {reportType === "performance-metrics" && (
              <div className="space-y-4">
                {previewData().map((metric: any, index: number) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="font-medium text-gray-700">{metric.metric}</span>
                    <span className="text-gray-900">{metric.value}</span>
                  </div>
                ))}
              </div>
            )}

            {reportType === "audit-trail" && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 px-4 font-medium text-gray-700">Timestamp</th>
                      <th className="text-left py-2 px-4 font-medium text-gray-700">User</th>
                      <th className="text-left py-2 px-4 font-medium text-gray-700">Action</th>
                      <th className="text-left py-2 px-4 font-medium text-gray-700">Resource</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewData().map((log: any, index: number) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-2 px-4 text-sm">{formatDate(log.timestamp)}</td>
                        <td className="py-2 px-4 text-sm">{log.userName}</td>
                        <td className="py-2 px-4 text-sm">{log.action}</td>
                        <td className="py-2 px-4 text-sm">{log.resource}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {reportType === "budget-analysis" && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 px-4 font-medium text-gray-700">Campaign</th>
                      <th className="text-left py-2 px-4 font-medium text-gray-700">Budget</th>
                      <th className="text-left py-2 px-4 font-medium text-gray-700">Status</th>
                      <th className="text-left py-2 px-4 font-medium text-gray-700">Efficiency</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewData().map((campaign: any, index: number) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-2 px-4 text-sm">{campaign.name}</td>
                        <td className="py-2 px-4 text-sm">{formatCurrency(campaign.budget)}</td>
                        <td className="py-2 px-4 text-sm">{campaign.status}</td>
                        <td className="py-2 px-4 text-sm">{campaign.progress}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {previewData().length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No data available for preview. Create some campaigns to generate reports.
              </div>
            )}
          </div>
        </div>

        {/* Scheduled Reports */}
        <div className="bg-white rounded-xl card-shadow border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Scheduled Reports</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Weekly Campaign Summary</p>
                <p className="text-sm text-gray-500">Every Monday at 9:00 AM</p>
              </div>
              <Button variant="outline" size="sm">Configure</Button>
            </div>
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Monthly Performance Report</p>
                <p className="text-sm text-gray-500">First day of each month</p>
              </div>
              <Button variant="outline" size="sm">Configure</Button>
            </div>
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Quarterly Budget Analysis</p>
                <p className="text-sm text-gray-500">Every 3 months</p>
              </div>
              <Button variant="outline" size="sm">Configure</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}