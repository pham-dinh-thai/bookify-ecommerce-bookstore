import http from 'k6/http';
import { check, group, sleep } from 'k6';

// Bookify load test - collection pages with 10k books.
//
// Run (backend directly, bypass nginx rate limit of 30 r/s per IP):
//   docker run --rm --network bookify-ecommerce-bookstore_default -i grafana/k6:latest run - < load-test/books.js
//
// Run (through nginx, respects the real 30 r/s per-IP API rate limit -> 429 above it):
//   docker run --rm --network host -i -e BASE_URL=http://localhost/api grafana/k6:latest run - < load-test/books.js
//
// Quick smoke:
//   ... -e VUS=2 -e DURATION=5s ...

const API = __ENV.BASE_URL || 'http://backend_app:3000/api';
const TOTAL_PAGES = Number(__ENV.TOTAL_PAGES || 500);
const VUS = Number(__ENV.VUS || 10);
const DURATION = __ENV.DURATION || '30s';

export const options = {
  scenarios: {
    popular: {
      executor: 'constant-vus',
      vus: VUS,
      duration: DURATION,
      exec: 'popular',
    },
    randomPages: {
      executor: 'constant-vus',
      vus: VUS,
      duration: DURATION,
      exec: 'randomPages',
    },
    filters: {
      executor: 'constant-vus',
      vus: Math.max(1, Math.floor(VUS / 2)),
      duration: DURATION,
      exec: 'filters',
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<800', 'p(99)<2000'],
  },
};

function ok(res) {
  check(res, {
    'status 200': (r) => r.status === 200,
    'has books array': (r) => r.json().books !== undefined,
  });
}

export function popular() {
  group('cache-hit /books page1', () =>
    ok(http.get(`${API}/books?page=1&limit=20`)),
  );
  group('cache-hit new-arrivals', () =>
    ok(http.get(`${API}/new-arrivals?page=1&limit=20`)),
  );
  group('cache-hit on-sales', () =>
    ok(http.get(`${API}/on-sales?page=1&limit=20`)),
  );
  sleep(0.1);
}

export function randomPages() {
  const page = Math.floor(Math.random() * TOTAL_PAGES) + 1;
  group('cache-miss random page', () =>
    ok(http.get(`${API}/books?page=${page}&limit=20`)),
  );
  sleep(0.1);
}

export function filters() {
  group('search title', () => ok(http.get(`${API}/books?search=Dream`)));
  group('genre filter', () => ok(http.get(`${API}/books?genre=Fiction`)));
  group('multi-word genre', () =>
    ok(http.get(`${API}/books?genre=Literary%20Fiction`)),
  );
  sleep(0.1);
}
