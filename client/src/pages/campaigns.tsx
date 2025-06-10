import { useState } from "react";
import Header from "@/components/layout/header";
import CampaignTable from "@/components/campaign/campaign-table";
import CampaignFormModal from "@/components/campaign/campaign-form-modal";
import type { Campaign } from "@shared/schema";

export default function Campaigns() {
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
        title="Campaigns"
        subtitle="Manage all your marketing campaigns"
        onCreateCampaign={handleCreateCampaign}
      />
      
      <div className="p-6">
        <CampaignTable onEditCampaign={handleEditCampaign} />
      </div>

      <CampaignFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        campaign={editingCampaign}
      />
    </>
  );
}
