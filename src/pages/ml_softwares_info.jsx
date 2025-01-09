/* eslint-disable no-unused-vars */
import React from 'react'
import SoftwaresInfoTable from '../components/ML_Software_Info/softwareInfoTable';

const MLSoftwaresInfo = () => {

  return (
        <div className="flex flex-col space-y-4">
          <div className="overflow-x-auto p-2 m-2">
            <SoftwaresInfoTable />
          </div>
        </div>
      )
}

export default MLSoftwaresInfo