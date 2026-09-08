'use client';

import { cn } from '@/shared/lib/cn';
import { Button } from '@/shared/ui/button';

type Props = {
  highlightedIndex: number;
  onSuggestionSelect: (suggestion: string) => void;
  suggestions: string[];
};

export function PostWriteSuggestionList({ highlightedIndex, onSuggestionSelect, suggestions }: Props) {
  return (
    <div className="border-border bg-background/95 shadow-floating-lg absolute top-full left-0 z-20 mt-3 w-full max-w-104 overflow-hidden rounded-2xl border backdrop-blur-sm">
      <ul className="py-2">
        {suggestions.map((suggestion, index) => {
          const isHighlighted = index === highlightedIndex;

          return (
            <li key={suggestion}>
              <Button
                onMouseDown={(event) => {
                  event.preventDefault();
                  onSuggestionSelect(suggestion);
                }}
                className={cn(
                  'w-full justify-start rounded-none px-4 text-sm font-normal',
                  isHighlighted ? 'text-suggestion-active-foreground font-semibold' : 'text-muted-foreground',
                )}
                size="md"
                tabIndex={-1}
                variant="ghost"
              >
                <span className="truncate">{suggestion}</span>
              </Button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
