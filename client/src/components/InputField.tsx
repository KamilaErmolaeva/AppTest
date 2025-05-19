import React from 'react';

type InputFieldProps = {
  label: string;
  type: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  error?: string;
  maxLength?: number;
  className?: string;
};

export const InputField: React.FC<InputFieldProps> = ({
  label,
  type,
  name,
  value,
  onChange,
  placeholder,
  error,
  maxLength,
  className = '',
}) => {
  return (
    <div className={`${className}`}>
      <label className="text-button text-grey-800 pl-[1px]" htmlFor={label.toLowerCase()}>
        {label}
      </label>
      <input
        id={label.toLowerCase()}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        className={`shadow-none appearance-none border rounded-[10px] w-full py-2 px-3 text-gray-1000 text-[16px] leading-[20px] font-normal leading-tight focus:outline-none focus:shadow-outline  ${
          error ? 'border-error' : ''
        } placeholder:text-grey-600 placeholder:text-[16px] placeholder:leading-[20px] placeholder:font-normal`}
        autoComplete="off"
      />
      {error && <p className="text-error text-button pl-[1px] mt-[4px]">{error}</p>}
    </div>
  );
};
