import { createContext, useContext, useState } from 'react';

type PaymentContextType = {
  //   paymentStatus: 'process' | 'fail' | 'ok' | 'err' | null;
  paymentStatus: string | null;
  paymentId: string | null;
  setPaymentStatus: (status: string | null) => void;
  setPaymentId: (id: string | null) => void;
};

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const PaymentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
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
