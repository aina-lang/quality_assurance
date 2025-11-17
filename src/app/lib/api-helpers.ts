const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

export type PaginationParams = {
  page: number;
  pageSize: number;
  offset: number;
  search?: string;
};

type SortOrder = "asc" | "desc";

export interface SortOptions {
  allowedFields: Record<string, string>;
  defaultField: string;
  defaultOrder?: SortOrder;
}

export type FilterOperator = "eq" | "like" | "gte" | "lte";

export interface FilterConfig {
  column: string;
  operator?: FilterOperator;
}

export interface ParsedFilters {
  clauses: string[];
  params: (string | number)[];
}

export function getPaginationParams(
  searchParams: URLSearchParams,
  options?: { defaultPageSize?: number; maxPageSize?: number }
): PaginationParams {
  const defaultSize = options?.defaultPageSize ?? DEFAULT_PAGE_SIZE;
  const maxSize = options?.maxPageSize ?? MAX_PAGE_SIZE;

  const rawPage = Number(searchParams.get("page"));
  const rawPageSize = Number(searchParams.get("pageSize"));

  const page = Number.isFinite(rawPage) && rawPage > 0 ? Math.floor(rawPage) : DEFAULT_PAGE;

  let pageSize =
    Number.isFinite(rawPageSize) && rawPageSize > 0
      ? Math.floor(rawPageSize)
      : defaultSize;

  pageSize = Math.min(pageSize, maxSize);

  const offset = (page - 1) * pageSize;
  const searchValue = searchParams.get("search")?.trim();

  return {
    page,
    pageSize,
    offset,
    search: searchValue ? searchValue : undefined,
  };
}

export function buildSearchClause(
  fields: string[],
  search?: string
): { clause: string; params: string[] } {
  if (!search || !fields.length) {
    return { clause: "", params: [] };
  }

  const escaped = escapeLikeValue(search);
  const pattern = `%${escaped}%`;
  const clause = `(${fields.map((field) => `${field} LIKE ?`).join(" OR ")})`;
  const params = Array(fields.length).fill(pattern);

  return { clause, params };
}

export function getFilterValues(
  searchParams: URLSearchParams,
  allowedFilters: string[]
): Record<string, string> {
  return allowedFilters.reduce<Record<string, string>>((acc, key) => {
    const value = searchParams.get(key)?.trim();
    if (value) {
      acc[key] = value;
    }
    return acc;
  }, {});
}

export function getSortParams(
  searchParams: URLSearchParams,
  options: SortOptions
): { column: string; order: "ASC" | "DESC"; orderBy: string } {
  const requestedField = searchParams.get("sortField") ?? "";
  const requestedOrder = (searchParams.get("sortOrder") ?? "").toLowerCase() as SortOrder;
  const normalizedOrder: "ASC" | "DESC" =
    requestedOrder === "asc"
      ? "ASC"
      : requestedOrder === "desc"
        ? "DESC"
        : options.defaultOrder === "asc"
          ? "ASC"
          : "DESC";

  const fallbackColumn =
    options.allowedFields[options.defaultField] ?? options.defaultField;
  const column =
    options.allowedFields[requestedField] ?? fallbackColumn;

  return {
    column,
    order: normalizedOrder,
    orderBy: `${column} ${normalizedOrder}`,
  };
}

export function parseFilters(
  searchParams: URLSearchParams,
  config: Record<string, FilterConfig>
): ParsedFilters {
  const raw = searchParams.get("filters");
  if (!raw) {
    return { clauses: [], params: [] };
  }

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return { clauses: [], params: [] };
    }

    const clauses: string[] = [];
    const params: (string | number)[] = [];

    for (const filter of parsed) {
      if (
        !filter ||
        typeof filter !== "object" ||
        !filter.field ||
        filter.value === undefined ||
        filter.value === null ||
        filter.value === ""
      ) {
        continue;
      }

      const fieldConfig = config[filter.field];
      if (!fieldConfig) continue;

      const operator = (filter.operator ?? fieldConfig.operator ?? "eq") as FilterOperator;

      switch (operator) {
        case "like": {
          clauses.push(`${fieldConfig.column} LIKE ?`);
          params.push(`%${escapeLikeValue(String(filter.value))}%`);
          break;
        }
        case "gte": {
          clauses.push(`${fieldConfig.column} >= ?`);
          params.push(filter.value);
          break;
        }
        case "lte": {
          clauses.push(`${fieldConfig.column} <= ?`);
          params.push(filter.value);
          break;
        }
        case "eq":
        default: {
          clauses.push(`${fieldConfig.column} = ?`);
          params.push(filter.value);
          break;
        }
      }
    }

    return { clauses, params };
  } catch {
    return { clauses: [], params: [] };
  }
}

function escapeLikeValue(value: string) {
  return value.replace(/[%_]/g, (char) => `\\${char}`);
}

