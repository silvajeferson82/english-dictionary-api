export type PaginationResult<T> = {
  results: T[];
  totalDocs: number;
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

export const normalizePagination = (
  page: number,
  limit: number,
): { page: number; limit: number; skip: number } => {
  const normalizedPage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
  const normalizedLimit =
    Number.isFinite(limit) && limit > 0 ? Math.floor(limit) : 10;

  return {
    page: normalizedPage,
    limit: normalizedLimit,
    skip: (normalizedPage - 1) * normalizedLimit,
  };
};

export const buildPaginationResult = <T>(
  results: T[],
  totalDocs: number,
  page: number,
  limit: number,
): PaginationResult<T> => {
  const totalPages = totalDocs > 0 ? Math.ceil(totalDocs / limit) : 0;

  return {
    results,
    totalDocs,
    page,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1 && totalPages > 0,
  };
};
