import { LayoutDashboard, UserSquare, Users, Zap, Receipt, CreditCard, MessageSquare, Settings, LogOut, ChevronRight, User as UserIcon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { clsx } from "clsx";
import useUser from "../hooks/useUser";
import api from '../utils/api';
import { useEffect, useState } from "react";




interface SidebarProps {
    isMobileOpen: boolean;
    onCloseMobile: () => void;
}

const Sidebar = ({ isMobileOpen, onCloseMobile }: SidebarProps) => {
    const location = useLocation();
    const { user, setUser } = useUser();
    const [sidebarMenuItems, setSidebarMenuItems] = useState([
            { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
            { icon: UserSquare, label: "User Control", path: "/admin/dashboard/user-Control" },
            { icon: Users, label: "Consumer Control", path: "/dashboard/consumer-control" },
            { icon: Zap, label: "Tariffs", path: "/admin/dashboard/tariffs" },
            { icon: Receipt, label: "Billing", path: "/dashboard/billing" },
            { icon: CreditCard, label: "Payments", path: "/dashboard/payments" },
            { icon: MessageSquare, label: "Complaints", path: "/dashboard/complaints" },
            { icon: Settings, label: "Settings", path: "/dashboard/settings" },
        ])

    useEffect(() => {
      if(user?.role === 'staff'){
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSidebarMenuItems([
            { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
            { icon: Users, label: "Consumer Control", path: "/dashboard/consumer-control" },
            { icon: Receipt, label: "Billing", path: "/dashboard/billing" },
            { icon: CreditCard, label: "Payments", path: "/dashboard/payments" },
            { icon: MessageSquare, label: "Complaints", path: "/dashboard/complaints" },
            { icon: Settings, label: "Settings", path: "/dashboard/settings" },
        ])
      }
    }, [user])
    

    const logoutUser = async ()=>{
        try {
            await api.get('/auth/logout');
            setUser(null)
            alert('user is logout successfully')
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <aside className={clsx(
            "fixed inset-y-0 left-0 z-50 flex flex-col bg-neutral-900 border-r border-neutral-800 transition-all duration-500 ease-in-out md:static",
            // Mobile: translate based on isMobileOpen. Desktop: Fixed full width (md:w-72).
            isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
            "md:w-72"
        )}>
            {/* Sidebar Header */}
            <div className="flex h-20 items-center px-6 border-b border-neutral-800/50">
                <div className="flex items-center gap-4 overflow-hidden">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-indigo-600 to-indigo-700 text-white shadow-[0_0_20px_rgba(79,70,229,0.4)] border border-indigo-400/20">
                        <Zap size={24} fill="currentColor" className="animate-pulse" />
                    </div>
                    <div className="transition-all duration-500">
                        <span className="font-black text-xl tracking-tighter text-white block">
                            ELECTRO<span className="text-indigo-500">BILL</span>
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 block -mt-1">{user?.role} Panel</span>
                    </div>
                </div>
            </div>

            {/* Sidebar Menu */}
            <nav className="flex-1 overflow-y-auto py-8 px-4 space-y-2 custom-scrollbar">
                {sidebarMenuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => {
                                if (window.innerWidth < 768) onCloseMobile();
                            }}
                            className={clsx(
                                "group relative flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300",
                                isActive
                                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 active:scale-95"
                                    : "text-neutral-500 hover:bg-neutral-800/50 hover:text-neutral-200"
                            )}
                        >
                            <item.icon size={22} className={clsx("shrink-0 transition-transform duration-300 group-hover:scale-110", isActive ? "text-white" : "group-hover:text-indigo-400")} />

                            <span className="font-bold text-sm tracking-tight transition-all duration-500 whitespace-nowrap flex-1">
                                {item.label}
                            </span>

                            {isActive && (
                                <ChevronRight size={16} className="text-white/50" />
                            )}

                            {isActive && (
                                <div className="absolute left-0 w-1.5 h-6 bg-white rounded-r-full shadow-[0_0_15px_rgba(255,255,255,0.8)]" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Sidebar Footer */}
            <div className="p-4 bg-neutral-900/50 backdrop-blur-sm border-t border-neutral-800/50 space-y-4">
                {/* User Profile Summary */}
                <div className="flex items-center gap-4 p-2 rounded-2xl bg-neutral-950/30 border border-neutral-800/50 transition-all duration-500 font-sans">
                    <div className="h-10 w-10 shrink-0 rounded-xl bg-neutral-800 flex items-center justify-center text-neutral-400 border border-neutral-700 overflow-hidden shadow-inner font-black uppercase tracking-widest text-lg">
                        {user?.name?.charAt(0) || <UserIcon size={20} />}
                    </div>
                    <div className="transition-all duration-500 overflow-hidden flex-1">
                        <p className="text-xs font-black text-white truncate uppercase tracking-tighter">{user?.name || "Admin User"}</p>
                        <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mt-0.5">{user?.role}</p>
                    </div>
                </div>

                <button onClick={logoutUser} className="flex w-full items-center gap-4 px-4 py-3 rounded-2xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-300 font-bold text-sm group active:scale-95">
                    <LogOut size={22} className="shrink-0 transition-transform group-hover:-translate-x-1" />
                    <span className="transition-all duration-500">
                        Sign Out
                    </span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
