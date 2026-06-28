import { FiInbox, FiPlus } from "react-icons/fi";
import Button from "./Button.jsx";

export default function EmptyState({
  title = "No tasks yet.",
  subtitle = "Create your first task to get started.",
  action,
  onAction,
  icon,
}) {
  return (
    <div className="card-surface flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-border bg-bg/40 text-muted [html:not(.dark)_&]:bg-surface-light [html:not(.dark)_&]:border-border-light">
        {icon || <FiInbox className="h-6 w-6" />}
      </div>
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted">{subtitle}</p>
      {action && (
        <Button
          className="mt-5"
          onClick={onAction}
          leftIcon={<FiPlus className="h-4 w-4" />}
        >
          {action}
        </Button>
      )}
    </div>
  );
}
