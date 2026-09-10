type Params = {
  activeIndex: number;
  isVisible: boolean;
  query: string;
  suggestions: string[];
};

export const getSuggestionHighlight = ({ activeIndex, isVisible, query, suggestions }: Params) => {
  if (!isVisible) return { activeSuggestionIndex: -1, highlightedSuggestionIndex: -1 };

  if (activeIndex >= 0) {
    const activeSuggestionIndex = Math.min(activeIndex, suggestions.length - 1);

    return { activeSuggestionIndex, highlightedSuggestionIndex: activeSuggestionIndex };
  }

  if (!query) return { activeSuggestionIndex: -1, highlightedSuggestionIndex: -1 };

  const lowerCaseQuery = query.toLowerCase();

  return {
    activeSuggestionIndex: -1,
    highlightedSuggestionIndex: suggestions.findIndex((suggestion) =>
      suggestion.toLowerCase().startsWith(lowerCaseQuery),
    ),
  };
};
