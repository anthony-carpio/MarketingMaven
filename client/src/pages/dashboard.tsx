import { useState } from "react";
import Header from "@/components/layout/header";
import MetricsCards from "@/components/dashboard/metrics-cards";
import CampaignTable from "@/components/campaign/campaign-table";
import RecentActivity from "@/components/dashboard/recent-activity";
import CampaignFormModal from "@/components/campaign/campaign-form-modal";
import { Button } from "@/components/ui/button";
import { Plus, Download, Calendar } from "lucide-react";
import type { Campaign } from "@shared/schema";

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);

  const handleCreateCampaign = () => {
    setEditingCampaign(null);
    setIsModalOpen(true);
  };

  const handleEditCampaign = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCampaign(null);
  };

  return (
    <>
      <Header 
        title="Dashboard"
        subtitle="Track and manage your marketing campaigns"
        onCreateCampaign={handleCreateCampaign}
      />
      
      <div className="p-6 space-y-6">
        <MetricsCards />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <CampaignTable onEditCampaign={handleEditCampaign} />
          </div>
          
          <div className="space-y-6">
            <RecentActivity />
            
            <div className="bg-white rounded-xl card-shadow border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button
                  onClick={handleCreateCampaign}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-left bg-white text-gray-900 justify-start"
                  variant="outline"
                >
                  <Plus className="text-blue-500" size={20} />
                  <span className="text-sm font-medium">Create Campaign</span>
                </Button>
                <Button
                  className="w-full flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-left bg-white text-gray-900 justify-start"
                  variant="outline"
                >
                  <Download className="text-cyan-500" size={20} />
                  <span className="text-sm font-medium">Export Report</span>
                </Button>
                <Button
                  className="w-full flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-left bg-white text-gray-900 justify-start"
                  variant="outline"
                >
                  <Calendar className="text-purple-500" size={20} />
                  <span className="text-sm font-medium">Schedule Review</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CampaignFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        campaign={editingCampaign}
      />
    </>
  );
}
