export interface RadarSeries {
  id: string;
  name: string;
  color: string;
  values: number[]; // 每个轴一个值，0–10 区间
}

export interface RadarChartProps {
  axisLabels: string[];
  series: RadarSeries[];
  /** viewBox 边长，默认 180 */
  size?: number;
  className?: string;
}

function polygon(values: number[], size: number, maxValue = 10): string {
  const center = size / 2;
  const radius = size * 0.38;
  return values
    .map((v, i) => {
      const angle = -Math.PI / 2 + (Math.PI * 2 * i) / values.length;
      const r = radius * (v / maxValue);
      return `${center + Math.cos(angle) * r},${center + Math.sin(angle) * r}`;
    })
    .join(' ');
}

function gridPolygon(step: number, count: number, size: number): string {
  const center = size / 2;
  const radius = size * 0.38 * step;
  return Array.from({ length: count }, (_, i) => {
    const angle = -Math.PI / 2 + (Math.PI * 2 * i) / count;
    return `${center + Math.cos(angle) * radius},${center + Math.sin(angle) * radius}`;
  }).join(' ');
}

export function RadarChart({ axisLabels, series, size = 180, className }: RadarChartProps) {
  const n = axisLabels.length;
  const center = size / 2;
  const radius = size * 0.38;
  const labelRadius = size * 0.48;

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className={className ?? 'h-56 w-full max-w-sm'}>
      {/* Grid rings */}
      {[0.25, 0.5, 0.75, 1].map((step) => (
        <polygon
          key={step}
          points={gridPolygon(step, n, size)}
          fill="none"
          stroke="currentColor"
          className="text-slate-200 dark:text-slate-700"
          strokeWidth="1"
        />
      ))}

      {/* Axis lines + labels */}
      {axisLabels.map((label, i) => {
        const angle = -Math.PI / 2 + (Math.PI * 2 * i) / n;
        const x2 = center + Math.cos(angle) * radius;
        const y2 = center + Math.sin(angle) * radius;
        const lx = center + Math.cos(angle) * labelRadius;
        const ly = center + Math.sin(angle) * labelRadius;
        return (
          <g key={label}>
            <line
              x1={center}
              y1={center}
              x2={x2}
              y2={y2}
              stroke="currentColor"
              className="text-slate-200 dark:text-slate-700"
            />
            <text
              x={lx}
              y={ly}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-slate-500 dark:fill-slate-400 text-[9px]"
            >
              {label}
            </text>
          </g>
        );
      })}

      {/* Data polygons */}
      {series.map((s) => (
        <polygon
          key={s.id}
          points={polygon(s.values, size)}
          fill={s.color}
          fillOpacity="0.12"
          stroke={s.color}
          strokeWidth="2"
        />
      ))}

      {/* Legend dots */}
      {series.map((s, i) => (
        <g key={`legend-${s.id}`} transform={`translate(4, ${size - 10 - i * 12})`}>
          <circle cx="4" cy="4" r="3" fill={s.color} />
          <text x="10" y="8" className="fill-slate-600 dark:fill-slate-300 text-[8px]">
            {s.name}
          </text>
        </g>
      ))}
    </svg>
  );
}
