import { clsx } from "clsx";
import { Button } from "../Button";
const PageHeaderAr = ({
  title,
  subtitle,
  action,
  badge,
  className
}) => {
  return <div className={clsx("mb-8 flex items-start justify-between gap-4", className)}>
      {action && <Button
    onClick={action.onClick}
    className="flex-shrink-0 flex items-center gap-2"
  >
          {action.icon && <action.icon className="w-4 h-4" />}
          {action.label}
        </Button>}
      <div className="text-right flex-1 min-w-0">
        <div className="flex items-center gap-3 justify-end mb-1">
          {badge && badge}
          <h1 className="text-[#2E3A24] truncate">{title}</h1>
        </div>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>
    </div>;
};
export {
  PageHeaderAr
};
