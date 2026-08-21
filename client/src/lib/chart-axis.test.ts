import { describe, expect, it } from 'vitest'
import { categoryAxisProps, truncateAxisLabel, MAX_AXIS_LABEL } from './chart-axis'

describe('categoryAxisProps (#890)', () => {
  it('forces every tick so recharts never skips a provider label', () => {
    // The default 'preserveStartEnd' interval is exactly what hid the middle
    // provider names; 0 means "render a tick for every category".
    expect(categoryAxisProps().interval).toBe(0)
  })

  it('rotates labels and reserves vertical room for them', () => {
    const p = categoryAxisProps()
    expect(p.angle).not.toBe(0)
    expect(p.textAnchor).toBe('end')
    expect(p.height).toBeGreaterThan(30)
  })

  it('truncates over-long labels but leaves short ones alone', () => {
    expect(truncateAxisLabel('groq')).toBe('groq')
    expect(truncateAxisLabel('x'.repeat(MAX_AXIS_LABEL))).toBe('x'.repeat(MAX_AXIS_LABEL))
    const long = truncateAxisLabel('anthropic-compatible-very-long-relay-host')
    expect(long.length).toBe(MAX_AXIS_LABEL)
    expect(long.endsWith('…')).toBe(true)
  })

  it('truncation is stable (idempotent) so a second pass changes nothing', () => {
    const once = truncateAxisLabel('anthropic-compatible-very-long-relay-host')
    expect(truncateAxisLabel(once)).toBe(once)
  })
})
