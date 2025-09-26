/* global __ENV, URLSearchParams */
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend } from 'k6/metrics';

const BASE_URL = __ENV.K6_BASE_URL || 'http://localhost:5000';

export const options = {
  stages: [
    { duration: '30s', target: 20 },
    { duration: '2m', target: 50 },
    { duration: '30s', target: 0 }
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<1200', 'p(99)<2000'],
    search_tti: ['p(95)<1200']
  }
};

const searchTTI = new Trend('search_tti');

const filters = [
  { city: 'Gaborone', minBedrooms: 3, maxPrice: 1500000, propertyType: 'house' },
  { city: 'Francistown', minBedrooms: 2, maxPrice: 800000, propertyType: 'apartment' },
  { city: 'Maun', minBedrooms: 4, maxPrice: 2500000, propertyType: 'house' },
  { city: 'Tlokweng', minBedrooms: 3, maxPrice: 6000, propertyType: 'house', listingType: 'rent' }
];

export default function () {
  const payload = filters[Math.floor(Math.random() * filters.length)];
  const params = new URLSearchParams({
    ...Object.fromEntries(
      Object.entries(payload).map(([key, value]) => [key, String(value)])
    ),
    sortBy: Math.random() > 0.5 ? 'price' : 'date',
    sortOrder: Math.random() > 0.5 ? 'asc' : 'desc',
    limit: '20'
  }).toString();

  const start = Date.now();
  const res = http.get(`${BASE_URL}/api/properties?${params}`);
  const duration = Date.now() - start;
  searchTTI.add(duration);

  const body = res.json();
  check(res, {
    'status is 200': r => r.status === 200,
    'payload is json array': () => Array.isArray(body),
    'fast enough for SLO': () => duration < 1200
  });

  sleep(Math.random() * 2);
}
