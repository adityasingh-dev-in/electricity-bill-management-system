import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Zap, Menu, X, LayoutDashboard } from "lucide-react"; // Added LayoutDashboard icon
import { clsx } from "clsx";
import useUser from "../../hooks/useUser";

const LandingNavbar = () => {
    const { user } = useUser(); // Access user state
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { label: "Home", path: "/" },
        { label: "Features", path: "#features" },
        { label: "About", path: "#about" },
        { label: "Pricing", path: "#pricing" },
    ];

    // Helper to determine dashboard link based on role
    const dashboardPath = '/dashboard';

    return (
        <nav className={clsx(
            "fixed top-0 inset-x-0 z-100 transition-all duration-300",
            isScrolled ? "bg-neutral-950/80 backdrop-blur-lg border-b border-neutral-800 py-3" : "bg-transparent py-5"
        )}>
            <div className="container mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.5)] group-hover:scale-110 transition-transform">
                        <Zap size={22} fill="currentColor" />
                    </div>
                    <span className="font-bold text-xl tracking-tight text-white">
                        ElectroBill
                    </span>
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <a
                            key={link.label}
                            href={link.path}
                            className="text-sm font-medium text-neutral-400 hover:text-white transition-colors"
                        >
                            {link.label}
                        </a>
                    ))}
                    <div className="h-4 w-px bg-neutral-800" />
                    
                    {user ? (
                        /* SHOW DASHBOARD IF LOGGED IN */
                        <Link
                            to={dashboardPath}
                            className="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold rounded-full border border-white/20 transition-all backdrop-blur-md active:scale-95"
                        >
                            <LayoutDashboard size={16} />
                            Go to Dashboard
                        </Link>
                    ) : (
                        /* SHOW AUTH LINKS IF NOT LOGGED IN */
                        <>
                            <Link
                                to="/login"
                                className="text-sm font-semibold text-white hover:text-indigo-400 transition-colors"
                            >
                                Log in
                            </Link>
                            <Link
                                to="/signup"
                                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-full transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] active:scale-95"
                            >
                                Get Started
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="p-2 md:hidden text-neutral-400 hover:text-white transition-colors"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            <div className={clsx(
                "fixed inset-0 top-[70px] bg-neutral-950 z-[90] p-6 md:hidden transition-all duration-300",
                isMobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"
            )}>
                <div className="flex flex-col gap-6 items-center pt-10">
                    {navLinks.map((link) => (
                        <a
                            key={link.label}
                            href={link.path}
                            className="text-2xl font-semibold text-neutral-300 hover:text-white"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {link.label}
                        </a>
                    ))}
                    <div className="w-full h-px bg-neutral-800 my-4" />
                    
                    {user ? (
                        <Link
                            to={dashboardPath}
                            className="w-full text-center px-8 py-4 bg-white/10 text-white text-lg font-bold rounded-2xl border border-white/20"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="text-xl font-semibold text-white"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Log in
                            </Link>
                            <Link
                                to="/signup"
                                className="w-full text-center px-8 py-4 bg-indigo-600 text-white text-lg font-bold rounded-2xl shadow-lg"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Get Started
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default LandingNavbar;