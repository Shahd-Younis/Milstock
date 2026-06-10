import { clsx } from "clsx";
import { Button } from "../Button";
const PageHeaderAr = ({
  title,
  subtitle,
  action,
  actions,
  badge,
  className
}) => {
  const headerActions = actions || (action ? [action] : []);
  return <div className={clsx("mb-8 flex items-start justify-between gap-4", className)}>
      {headerActions.length > 0 && <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
        {headerActions.map((item) => <Button
          key={item.label}
          variant={item.variant || "primary"}
          onClick={item.onClick}
          disabled={item.disabled}
          className="flex items-center gap-2"
        >
          {item.icon && <item.icon className="w-4 h-4" />}
          {item.label}
        </Button>)}
      </div>}
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
