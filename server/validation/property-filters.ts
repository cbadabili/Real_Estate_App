import { z } from 'zod';
import type { PropertyFilters } from '../repositories/property-repository';

const normalizeValue = (value: unknown) => {
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
};

const optionalNumber = (schema: z.ZodNumber) =>
  z.preprocess((value) => {
    const candidate = normalizeValue(value);
    if (candidate === undefined || candidate === null) {
      return undefined;
    }

    if (typeof candidate === 'string') {
      const trimmed = candidate.trim();
      if (trimmed.length === 0) {
        return undefined;
      }
      const numeric = Number(trimmed);
      return Number.isFinite(numeric) ? numeric : candidate;
    }

    const numeric = Number(candidate);
    return Number.isFinite(numeric) ? numeric : candidate;
  }, schema.optional());

const optionalString = () =>
  z.preprocess((value) => {
    const candidate = normalizeValue(value);
    if (candidate === undefined || candidate === null) {
      return undefined;
    }
    const trimmed = String(candidate).trim();
    return trimmed.length === 0 ? undefined : trimmed;
  }, z.string().optional());

const optionalBoolean = () =>
  z.preprocess((value) => {
    const candidate = normalizeValue(value);
    if (candidate === undefined || candidate === null) {
      return undefined;
    }
    if (typeof candidate === 'boolean') {
      return candidate;
    }
    const normalized = String(candidate).trim();
    if (normalized.length === 0) {
      return undefined;
    }
    const lowered = normalized.toLowerCase();
    if (["true", "1", "yes"].includes(lowered)) {
      return true;
    }
    if (["false", "0", "no"].includes(lowered)) {
      return false;
    }
    return candidate;
  }, z.boolean().optional());

// Include legacy aliases alongside canonical sort keys so existing clients keep working.
const sortByEnum = [
  'price',
  'date',
  'size',
  'bedrooms',
  'price_low',
  'price_high',
  'newest',
] as const;

const sortOrderEnum = ['asc', 'desc'] as const;

const propertyFilterSchema = z
  .object({
    minPrice: optionalNumber(z.number().min(0)),
    maxPrice: optionalNumber(z.number().min(0)),
    propertyType: optionalString(),
    minBedrooms: optionalNumber(z.number().int().min(0)),
    minBathrooms: optionalNumber(z.number().min(0)),
    minSquareFeet: optionalNumber(z.number().int().min(0)),
    maxSquareFeet: optionalNumber(z.number().int().min(0)),
    city: optionalString(),
    state: optionalString(),
    zipCode: optionalString(),
    location: optionalString(),
    listingType: optionalString(),
    status: optionalString(),
    limit: optionalNumber(z.number().int().min(1).max(100)),
    offset: optionalNumber(z.number().int().min(0)),
    sortBy: z
      .preprocess((value) => {
        const candidate = normalizeValue(value);
        if (candidate === undefined || candidate === null || candidate === '') {
          return undefined;
        }
        return String(candidate).trim().toLowerCase();
      }, z.enum(sortByEnum).optional()),
    sortOrder: z
      .preprocess((value) => {
        const candidate = normalizeValue(value);
        if (candidate === undefined || candidate === null || candidate === '') {
          return undefined;
        }
        return String(candidate).trim().toLowerCase();
      }, z.enum(sortOrderEnum).optional()),
    requireValidCoordinates: optionalBoolean(),
    searchTerm: optionalString(),
  })
  .strip();

type PropertyFilterInput = z.infer<typeof propertyFilterSchema>;

export const parsePropertyFilters = (query: unknown): PropertyFilters => {
  const parsed = propertyFilterSchema.parse(query) as PropertyFilterInput;

  const definedEntries = Object.entries(parsed).filter(([, value]) => value !== undefined);

  const filtered = Object.fromEntries(definedEntries) as Partial<PropertyFilters>;

  return {
    status: 'active',
    ...filtered,
  };
};
