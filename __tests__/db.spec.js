const db = require('../db');
const fs = require('fs');
jest.mock('fs');

describe('db', () => {
  afterEach((() => {
    fs.clearMocks();
  }));

  it('can read', async () => {
    const mockData = [{ title: 'mock', done: true }];
    fs.setReadMock('/readMock', null, JSON.stringify(mockData));
    const data = await db.read('/readMock');
    expect(data).toStrictEqual(mockData);
  });
  it('can write', () => {
    let writeDb;
    fs.setWriteMock('/writeMock', (path, data, callback) => {
      writeDb = data;
      callback(null);
    });
    const mockData = [{ title: 'mock', done: true }];
    db.write(mockData, '/writeMock');
    expect(writeDb).toBe(JSON.stringify(mockData) + '\n');
  });
});