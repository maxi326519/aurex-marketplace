import { useAuth } from "../../../hooks/Auth/useAuth";
import { User2 } from "lucide-react";

interface Props {
  title: string;
}

export default function Navbar({ title }: Props) {
  const auth = useAuth();

  return (
    <nav className="flex justify-between items-center h-[--navbar-height] p-6 pl-[30px] border-b-[1px] border bg-white">
      <h2 className="text-xl text-gray-600 font-medium">{title}</h2>
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
    </nav>
  );
}
