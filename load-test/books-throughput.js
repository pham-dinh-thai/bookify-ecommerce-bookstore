import http from 'k6/http';
import { check, group, sleep } from 'k6';

// Raw-throughput variant: no JSON body parsing in checks (avoids k6 goja
// JSON cost when responses are ~50KB), so we measure the app, not k6.
//   docker run --rm --network host -i -e BASE_URL=http://localhost/api grafana/k6:latest run - < load-test/books-throughput.js

const API = __ENV.BASE_URL || 'http://backend_app:3000/api';
const TOTAL_PAGES = Number(__ENV.TOTAL_PAGES || 500);
const VUS = Number(__ENV.VUS || 200);
const DURATION = __ENV.DURATION || '25s';

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

export function popular() {
  group('cache-hit /books page1', () =>
    check(http.get(`${API}/books?page=1&limit=20`), {
      'status 200': (r) => r.status === 200,
    }),
  );
  group('cache-hit new-arrivals', () =>
    check(http.get(`${API}/new-arrivals?page=1&limit=20`), {
      'status 200': (r) => r.status === 200,
    }),
  );
  group('cache-hit on-sales', () =>
    check(http.get(`${API}/on-sales?page=1&limit=20`), {
      'status 200': (r) => r.status === 200,
    }),
  );
  sleep(0.1);
}

export function randomPages() {
  const page = Math.floor(Math.random() * TOTAL_PAGES) + 1;
  group('cache-miss random page', () =>
    check(http.get(`${API}/books?page=${page}&limit=20`), {
      'status 200': (r) => r.status === 200,
    }),
  );
  sleep(0.1);
}

export function filters() {
  group('search title', () =>
    check(http.get(`${API}/books?search=Dream`), {
      'status 200': (r) => r.status === 200,
    }),
  );
  group('genre filter', () =>
    check(http.get(`${API}/books?genre=Fiction`), {
      'status 200': (r) => r.status === 200,
    }),
  );
  group('multi-word genre', () =>
    check(http.get(`${API}/books?genre=Literary%20Fiction`), {
      'status 200': (r) => r.status === 200,
    }),
  );
  sleep(0.1);
}
