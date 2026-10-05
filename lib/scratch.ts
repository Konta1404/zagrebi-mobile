// Serializes reward requests and ignores responses from an obsolete card/unmount.
export function createRequestGate() {
  let pending = false;
  let generation = 0;
  return {
    get pending() { return pending; },
    invalidate() { generation++; pending = false; },
    async run<T>(request: () => Promise<T>): Promise<T | undefined> {
      if (pending) return undefined;
      pending = true;
      const started = generation;
      try {
        const value = await request();
        return started === generation ? value : undefined;
      } finally { if (started === generation) pending = false; }
    },
  };
}

// Sample a fixed grid of pixel centers inside the stroke, not its bounding box.
// This is a bounded approximation of cleared area, not exact pixel coverage.
export function createCoverage(width: number, height: number, radius = 25) {
  const columns = 40, rows = 20;
  const cleared = new Set<number>();
  return {
    mark(ax: number, ay: number, bx: number, by: number) {
      if (width <= 0 || height <= 0) return;
      const dx = bx - ax, dy = by - ay, length = dx * dx + dy * dy;
      for (let row = 0; row < rows; row++) for (let col = 0; col < columns; col++) {
        const x = (col + 0.5) * width / columns, y = (row + 0.5) * height / rows;
        const t = length ? Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / length)) : 0;
        if ((x - ax - t * dx) ** 2 + (y - ay - t * dy) ** 2 <= radius ** 2) cleared.add(row * columns + col);
      }
    },
    percentage() { return cleared.size / (columns * rows) * 100; },
    reset() { cleared.clear(); },
  };
}
