import { forwardRef } from 'react';

interface ReportSvgProps {
  width?: number;
  height?: number;
  children: React.ReactNode;
  className?: string;
}

/**
 * 报表 SVG 容器 — SVG 下载时序列化此元素，避免误抓页面第一个 SVG。
 * data-report-svg 属性用于 report-share.ts 精确定位。
 */
export const ReportSvg = forwardRef<SVGSVGElement, ReportSvgProps>(
  ({ width = 600, height = 400, children, className }, ref) => (
    <svg
      ref={ref}
      data-report-svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  ),
);

ReportSvg.displayName = 'ReportSvg';
