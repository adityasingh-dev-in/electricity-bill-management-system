import { LayoutDashboard, UserSquare, Users, Zap, Receipt, CreditCard, MessageSquare, Settings, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { clsx } from "clsx";

export const sidebarMenuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
    { icon: UserSquare, label: "User Control", path: "/admin/dashboard/user-Control" },
    { icon: Users, label: "Consumer Control", path: "/admin/dashboard/consumer-control" },
    { icon: Zap, label: "Tariffs", path: "/admin/dashboard/tariffs" },
    { icon: Receipt, label: "Billing", path: "/admin/dashboard/billing" },
    { icon: CreditCard, label: "Payments", path: "/admin/dashboard/payments" },
    { icon: MessageSquare, label: "Complaints", path: "/admin/dashboard/complaints" },
    { icon: Settings, label: "Settings", path: "/admin/dashboard/settings" },
];

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
    const location = useLocation();

    return (
        <aside className={clsx(
            "fixed inset-y-0 left-0 z-50 flex flex-col bg-neutral-900 border-r border-neutral-800 transition-all duration-300 ease-in-out md:static",
            isOpen ? "w-64" : "w-20 -translate-x-full md:translate-x-0"
        )}>
            {/* Sidebar Header */}
            <div className="flex h-16 items-center px-6 border-b border-neutral-800">
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.4)]">
                        <Zap size={20} fill="currentColor" />
                    </div>
                    <span className={clsx("font-bold text-lg whitespace-nowrap transition-opacity", !isOpen && "md:opacity-0")}>
                        ElectroBill
                    </span>
                </div>
            </div>

            {/* Sidebar Menu */}
            <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1 custom-scrollbar">
                {sidebarMenuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => {
                                if (window.innerWidth < 768) onClose();
                            }}
                            className={clsx(
                                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative",
                                isActive
                                    ? "bg-indigo-600/10 text-indigo-400 font-medium"
                                    : "text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200"
                            )}
                        >
                            <item.icon size={22} className={clsx("shrink-0", isActive && "text-indigo-400")} />
                            <span className={clsx("transition-all duration-300 whitespace-nowrap", !isOpen && "md:opacity-0")}>
                                {item.label}
                            </span>
                            {isActive && (
                                <div className="absolute right-2 h-1.5 w-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Sidebar Footer */}
            <div className="p-4 border-t border-neutral-800">
                <button className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 transition-all duration-200">
                    <LogOut size={22} />
                    <span className={clsx("transition-all duration-300", !isOpen && "md:opacity-0")}>
                        Logout
                    </span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
