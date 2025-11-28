import Breadcrumb, { BreadcrumbItem } from "../Breadcrumb";
import { useAuth } from "../../../hooks/Auth/useAuth";
import { User2 } from "lucide-react";

interface Props {
  title: string;
  breadcrumb?: BreadcrumbItem[];
  homeHref: string;
}

export default function Navbar({ title, breadcrumb = [], homeHref }: Props) {
  const auth = useAuth();

  return (
    <nav className="flex flex-col border-b-[1px] border">
      <div className="flex justify-between items-center p-6 pl-[30px]">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-medium">{title}</h2>
          {breadcrumb.length > 0 && (
            <Breadcrumb homeHref={homeHref} items={breadcrumb} />
          )}
        </div>
        <div className="flex items-center p-1 border border-gray-400 rounded-full">
          <div className="flex justify-center items-center w-[40px] h-[40px] border border-gray-200 overflow-hidden rounded-full">
            {auth.user?.photo ? (
              <img
                className="icon-invert w-[60%] opacity-70"
                src={auth.user.photo}
                alt="user"
              />
            ) : (
              <User2 className="text-primary" />
            )}
          </div>
          <span className="p-2 text-sm">{auth.user?.name}</span>
        </div>
      </div>
    </nav>
  );
}
