import http from 'k6/http';
import { sleep, check } from 'k6';
import { Counter } from 'k6/metrics';

export const requests = new Counter('http_reqs');

export const options = {
    stages: [
      { target: 1, duration: '20s' },
      { target: 10, duration: '0s'},
      { target: 10, duration: '20s' },
      { target: 100, duration: '0s' },
      { target: 100, duration: '20s' },
      { target: 1000, duration: '0s' },
      { target: 1000, duration: '20s'},
    ]
    // ,
    // thresholds: {
    //   http_req_duration: ['avg<50'],
    // }
  // }
};

export default function reviewsStressTest() {
  const res = http.get('http://localhost:3000/reviews');

  sleep(1);

  const checkRes = check(res, {
    '/reviews - status is 200': (r) => r.status === 200,
    '/reviews - response body exists': (r) => r.body.length !== 0,
  });
};