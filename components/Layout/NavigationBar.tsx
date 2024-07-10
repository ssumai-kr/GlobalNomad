import Image from 'next/image';
import Link from 'next/link';
import Logo from '@/public/icon/logo_small.svg';
import notificationIcon from '@/public/icon/icon_notification.svg';
import { useUserData } from '@/hooks/useUserData';
import { useEffect, useRef, useState } from 'react';
import NavigationDropdown from '../NavigationDropdown/NavigationDropdown';

export default function NavigationBar() {
  const userData = useUserData();
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    if (isDropdownOpen) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <div className="flex h-[70px] justify-between pl-[369px] pr-[351px] t:px-[24px] m:px-[24px]  border-b border-var-gray3 border-solid ">
      <div className="flex items-center">
        <Link href="/">
          <Image src={Logo} alt="로고 아이콘" />
        </Link>
      </div>
      {userData.id ? (
        <div className="flex items-center gap-[25px]">
          <button>
            <Image src={notificationIcon} alt="알림 아이콘" />
          </button>
          <div
            className="flex relative items-center gap-[10px] border-l-2 cursor-pointer border-var-gray3 border-solid pl-[25px] m:pl-[12px]"
            ref={dropdownRef}
            onClick={toggleDropdown}
          >
            {isDropdownOpen && <NavigationDropdown />}
            {userData.profileImageUrl ? (
              <Image
                src={userData.profileImageUrl}
                width={32}
                height={32}
                className="h-[32px] w-[32px] rounded-full bg-var-gray3"
                alt="유저 프로필사진"
              />
            ) : (
              <div className="h-[32px] w-[32px] rounded-full bg-var-gray3" />
            )}
            <p className="text-[14px]">{userData.nickname}</p>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-[25px]">
          <Link href="/login" className="text-[14px]">
            로그인
          </Link>
          <Link href="/signup" className="text-[14px]">
            회원가입
          </Link>
        </div>
      )}
    </div>
  );
}
