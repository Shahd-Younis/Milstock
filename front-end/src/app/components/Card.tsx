import { clsx } from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: boolean;
}

export const Card = ({ children, className, padding = true }: CardProps) => {
  return (
    <div
      className={clsx(
        'bg-card rounded-2xl border border-border shadow-sm',
        padding && 'p-5 sm:p-6',
        className
      )}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={clsx(
        'mb-5 pb-4 border-b border-border flex items-center justify-between gap-3',
        className
      )}
    >
      {children}
    </div>
  );
};

export const CardTitle = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <h3
      className={clsx(
        'text-[#2E3A24]',
        className
      )}
    >
      {children}
    </h3>
  );
};

export const CardContent = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <div className={clsx(className)}>{children}</div>;
};
