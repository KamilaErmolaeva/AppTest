import { createContext, useContext, useState } from 'react';

type PaymentStatus = 'process' | 'fail' | 'ok' | 'err' | null;

type PaymentContextType = {
  paymentStatus: PaymentStatus;
  paymentId: string | null;
  setPaymentStatus: (status: PaymentStatus) => void;
  setPaymentId: (id: string | null) => void;
};

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const PaymentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(null);
  const [paymentId, setPaymentId] = useState<string | null>(null);

  return (
    <PaymentContext.Provider value={{ paymentStatus, paymentId, setPaymentStatus, setPaymentId }}>
      {children}
    </PaymentContext.Provider>
  );
};

export const usePaymentContext = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePaymentContext must be used within a PaymentProvider');
  }
  return context;
};
