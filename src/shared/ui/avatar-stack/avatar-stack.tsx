import type { ComponentProps } from 'react';

import { cn } from '@/shared/lib/cn';
import { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage } from '@/shared/ui/avatar';

type AvatarProfile = {
  id: string;
  name: string;
  imageUrl: string;
};

type AvatarShape = 'circle' | 'rounded';

type Props = ComponentProps<typeof AvatarGroup> & {
  avatars: AvatarProfile[];
  maxVisibleCount?: number;
  shape?: AvatarShape;
  size?: ComponentProps<typeof Avatar>['size'];
};

const DEFAULT_MAX_VISIBLE_COUNT = 3;

const SHAPE_CLASS_NAMES = {
  circle: { avatar: '', image: '', fallback: '', count: '' },
  rounded: {
    avatar: 'rounded-lg after:rounded-lg',
    image: 'rounded-lg',
    fallback: 'rounded-lg',
    count: 'rounded-lg',
  },
} satisfies Record<AvatarShape, { avatar: string; image: string; fallback: string; count: string }>;

export function AvatarStack({
  avatars,
  maxVisibleCount = DEFAULT_MAX_VISIBLE_COUNT,
  shape = 'circle',
  size,
  className,
  ...props
}: Props) {
  const shapeClassNames = SHAPE_CLASS_NAMES[shape];
  const visibleAvatars = avatars.slice(0, maxVisibleCount);
  const hiddenCount = avatars.length - visibleAvatars.length;

  return (
    <AvatarGroup className={cn('items-center', className)} {...props}>
      {visibleAvatars.map((avatar) => {
        const hasImageUrl = avatar.imageUrl.trim().length > 0;
        const fallbackText = avatar.name.charAt(0).toUpperCase() || '?';

        return (
          <Avatar key={avatar.id} size={size} className={shapeClassNames.avatar}>
            {hasImageUrl && <AvatarImage src={avatar.imageUrl} alt={avatar.name} className={shapeClassNames.image} />}
            <AvatarFallback className={shapeClassNames.fallback}>{fallbackText}</AvatarFallback>
          </Avatar>
        );
      })}

      {hiddenCount > 0 && <AvatarGroupCount className={shapeClassNames.count}>{`+${hiddenCount}`}</AvatarGroupCount>}
    </AvatarGroup>
  );
}
