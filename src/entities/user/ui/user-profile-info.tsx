import { UserAvatar } from '@/entities/user/ui/user-avatar';

type Props = {
  name: string;
  profileImageUrl: string;
  followerCount: number;
  followingCount: number;
  onFollowersClick: () => void;
  onFollowingsClick: () => void;
};

export function UserProfileInfo({
  name,
  profileImageUrl,
  followerCount,
  followingCount,
  onFollowersClick,
  onFollowingsClick,
}: Props) {
  return (
    <div className="flex min-w-0 items-center gap-4">
      <UserAvatar name={name} profileImageUrl={profileImageUrl} className="h-13 w-13 shrink-0" />
      <div className="min-w-0">
        <h1 className="truncate text-xl font-bold">{name}</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          <button type="button" className="hover:text-foreground transition-colors" onClick={onFollowersClick}>
            팔로워 {followerCount}
          </button>
          <span aria-hidden="true"> · </span>
          <button type="button" className="hover:text-foreground transition-colors" onClick={onFollowingsClick}>
            팔로잉 {followingCount}
          </button>
        </p>
      </div>
    </div>
  );
}
