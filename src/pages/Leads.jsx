import React from 'react'
import LeadButtons from '../components/leads/LeadButtons';
import ExampleWithLocalizationProvider from '../components/leads/LeadsTable';

const Leads = () => {
  return (
    <div className="flex flex-col space-y-4">
      <LeadButtons />
      <div className="overflow-x-auto p-2 m-2">
        <ExampleWithLocalizationProvider />
      </div>
    </div>
  )
}

export default Leads;