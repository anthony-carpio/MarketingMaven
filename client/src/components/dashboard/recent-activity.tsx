import { useQuery } from "@tanstack/react-query";
import { formatDate } from "@/lib/utils";

export default function RecentActivity() {
  const { data, isLoading } = useQuery({
    queryKey: ["/api/audit-logs", { limit: 5 }],
    queryFn: () => fetch("/api/audit-logs?limit=5").then(res => res.json()),
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl card-shadow border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-start space-x-3 animate-pulse">
              <div className="w-2 h-2 bg-gray-200 rounded-full mt-2 flex-shrink-0"></div>
              <div className="flex-1 min-w-0 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-100 rounded w-16"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const getActivityColor = (action: string) => {
    switch (action.toLowerCase()) {
      case 'campaign created':
        return 'bg-green-500';
      case 'campaign updated':
      case 'status updated':
        return 'bg-blue-500';
      case 'budget modified':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-white rounded-xl card-shadow border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {data?.logs?.length > 0 ? (
          data.logs.map((activity: any) => (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className={`w-2 h-2 ${getActivityColor(activity.action)} rounded-full mt-2 flex-shrink-0`}></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">
                  {activity.action} "{activity.resource}"
                  {activity.changes && ` - ${activity.changes}`}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatDate(activity.timestamp)}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">No recent activity</p>
        )}
      </div>
      <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium">
        View all activity
      </button>
    </div>
  );
}
