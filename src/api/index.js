const BASE_URL = 'http://localhost:3004';

const serialize = obj => {
  var str = [];
  for (var p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
    }
  return str.join('&');
};

export const ENDPOINT = {
  MERCHANTS: 'merchants',
  BIDS: 'bids'
};

export function formatRef(...args) {
  return args.reduce((accum, current) => {
    return `${accum}/${current}`;
  }, BASE_URL);
}

export function get(endpoint, params) {
  let currentResponse;
  return fetch(`${endpoint}?${serialize(params)}`)
    .then(response => {
      currentResponse = response;
      return response.json();
    })
    .then(data => {
      const headerCount = currentResponse.headers.get('X-Total-Count');
      return headerCount
        ? {
            count: parseInt(headerCount, 10),
            data
          }
        : data;
    });
}

export function remove(endpoint) {
  return fetch(endpoint, {
    method: 'delete'
  }).then(response => response.json());
}

export function edit(endpoint, data) {
  return fetch(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(response => response.json());
}

export function add(endpoint, data) {
  return fetch(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(response => response.json());
}
