import Header from "@/components/layout/header";
import AuditLogTable from "@/components/audit/audit-log-table";

export default function AuditLog() {
  return (
    <>
      <Header 
        title="Audit Log"
        subtitle="Complete audit trail for compliance and monitoring"
        showCreateButton={false}
      />
      
      <div className="p-6">
        <AuditLogTable />
      </div>
    </>
  );
}
