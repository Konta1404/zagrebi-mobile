import { createCoverage, createRequestGate } from '../scratch';
it('does not count a diagonal bounding box as a cleared card', () => {
  const coverage = createCoverage(400, 200);
  coverage.mark(0, 0, 400, 200);
  expect(coverage.percentage()).toBeLessThan(40);
});
it('covers repeated horizontal strokes and resets', () => {
  const coverage = createCoverage(400, 200);
  for (let y = 0; y <= 200; y += 25) coverage.mark(0, y, 400, y);
  expect(coverage.percentage()).toBeGreaterThan(95);
  coverage.reset(); expect(coverage.percentage()).toBe(0);
});
it('suppresses duplicate requests until a response arrives', async () => {
  const gate = createRequestGate();
  let resolve!: (value: string) => void;
  const request = jest.fn(() => new Promise<string>(r => { resolve = r; }));
  const first = gate.run(request);
  expect(await gate.run(request)).toBeUndefined();
  expect(request).toHaveBeenCalledTimes(1);
  resolve('result'); expect(await first).toBe('result'); expect(gate.pending).toBe(false);
});
it('ignores stale responses after unmount/reset', async () => {
  const gate = createRequestGate();
  let resolve!: (value: string) => void;
  const result = gate.run(() => new Promise<string>(r => { resolve = r; }));
  gate.invalidate(); resolve('obsolete'); expect(await result).toBeUndefined();
});
it('allows retry after a request rejects', async () => {
  const gate = createRequestGate();
  await expect(gate.run(() => Promise.reject(new Error('offline')))).rejects.toThrow('offline');
  expect(await gate.run(async () => 'retry')).toBe('retry');
});
