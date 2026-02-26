import { Menu, ChevronRight, Bell } from "lucide-react";
import { useLocation } from "react-router-dom";
import useUser from "../../hooks/useUser";

interface HeaderProps {
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
}

const Header = ({ toggleSidebar }: HeaderProps) => {
    const { user } = useUser();
    const location = useLocation();

    const breadcrumb = location.pathname.split('/').pop()?.replace(/-/g, ' ') || 'Overview';

    return (
        <header className="h-16 flex items-center justify-between px-6 border-b border-neutral-800 bg-neutral-900/50 backdrop-blur-md sticky top-0 z-40">
            <div className="flex items-center gap-4">
                <button
                    onClick={toggleSidebar}
                    className="p-2 hover:bg-neutral-800 rounded-lg transition-colors md:hidden"
                >
                    <Menu size={24} />
                </button>
                <div className="flex items-center gap-2 text-sm text-neutral-400">
                    <span className="hover:text-neutral-200 cursor-pointer hidden md:inline">Dashboard</span>
                    <ChevronRight size={14} className="hidden md:inline" />
                    <span className="text-neutral-100 font-medium capitalize">
                        {breadcrumb}
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button className="relative p-2 text-neutral-400 hover:bg-neutral-800 rounded-lg transition-colors">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-indigo-500 border-2 border-neutral-900" />
                </button>

                <div className="h-8 w-px bg-neutral-800 mx-2" />

                <div className="flex items-center gap-3 cursor-pointer group">
                    <div className="hidden sm:flex flex-col items-end mr-1">
                        <span className="text-sm font-semibold truncate group-hover:text-indigo-400 transition-colors uppercase">
                            {user?.name}
                        </span>
                        <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold">
                            {user?.role}
                        </span>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-linear-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold ring-2 ring-neutral-800 group-hover:ring-indigo-500/50 transition-all">
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
