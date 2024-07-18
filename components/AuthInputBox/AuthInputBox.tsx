import { inputBoxProps } from './AuthInputBox.types';
import Image from 'next/image';
import { useState } from 'react';

export default function AuthInputBox({
  label,
  type = 'text',
  placeholder,
  name,
  validation,
  register,
  errors,
  eyeIconActive = false,
  handleChange,
}: inputBoxProps) {
  const [isEyeOpen, setIsEyeOpen] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsEyeOpen(!isEyeOpen);
  };

  if (type === 'checkbox') {
    return (
      <div className="flex gap-[10px]">
        <input type="checkbox" id={name} onChange={handleChange} />
        <label htmlFor={name}>{placeholder}</label>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[8px] text-[16px] relative">
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        className={`border ${errors[name] ? 'border-var-red2' : ''} py-[16px] px-[20px] rounded-md border-var-gray6 outline-none dark:bg-var-dark3 dark:border-none`}
        type={isEyeOpen ? 'text' : type}
        placeholder={placeholder}
        {...register(name, validation)}
      />
      {/* 에러 메세지 */}
      {errors[name] && (
        <span className="text-[12px] text-var-red2">
          {errors[name]?.message}
        </span>
      )}
      {/* 비밀번호 보기 버튼 */}
      {eyeIconActive && (
        <button type="button" onClick={handleClick}>
          <Image
            width={24}
            height={24}
            className="absolute right-[20px] top-[50px]"
            src={
              isEyeOpen
                ? '/icon/btn_visibility_on_.svg'
                : '/icon/btn_visibility_off.png'
            }
            alt="비밀번호_확인_버튼"
          />
        </button>
      )}
    </div>
  );
}
