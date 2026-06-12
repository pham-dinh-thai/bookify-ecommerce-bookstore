import http from 'k6/http';
import { check } from 'k6';
import { Counter } from 'k6/metrics';

const target = __ENV.TARGET || 'http://backend_app:3000';
const rpm = Number(__ENV.RPM || 50000);
const duration = __ENV.DURATION || '1m';
const preAllocatedVUs = Number(__ENV.PRE_ALLOCATED_VUS || 500);
const maxVUs = Number(__ENV.MAX_VUS || 2000);

const status200 = new Counter('status_200');
const status0 = new Counter('status_0');
const status4xx = new Counter('status_4xx');
const status429 = new Counter('status_429');
const status5xx = new Counter('status_5xx');
const statusOther = new Counter('status_other');

const routes = [
  '/api/books?page=1&limit=12',
  '/api/books?page=2&limit=12',
  '/api/books?search=a&page=1&limit=12',
  '/api/authors?page=1&limit=20',
  '/api/genres?page=1&limit=20',
  '/api/publishers?page=1&limit=20',
  '/api/best-seller',
  '/api/new-arrivals',
  '/api/on-sales',
  '/api/shop-navigation',
];

export const options = {
  scenarios: {
    target_rpm: {
      executor: 'constant-arrival-rate',
      rate: rpm,
      timeUnit: '1m',
      duration,
      preAllocatedVUs,
      maxVUs,
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<1000'],
  },
};

export default function () {
  const path = routes[Math.floor(Math.random() * routes.length)];
  const res = http.get(`${target}${path}`, {
    tags: { endpoint: path.split('?')[0] },
  });

  if (res.status === 200) status200.add(1);
  if (res.status === 0) status0.add(1);
  if (res.status >= 400 && res.status < 500) status4xx.add(1);
  if (res.status === 429) status429.add(1);
  if (res.status >= 500) status5xx.add(1);
  if (
    res.status !== 0 &&
    !(res.status >= 200 && res.status < 400) &&
    !(res.status >= 400 && res.status < 500) &&
    !(res.status >= 500)
  ) {
    statusOther.add(1);
  }

  check(res, {
    '2xx/3xx': (r) => r.status >= 200 && r.status < 400,
  });
}
