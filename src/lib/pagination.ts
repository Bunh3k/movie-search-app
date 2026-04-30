export const UI_PAGE_SIZE = 6;
export const API_PAGE_SIZE = 20;

export function getApiPagination(currentPage: number) {
  const startIndex = (currentPage - 1) * UI_PAGE_SIZE;
  const apiPage = Math.floor(startIndex / API_PAGE_SIZE) + 1;
  const startOffset = startIndex % API_PAGE_SIZE;

  return {
    startIndex,
    apiPage,
    startOffset,
  };
}

export function getVisibleItems<T>(results: T[], startOffset: number) {
  return results.slice(startOffset, startOffset + UI_PAGE_SIZE);
}

export function shouldFetchNextPage(
  visibleLength: number,
  startIndex: number,
  totalResults: number,
) {
  return (
    visibleLength < UI_PAGE_SIZE && startIndex + visibleLength < totalResults
  );
}
