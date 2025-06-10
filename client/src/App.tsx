import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Dashboard from "@/pages/dashboard";
import Campaigns from "@/pages/campaigns";
import AuditLog from "@/pages/audit-log";
import Analytics from "@/pages/analytics";
import Reports from "@/pages/reports";
import Notifications from "@/pages/notifications";
import NotFound from "@/pages/not-found";
import Sidebar from "@/components/layout/sidebar";

function Router() {
  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      <main className="flex-1 ml-64">
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/campaigns" component={Campaigns} />
          <Route path="/analytics" component={Analytics} />
          <Route path="/audit-log" component={AuditLog} />
          <Route path="/reports" component={Reports} />
          <Route path="/notifications" component={Notifications} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
