import http from "k6/http";
import { Counter } from "k6/metrics";

const status429 = new Counter("status_429");
const status200 = new Counter("status_200");

export const options = {
  scenarios: {
    books_rps: {
      executor: "constant-arrival-rate",
      rate: 200,
      timeUnit: "1s",
      duration: "1m",
      preAllocatedVUs: 50,
      maxVUs: 100,
    },
  },
};

export default function () {
  const res = http.get("http://nginx/api/books");

  if (res.status === 200) status200.add(1);
  if (res.status === 429) status429.add(1);
}
