import { UserAvatar } from '@/entities/user/ui/user-avatar';

type Props = {
  name: string;
  profileImageUrl: string;
  followerCount: number;
  followingCount: number;
};

export function UserProfileInfo({ name, profileImageUrl, followerCount, followingCount }: Props) {
  return (
    <div className="flex min-w-0 items-center gap-4">
      <UserAvatar name={name} profileImageUrl={profileImageUrl} className="h-13 w-13 shrink-0" />
      <div className="min-w-0">
        <h1 className="truncate text-xl font-bold">{name}</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          팔로워 {followerCount} · 팔로잉 {followingCount}
        </p>
      </div>
    </div>
  );
}
