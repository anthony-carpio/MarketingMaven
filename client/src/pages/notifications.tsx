import { useState } from "react";
import { Bell, CheckCircle, AlertCircle, Clock, Filter, Search, Trash2 } from "lucide-react";
import Header from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { formatDate } from "@/lib/utils";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  timestamp: Date;
  read: boolean;
  category: "campaign" | "budget" | "system" | "audit";
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Campaign Performance Alert",
      message: "Q4 Email Marketing Push is performing 23% above target conversion rate",
      type: "success",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: false,
      category: "campaign",
    },
    {
      id: "2", 
      title: "Budget Warning",
      message: "Social Media Brand Awareness has used 85% of allocated budget",
      type: "warning",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      read: false,
      category: "budget",
    },
    {
      id: "3",
      title: "Campaign Completed",
      message: "Google Ads Holiday Campaign has successfully completed with 145% ROI",
      type: "info",
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      read: true,
      category: "campaign",
    },
    {
      id: "4",
      title: "Audit Log Export Ready",
      message: "Your requested audit log report has been generated and is ready for download",
      type: "info", 
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      read: true,
      category: "audit",
    },
    {
      id: "5",
      title: "Campaign Paused",
      message: "Influencer Collaboration campaign has been paused due to low performance metrics",
      type: "warning",
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      read: false,
      category: "campaign",
    },
    {
      id: "6",
      title: "System Maintenance Scheduled",
      message: "Scheduled maintenance window on Sunday 2:00 AM - 4:00 AM EST",
      type: "info",
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      read: true,
      category: "system",
    },
    {
      id: "7",
      title: "Budget Exceeded",
      message: "PPC Advertising campaign has exceeded monthly budget by 12%",
      type: "error",
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      read: false,
      category: "budget",
    },
    {
      id: "8",
      title: "New Campaign Created",
      message: "Content Marketing Initiative campaign has been successfully created",
      type: "success",
      timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      read: true,
      category: "campaign",
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || notification.type === typeFilter;
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "read" && notification.read) ||
                         (statusFilter === "unread" && !notification.read);
    const matchesCategory = categoryFilter === "all" || notification.category === categoryFilter;
    
    return matchesSearch && matchesType && matchesStatus && matchesCategory;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="text-green-500" size={20} />;
      case "warning":
        return <AlertCircle className="text-yellow-500" size={20} />;
      case "error":
        return <AlertCircle className="text-red-500" size={20} />;
      default:
        return <Clock className="text-blue-500" size={20} />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-100 text-green-800";
      case "warning":
        return "bg-yellow-100 text-yellow-800";
      case "error":
        return "bg-red-100 text-red-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "campaign":
        return "bg-purple-100 text-purple-800";
      case "budget":
        return "bg-orange-100 text-orange-800";
      case "system":
        return "bg-gray-100 text-gray-800";
      case "audit":
        return "bg-cyan-100 text-cyan-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const markAsRead = (ids: string[]) => {
    setNotifications(prev => 
      prev.map(notif => 
        ids.includes(notif.id) ? { ...notif, read: true } : notif
      )
    );
  };

  const markAsUnread = (ids: string[]) => {
    setNotifications(prev => 
      prev.map(notif => 
        ids.includes(notif.id) ? { ...notif, read: false } : notif
      )
    );
  };

  const deleteNotifications = (ids: string[]) => {
    setNotifications(prev => prev.filter(notif => !ids.includes(notif.id)));
    setSelectedNotifications([]);
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  const toggleSelection = (id: string) => {
    setSelectedNotifications(prev => 
      prev.includes(id) 
        ? prev.filter(selectedId => selectedId !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(filteredNotifications.map(n => n.id));
    }
  };

  const getTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      return `${days}d ago`;
    }
  };

  return (
    <>
      <Header 
        title="Notifications"
        subtitle={`All notifications (${unreadCount} unread)`}
        showCreateButton={false}
      />
      
      <div className="p-6 space-y-6">
        {/* Filters and Actions */}
        <div className="bg-white rounded-xl card-shadow border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <Input
                  placeholder="Search notifications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="unread">Unread</SelectItem>
                  <SelectItem value="read">Read</SelectItem>
                </SelectContent>
              </Select>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="campaign">Campaign</SelectItem>
                  <SelectItem value="budget">Budget</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                  <SelectItem value="audit">Audit</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-3">
              {selectedNotifications.length > 0 && (
                <>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => markAsRead(selectedNotifications)}
                  >
                    Mark Read
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => markAsUnread(selectedNotifications)}
                  >
                    Mark Unread
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => deleteNotifications(selectedNotifications)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 size={14} className="mr-1" />
                    Delete
                  </Button>
                </>
              )}
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={markAllAsRead}
              >
                Mark All Read
              </Button>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-white rounded-xl card-shadow border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Checkbox
                  checked={selectedNotifications.length === filteredNotifications.length && filteredNotifications.length > 0}
                  onCheckedChange={toggleSelectAll}
                />
                <h3 className="font-semibold text-gray-900">
                  {filteredNotifications.length} notifications
                  {selectedNotifications.length > 0 && ` (${selectedNotifications.length} selected)`}
                </h3>
              </div>
              <div className="flex items-center space-x-2">
                <Filter size={16} className="text-gray-400" />
                <span className="text-sm text-gray-500">
                  {typeFilter !== "all" && `Type: ${typeFilter} `}
                  {statusFilter !== "all" && `Status: ${statusFilter} `}
                  {categoryFilter !== "all" && `Category: ${categoryFilter}`}
                </span>
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => (
                <div 
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 transition-colors ${!notification.read ? 'bg-blue-50' : ''}`}
                >
                  <div className="flex items-start space-x-4">
                    <Checkbox
                      checked={selectedNotifications.includes(notification.id)}
                      onCheckedChange={() => toggleSelection(notification.id)}
                    />
                    
                    <div className="flex-shrink-0 mt-1">
                      {getIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className={`text-sm font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                              {notification.title}
                            </h4>
                            <Badge variant="secondary" className={getTypeColor(notification.type)}>
                              {notification.type}
                            </Badge>
                            <Badge variant="outline" className={getCategoryColor(notification.category)}>
                              {notification.category}
                            </Badge>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-gray-400">
                            <span>{getTimeAgo(notification.timestamp)}</span>
                            <span>{formatDate(notification.timestamp)}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => notification.read ? markAsUnread([notification.id]) : markAsRead([notification.id])}
                            className="text-xs"
                          >
                            {notification.read ? "Mark Unread" : "Mark Read"}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteNotifications([notification.id])}
                            className="text-red-600 hover:text-red-700 text-xs"
                          >
                            <Trash2 size={12} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center text-gray-500">
                <Bell className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <p className="text-sm">No notifications match your current filters</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    setSearchTerm("");
                    setTypeFilter("all");
                    setStatusFilter("all");
                    setCategoryFilter("all");
                  }}
                  className="mt-3"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}