import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter } from 'k6/metrics';

const target = __ENV.TARGET || 'http://nginx';
const maxVus = Number(__ENV.MAX_VUS || 1000);
const ramp = __ENV.RAMP || '30s';
const hold = __ENV.HOLD || '1m';
const sleepMin = Number(__ENV.SLEEP_MIN || 1);
const sleepMax = Number(__ENV.SLEEP_MAX || 3);

const status200 = new Counter('status_200');
const status429 = new Counter('status_429');
const status5xx = new Counter('status_5xx');

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
    high_vu: {
      executor: 'ramping-vus',
      stages: [
        { duration: ramp, target: Math.floor(maxVus * 0.25) },
        { duration: ramp, target: Math.floor(maxVus * 0.5) },
        { duration: ramp, target: maxVus },
        { duration: hold, target: maxVus },
        { duration: '20s', target: 0 },
      ],
      gracefulRampDown: '10s',
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<1000'],
    http_req_failed: ['rate<0.50'],
  },
};

export default function () {
  const path = routes[Math.floor(Math.random() * routes.length)];
  const res = http.get(`${target}${path}`, {
    tags: { endpoint: path.split('?')[0] },
  });

  if (res.status === 200) status200.add(1);
  if (res.status === 429) status429.add(1);
  if (res.status >= 500) status5xx.add(1);

  check(res, {
    '2xx/3xx/429': (r) =>
      (r.status >= 200 && r.status < 400) || r.status === 429,
  });

  sleep(sleepMin + Math.random() * Math.max(0, sleepMax - sleepMin));
}
