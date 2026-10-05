jest.mock('../config', () => ({ API_URL: 'https://api.example.test', DEMO_MODE: false }));
import { getSearchedGifts, getClient } from '../apiUtil';
beforeEach(() => { global.fetch = jest.fn(); });
it('encodes search text as one query value', async () => {
  (fetch as jest.Mock).mockResolvedValue({ ok: true, json: async () => ({ status: 'success', data: [] }) });
  await getSearchedGifts('red & blue?');
  expect((fetch as jest.Mock).mock.calls[0][0]).toBe('https://api.example.test/gifts/search?q=red%20%26%20blue%3F');
});
it('rejects invalid client data', async () => {
  (fetch as jest.Mock).mockResolvedValue({ ok: true, json: async () => ({ status: 'success', data: { _id: 'x' } }) });
  expect((await getClient('x')).status).toBe('error');
});
it('does not treat HTTP errors as successful data', async () => {
  (fetch as jest.Mock).mockResolvedValue({ ok: false, json: async () => ({ status: 'success', data: [] }) });
  expect((await getSearchedGifts('test')).status).toBe('error');
});
