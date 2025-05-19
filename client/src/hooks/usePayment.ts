import { useState } from 'react';

export const usePayment = () => {
  const [error, setError] = useState<string | null>(null);

  const makePayment = async (cardData: {
    pan: string;
    expire: string;
    cardholder: string;
    cvc: string;
  }) => {
    setError(null);

    try {
      const response = await fetch('http://localhost:2050/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: Math.random().toString(36).substring(2, 15),
          method: 'pay',
          params: cardData,
        }),
      });

      if (!response.ok) {
        throw new Error('Payment failed');
      }

      const data = await response.json();
      return data.result.pid;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  };

  const checkPaymentStatus = async (pid: string) => {
    try {
      const response = await fetch(`http://localhost:2050/pay/check/${pid}`);
      if (!response.ok) {
        throw new Error('Failed to check payment status');
      }
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  };

  return { makePayment, checkPaymentStatus, error };
};
