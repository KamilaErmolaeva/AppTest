import React from 'react';
import { PaymentProvider, usePaymentContext } from './contexts/PaymentContext';
import { CardForm } from './components/CardForm';
import { PaymentStatus } from './components/PaymentStatus';

const App: React.FC = () => {
  return (
    <PaymentProvider>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <PaymentContent />
      </div>
    </PaymentProvider>
  );
};

const PaymentContent: React.FC = () => {
  const { paymentStatus } = usePaymentContext();

  return (
    <>{paymentStatus !== 'ok' && paymentStatus !== 'fail' ? <CardForm /> : <PaymentStatus />}</>
  );
};

export default App;
