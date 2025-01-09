/* eslint-disable no-unused-vars */
import React from 'react';
// import SoftwaresInfoTable from '../components/ML_Software_Info/softwareInfoTable';
import PaymentTable from '../components/Payment/PaymentTable';

const Payment = () => {

  return (

        <div className="flex flex-col space-y-4">
          <div className="overflow-x-auto p-2 m-2">
            <PaymentTable />
          </div>
        </div>
      )
}

export default Payment
