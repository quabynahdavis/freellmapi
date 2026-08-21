// recharts XAxis props for the category (provider / agent / error) bar charts
// on the analytics page.
//
// recharts' default `interval` is 'preserveStartEnd': when there are more
// categories than fit in the width, it silently DROPS the middle ticks so the
// labels don't overlap. The visible result is the #890 complaint — only a few
// provider names render, the rest are only visible on hover, and the bars no
// longer line up with the labels the user can actually see (a bar with no label
// looks like a different provider than it is).
//
// The fix is to force EVERY tick (`interval={0}`) and rotate + truncate the
// labels so they fit without overlapping. These are exactly the props the
// category charts need on top of the shared `tick` style; the timeline
// (timestamp) charts are time series and don't need them.

export interface CategoryAxisProps {
  /** Show every category tick instead of letting recharts skip the middle ones. */
  interval: 0
  /** Tilt the labels so long provider names don't collide horizontally. */
  angle: number
  /** Anchor rotated labels to their tick. */
  textAnchor: 'end'
  /** Vertical room reserved for the (rotated) labels under the plot. */
  height: number
  /** Truncate over-long labels so the rotated ticks stay legible. */
  tickFormatter: (value: string) => string
}

// Longest label shown in full; anything longer is elided with an ellipsis.
// 18 chars at 11px rotated ~30° fits comfortably in the reserved axis height.
export const MAX_AXIS_LABEL = 18

export function truncateAxisLabel(value: string): string {
  if (value.length <= MAX_AXIS_LABEL) return value
  return value.slice(0, MAX_AXIS_LABEL - 1) + '…'
}

/** The XAxis props that make a category chart show all of its labels. */
export function categoryAxisProps(): CategoryAxisProps {
  return {
    interval: 0,
    angle: -30,
    textAnchor: 'end',
    height: 56,
    tickFormatter: truncateAxisLabel,
  }
}
