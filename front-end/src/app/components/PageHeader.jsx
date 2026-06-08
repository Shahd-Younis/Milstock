import { Button } from "./Button";
const PageHeader = ({ title, subtitle, action, badge }) => {
  return <div className="mb-8 flex items-start justify-between gap-4">
      <div className="min-w-0">
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-[#2E3A24] truncate">{title}</h1>
          {badge && badge}
        </div>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {action && <Button
    onClick={action.onClick}
    className="flex-shrink-0 flex items-center gap-2"
  >
          {action.icon && <action.icon className="w-4 h-4" />}
          {action.label}
        </Button>}
    </div>;
};
export {
  PageHeader
};
