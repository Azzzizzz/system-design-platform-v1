import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h2 className="text-4xl font-bold tracking-tighter-plus mb-4 text-foreground">
        404
      </h2>
      <p className="text-muted-foreground mb-8">
        The system architecture you're looking for doesn't exist yet.
      </p>
      <Link 
        to="/"
        className="px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-md hover:bg-primary/20 transition-colors text-sm font-medium"
      >
        Return to Infrastructure
      </Link>
    </div>
  );
}
