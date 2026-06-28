import { Link } from "react-router-dom";
import Button from "../components/ui/Button.jsx";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-brand">
        404
      </span>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">
        Page not found
      </h1>
      <p className="mt-1.5 max-w-sm text-sm text-muted">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/dashboard" className="mt-5">
        <Button variant="secondary">Back to dashboard</Button>
      </Link>
    </div>
  );
}
