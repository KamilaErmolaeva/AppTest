import React from 'react';
import { usePaymentContext } from '../contexts/PaymentContext';
import SuccessIcon from '../icons/SuccessPay.svg?react';
import ErrorIcon from '../icons/Cross.svg?react';
import { cardFormStyles } from '../styles/styles';

export const PaymentStatus: React.FC = () => {
  const { paymentStatus } = usePaymentContext();

  return (
    <div
      className={`${cardFormStyles.container} container flex flex-col items-center justify-center`}
    >
      <div className="mb-4">
        {paymentStatus === 'ok' ? (
          <SuccessIcon className="w-[47px] h-[40px]" />
        ) : (
          <ErrorIcon className="w-[40px] h-[40px]" />
        )}
      </div>
      <h2 className="text-title text-grey-1000 ">
        {paymentStatus === 'ok' ? 'Оплата прошла успешно' : 'Произошла ошибка'}
      </h2>
    </div>
  );
};
