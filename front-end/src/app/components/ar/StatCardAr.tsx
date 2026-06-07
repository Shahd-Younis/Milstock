import { clsx } from 'clsx';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardArProps {
  title: string;
  value: string | number;
  icon: any;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  color?: 'primary' | 'warning' | 'danger' | 'success';
}

const colorConfig = {
  primary: {
    iconBg: 'bg-[#6A7B4D]/12',
    iconColor: 'text-[#6A7B4D]',
    accent: 'border-r-[#6A7B4D]',
  },
  warning: {
    iconBg: 'bg-[#B8862A]/12',
    iconColor: 'text-[#B8862A]',
    accent: 'border-r-[#B8862A]',
  },
  danger: {
    iconBg: 'bg-[#C0392B]/10',
    iconColor: 'text-[#C0392B]',
    accent: 'border-r-[#C0392B]',
  },
  success: {
    iconBg: 'bg-[#5B8A4A]/12',
    iconColor: 'text-[#5B8A4A]',
    accent: 'border-r-[#5B8A4A]',
  },
};

export const StatCardAr = ({
  title,
  value,
  icon: Icon,
  trend,
  color = 'primary',
}: StatCardArProps) => {
  const config = colorConfig[color];

  return (
    <div
      className={clsx(
        'bg-card rounded-2xl border border-border shadow-sm p-5',
        'border-r-4 hover:shadow-md transition-all duration-200',
        config.accent
      )}
    >
      {/* Top row — RTL: icon on left (trailing), text on right (leading) */}
      <div className="flex items-start justify-between mb-4">
        <div className={clsx('p-2.5 rounded-xl flex-shrink-0', config.iconBg)}>
          <Icon className={clsx('w-5 h-5', config.iconColor)} />
        </div>
        <p className="text-sm text-muted-foreground leading-snug text-right pl-2">{title}</p>
      </div>

      {/* Value */}
      <p className="text-3xl font-bold text-[#2E3A24] mb-3 tracking-tight text-right">{value}</p>

      {/* Trend */}
      {trend && (
        <div className="flex items-center gap-1.5 justify-end">
          {trend.isPositive ? (
            <TrendingUp className="w-3.5 h-3.5 text-[#5B8A4A]" />
          ) : (
            <TrendingDown className="w-3.5 h-3.5 text-[#C0392B]" />
          )}
          <span
            className={clsx(
              'text-xs font-medium',
              trend.isPositive ? 'text-[#5B8A4A]' : 'text-[#C0392B]'
            )}
          >
            {trend.value}
          </span>
        </div>
      )}
    </div>
  );
};