import React from 'react'
import LeadButtons from '../components/leads/LeadButtons';
<<<<<<< HEAD
import LeadsTable from '../components/leads/LeadsTable';
=======
import ExampleWithLocalizationProvider from '../components/leads/LeadsTable';
>>>>>>> 5145d8b87a2573e55d07671c07279ccd5d427e5c

const Leads = () => {
  return (
    <div className="flex flex-col space-y-4">
      <LeadButtons />
      <div className="overflow-x-auto p-2 m-2">
<<<<<<< HEAD
        <LeadsTable />
=======
        <ExampleWithLocalizationProvider />
>>>>>>> 5145d8b87a2573e55d07671c07279ccd5d427e5c
      </div>
    </div>
  )
}

export default Leads;