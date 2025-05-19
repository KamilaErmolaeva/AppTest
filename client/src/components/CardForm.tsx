import React, { useState } from 'react';
import { usePaymentContext } from '../contexts/PaymentContext';
import { usePayment } from '../hooks/usePayment';
import { InputField } from './InputField';
import { cardFormStyles } from '../styles/styles';

export const CardForm: React.FC = () => {
  const { setPaymentStatus, setPaymentId } = usePaymentContext();
  const { makePayment, checkPaymentStatus, error } = usePayment();
  const { paymentStatus } = usePaymentContext();

  const [formData, setFormData] = useState({
    pan: '',
    expire: '',
    cardholder: '',
    cvc: '',
  });

  const [errors, setErrors] = useState({
    pan: '',
    expire: '',
    cardholder: '',
    cvc: '',
  });

  const validateCardNumber = (pan: string) => {
    if (!pan) return 'Укажите номер карты';
    if (!/^\d+$/.test(pan)) return 'Номер карты должен содержать только цифры';
    if (pan.length < 13 || pan.length > 19) return 'Номер карты должен содержать от 13 до 19 цифр';
    return '';
  };

  const validateExpireDate = (expire: string) => {
    if (!expire) return 'Укажите срок действия';
    if (!/^\d{2}\/\d{2}$/.test(expire)) return 'Неверный формат (ММ/ГГ)';
    const [month, year] = expire.split('/').map(Number);
    if (month < 1 || month > 12) return 'Неверный месяц (1-12)';
    if (year < 21 || year > 26) return 'Неверный год (21-26)';
    return '';
  };

  const validateCardholder = (cardholder: string) => {
    if (!cardholder) return 'Укажите имя владельца';
    if (!/^[a-zA-Zа-яА-Я]+\s[a-zA-Zа-яА-Я]+$/.test(cardholder))
      return 'Должно быть два слова без цифр';
    return '';
  };

  const validateCvc = (cvc: string) => {
    if (!cvc) return 'Укажите CVC/CVV';
    if (!/^\d{3}$/.test(cvc)) return 'CVC/CVV должен содержать 3 цифры';
    return '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'pan') {
      const formattedValue = value
        .replace(/\s/g, '')
        .replace(/(\d{4})/g, '$1 ')
        .trim();
      const newFormData = { ...formData, [name]: formattedValue };
      setFormData(newFormData);
      setErrors((prev) => ({
        ...prev,
        pan: validateCardNumber(formattedValue.replace(/\s/g, '')),
      }));
      return;
    }

    if (name === 'expire') {
      let newValue = value;
      if (value.length === 2 && !formData.expire.includes('/')) {
        newValue = `${value}/`;
      }
      const newFormData = { ...formData, [name]: newValue };
      setFormData(newFormData);
      setErrors((prev) => ({
        ...prev,
        expire: validateExpireDate(newValue),
      }));
      return;
    }

    if (name === 'cvc') {
      setFormData({ ...formData, [name]: value });
      setErrors((prev) => ({
        ...prev,
        cvc: validateCvc(value),
      }));
      return;
    }

    if (name === 'cardholder') {
      const upperValue = value.toUpperCase();
      setFormData({ ...formData, [name]: upperValue });
      setErrors((prev) => ({
        ...prev,
        cardholder: validateCardholder(upperValue),
      }));
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {
      pan: validateCardNumber(formData.pan.replace(/\s/g, '')),
      expire: validateExpireDate(formData.expire),
      cardholder: validateCardholder(formData.cardholder),
      cvc: validateCvc(formData.cvc),
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const pid = await makePayment({
        pan: formData.pan.replace(/\s/g, ''),
        expire: formData.expire,
        cardholder: formData.cardholder,
        cvc: formData.cvc,
      });
      setPaymentId(pid);
      setPaymentStatus('process');

      const pollStatus = async () => {
        try {
          const statusResponse = await checkPaymentStatus(pid);
          if (statusResponse.status !== 'process') {
            setPaymentStatus(statusResponse.status);
          } else {
            setTimeout(pollStatus, 1000);
          }
        } catch (err) {
          setPaymentStatus('fail');
        }
      };
      pollStatus();
    } catch (err) {
      setPaymentStatus('fail');
    }
  };

  return (
    <div className={cardFormStyles.container}>
      <h2 className="text-title text-grey-1000 mb-6">Оплата банковской картой</h2>

      {error && <div className={cardFormStyles.error}>{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
          label="Номер карты"
          type="text"
          name="pan"
          value={formData.pan}
          onChange={handleChange}
          placeholder="0000 0000 0000 0000"
          error={errors.pan}
          maxLength={19}
          className="h-[84px]"
        />

        <div className="flex gap-16 h-[84px]">
          <InputField
            label="Срок действия"
            type="text"
            name="expire"
            value={formData.expire}
            onChange={handleChange}
            placeholder="ММ/ГГ"
            error={errors.expire}
            maxLength={5}
            className="flex-1"
          />

          <InputField
            label="Код"
            type="password"
            name="cvc"
            value={formData.cvc}
            onChange={handleChange}
            placeholder="***"
            error={errors.cvc}
            maxLength={3}
            className="flex-1"
          />
        </div>

        <InputField
          label="Имя владельца"
          type="text"
          name="cardholder"
          value={formData.cardholder}
          onChange={handleChange}
          placeholder="IVAN IVANOV"
          error={errors.cardholder}
          className="h-[84px]"
        />

        <button
          type="submit"
          disabled={
            Object.values(formData).every((value) => value === '') || paymentStatus === 'process'
          }
          className={cardFormStyles.submitButton}
        >
          {paymentStatus === 'process' ? (
            <>
              <svg
                className={cardFormStyles.spinner}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </>
          ) : (
            'Оплатить'
          )}
        </button>
      </form>
    </div>
  );
};
