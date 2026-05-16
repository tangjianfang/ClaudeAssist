import { Download, Link, FileText } from 'lucide-react';
import { IconButton } from '../ui/IconButton';

interface ReportActionsProps {
  onCopyLink?: () => void;
  onCopyMarkdown?: () => void;
  onDownloadSvg?: () => void;
}

/** 报表操作栏：复制分享链接 / 复制 Markdown / 下载 SVG */
export function ReportActions({ onCopyLink, onCopyMarkdown, onDownloadSvg }: ReportActionsProps) {
  return (
    <div className="flex items-center gap-1">
      {onCopyLink && (
        <IconButton label="复制分享链接" size="sm" onClick={onCopyLink}>
          <Link className="w-3.5 h-3.5" />
        </IconButton>
      )}
      {onCopyMarkdown && (
        <IconButton label="复制 Markdown" size="sm" onClick={onCopyMarkdown}>
          <FileText className="w-3.5 h-3.5" />
        </IconButton>
      )}
      {onDownloadSvg && (
        <IconButton label="下载 SVG" size="sm" onClick={onDownloadSvg}>
          <Download className="w-3.5 h-3.5" />
        </IconButton>
      )}
    </div>
  );
}
