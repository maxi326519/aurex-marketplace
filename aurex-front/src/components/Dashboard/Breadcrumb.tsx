import { ChevronRight, Home } from "lucide-react";
import { Link } from "react-router-dom";

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  homeHref: string;
  className?: string;
}

export default function Breadcrumb({
  items,
  homeHref,
  className = "",
}: BreadcrumbProps) {
  return (
    <nav
      className={`flex items-center space-x-1 text-xs text-gray-500 ${className}`}
    >
      <Link
        to={homeHref}
        className="flex items-center hover:text-gray-700 transition-colors"
      >
        <Home size={16} className="mr-1" />
        Inicio
      </Link>

      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          <ChevronRight size={16} className="mx-1 text-gray-400" />
          {item.path ? (
            <Link
              to={item.path}
              className="hover:text-gray-700 transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
