'use client';

import { FileText, LogOut, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { UserAvatar } from '@/entities/user';
import { requestLogout } from '@/features/auth/lib/logout';
import { useOpenSettingModal } from '@/features/setting';
import type { UserResponse } from '@/shared/api/generated';
import { cn } from '@/shared/lib/cn';
import {
  DropdownContent,
  DropdownDivider,
  DropdownItem,
  DropdownProvider,
  DropdownTrigger,
} from '@/shared/ui/dropdown';

type Props = {
  user: UserResponse;
};

export function UserMenu({ user }: Props) {
  const router = useRouter();
  const openSettingModal = useOpenSettingModal();

  const handleMyPageClick = () => {
    router.push(`/users/${user.id}`);
  };

  const handleLogout = async () => {
    try {
      await requestLogout();
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <DropdownProvider className="flex shrink-0">
      <DropdownTrigger className={cn('gap-2 transition-opacity duration-200', 'hover:opacity-80')}>
        <UserAvatar name={user.name} profileImageUrl={user.profileImageUrl} className="h-8 w-8" />
        <p className={cn('hidden text-sm font-medium', 'md:inline')}>{user.name}</p>
      </DropdownTrigger>
      <DropdownContent align="end" className="w-52">
        <div className="px-3 py-1">
          <p className="truncate text-sm font-semibold">{user.name}</p>
          <p className="text-muted-foreground truncate pt-1 text-xs">{user.email}</p>
        </div>
        <DropdownDivider />
        <DropdownItem onClick={handleMyPageClick}>
          <FileText className="h-4 w-4" />
          <p>내 글</p>
        </DropdownItem>
        <DropdownItem onClick={openSettingModal}>
          <Settings className="h-4 w-4" />
          <p>설정</p>
        </DropdownItem>
        <DropdownDivider />
        <DropdownItem onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
          <p>로그아웃</p>
        </DropdownItem>
      </DropdownContent>
    </DropdownProvider>
  );
}
