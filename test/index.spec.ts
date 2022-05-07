import { describe, it, expect } from 'vitest';

describe('index', () => {
  it('noop', () => {
    expect('Hello').toMatch('Hello');
  });
});
