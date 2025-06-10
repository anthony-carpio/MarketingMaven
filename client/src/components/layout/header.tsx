import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import NotificationsDropdown from "./notifications-dropdown";

interface HeaderProps {
  title: string;
  subtitle: string;
  onCreateCampaign?: () => void;
  showCreateButton?: boolean;
}

export default function Header({ 
  title, 
  subtitle, 
  onCreateCampaign, 
  showCreateButton = true 
}: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
          <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
        </div>
        <div className="flex items-center space-x-4">
          <NotificationsDropdown />
          {showCreateButton && (
            <Button 
              onClick={onCreateCampaign}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <Plus size={16} />
              <span>New Campaign</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
