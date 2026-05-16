import { forwardRef } from 'react';

export interface BarDim {
  key: string;
  label: string;
}

export interface BarSeries {
  id: string;
  name: string;
  color: string;
  values: Record<string, number>;
}

export interface BarCompareChartProps {
  dims: BarDim[];
  series: BarSeries[];
  /** 最大值，默认 10 */
  maxValue?: number;
  /** SVG 宽度，默认 560 */
  width?: number;
  className?: string;
}

const ROW_H = 26;      // 每个 series 行高
const GROUP_GAP = 10;  // 组间间距
const LABEL_W = 62;    // 维度标签宽度
const BAR_MAX_W = 380; // 最大条形宽度（像素）
const PAD = 12;        // 上下留白

export const BarCompareChart = forwardRef<SVGSVGElement, BarCompareChartProps>(
  function BarCompareChart(
    {
      dims,
      series,
      maxValue = 10,
      width = 560,
      className,
    }: BarCompareChartProps,
    ref,
  ) {
    if (dims.length === 0 || series.length === 0) return null;

    const groupH = series.length * ROW_H;
    const totalH = dims.length * (groupH + GROUP_GAP) + PAD * 2;

    return (
      <svg
        ref={ref}
        data-report-svg
        viewBox={`0 0 ${width} ${totalH}`}
        width={width}
        height={totalH}
        className={className}
        aria-label="工具评分对比图"
        xmlns="http://www.w3.org/2000/svg"
      >
      {dims.map((dim, gi) => {
        const groupY = PAD + gi * (groupH + GROUP_GAP);
        return (
          <g key={dim.key}>
            {/* Dimension label */}
            <text
              x={LABEL_W - 4}
              y={groupY + groupH / 2}
              textAnchor="end"
              dominantBaseline="middle"
              className="fill-slate-500 dark:fill-slate-400 text-[10px]"
              fontSize={10}
            >
              {dim.label}
            </text>

            {/* Grid line */}
            <line
              x1={LABEL_W}
              y1={groupY}
              x2={LABEL_W + BAR_MAX_W}
              y2={groupY}
              stroke="currentColor"
              className="text-slate-100 dark:text-slate-800"
            />

            {/* Bars */}
            {series.map((s, si) => {
              const value = s.values[dim.key] ?? 0;
              const barW = (value / maxValue) * BAR_MAX_W;
              const y = groupY + si * ROW_H + 3;
              const bh = ROW_H - 7;
              return (
                <g key={s.id}>
                  {/* Background track */}
                  <rect
                    x={LABEL_W}
                    y={y}
                    width={BAR_MAX_W}
                    height={bh}
                    rx={3}
                    fill="currentColor"
                    className="text-slate-100 dark:text-slate-800"
                  />
                  {/* Value bar */}
                  <rect
                    x={LABEL_W}
                    y={y}
                    width={barW}
                    height={bh}
                    rx={3}
                    fill={s.color}
                    fillOpacity={0.85}
                  />
                  {/* Value label */}
                  <text
                    x={LABEL_W + barW + 4}
                    y={y + bh / 2}
                    dominantBaseline="middle"
                    fill={s.color}
                    fontSize={9}
                    fontWeight="600"
                  >
                    {value.toFixed(1)}
                  </text>
                </g>
              );
            })}
          </g>
        );
      })}

      {/* Legend */}
      {series.map((s, i) => (
        <g key={`leg-${s.id}`} transform={`translate(${LABEL_W + i * 110}, ${totalH - 8})`}>
          <rect x={0} y={-6} width={8} height={8} rx={2} fill={s.color} fillOpacity={0.85} />
          <text x={11} y={0} dominantBaseline="middle" fill={s.color} fontSize={9}>
            {s.name.length > 12 ? s.name.slice(0, 11) + '…' : s.name}
          </text>
        </g>
      ))}
      </svg>
    );
  },
);

BarCompareChart.displayName = 'BarCompareChart';
