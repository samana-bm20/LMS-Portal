import React from 'react'
import LeadButtons from '../components/leads/LeadButtons';
import LeadsTable from '../components/leads/LeadsTable';

const Leads = () => {
  return (
    <div className="flex flex-col space-y-4">
      <LeadButtons />
      <div className="overflow-x-auto p-2 m-2">
        <LeadsTable />
      </div>
    </div>
  )
}

export default Leads;