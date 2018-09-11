import { ENDPOINT, formatRef, get, remove, edit, add } from './index';

test('should format the endpoint ref correctly', () => {
  expect(formatRef(ENDPOINT.MERCHANTS)).toEqual(
    'http://localhost:3004/merchants'
  );
});

test('should return response with count attribute from GET request correctly', async () => {
  global.fetch = jest.fn().mockImplementation(() => {
    return new Promise(resolve => {
      return resolve({
        headers: {
          get: () => {
            return 1;
          }
        },
        json: () => {
          return new Promise(resolveJson => {
            return resolveJson([{}]);
          });
        }
      });
    });
  });

  const result = await get(formatRef(ENDPOINT.MERCHANTS), { _page: 1 });

  expect(result).toEqual({ count: 1, data: [{}] });
});

test('should return response without count attribute from GET request correctly', async () => {
  global.fetch = jest.fn().mockImplementation(() => {
    return new Promise(resolve => {
      return resolve({
        headers: {
          get: () => {
            return 0;
          }
        },
        json: () => {
          return new Promise(resolveJson => {
            return resolveJson([]);
          });
        }
      });
    });
  });

  const result = await get(formatRef(ENDPOINT.MERCHANTS), { _page: 1 });

  expect(result).toEqual([]);
});

test('should return response from DELETE request correctly', async () => {
  global.fetch = jest.fn().mockImplementation(() => {
    return new Promise(resolve => {
      return resolve({
        json: () => {
          return new Promise(resolveJson => {
            return resolveJson({});
          });
        }
      });
    });
  });

  const result = await remove(formatRef(ENDPOINT.MERCHANTS));

  expect(result).toEqual({});
});

test('should return response from PUT request correctly', async () => {
  const result = await edit(formatRef(ENDPOINT.MERCHANTS, {}));

  expect(result).toEqual({});
});

test('should return response from POST request correctly', async () => {
  const result = await add(formatRef(ENDPOINT.MERCHANTS, {}));

  expect(result).toEqual({});
});

afterEach(() => jest.resetModules());
