import { Link } from "react-router-dom";
import { CreditCard, ShieldCheck, Clock, ArrowRight } from "lucide-react";
import LandingNavbar from "../components/landing/LandingNavbar";
import LandingFooter from "../components/landing/LandingFooter";

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30 overflow-x-hidden">
            <LandingNavbar />

            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex items-center justify-center pt-20 pb-12 px-6">
                {/* Modern Background */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2" />
                </div>

                <div className="container mx-auto relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-bold mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <ShieldCheck size={16} />
                        <span>Next-Gen Utility Management</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8 leading-[1.1] animate-in fade-in slide-in-from-bottom-6 duration-1000">
                        Smart Power <br className="hidden sm:block" />
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 via-purple-400 to-indigo-400 bg-size-[200%_auto] animate-gradient">
                            Management.
                        </span>
                    </h1>

                    <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 mb-12 leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-8 duration-1000">
                        An intuitive, secure, and industrial-grade platform to monitor consumption, manage bills, and handle payments seamlessly.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-1000">
                        <Link
                            to="/signup"
                            className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl transition-all shadow-[0_20px_40px_-15px_rgba(79,70,229,0.4)] active:scale-95"
                        >
                            Get Started
                            <ArrowRight size={20} />
                        </Link>
                        <Link
                            to="/login"
                            className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-5 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white font-bold rounded-2xl transition-all active:scale-95"
                        >
                            Log In
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section - Simplified for Mobile */}
            <section id="features" className="py-24 px-6 relative">
                <div className="container mx-auto">
                    <div className="text-center mb-16 px-4">
                        <h2 className="text-3xl md:text-5xl font-black mb-6">Built for Efficiency</h2>
                        <p className="text-slate-500 max-w-xl mx-auto font-medium">Streamlined features designed for both consumers and administrators.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                        {[
                            {
                                icon: CreditCard,
                                title: "Easy Payments",
                                desc: "Integrated payment gateways for quick and secure bill clearance."
                            },
                            {
                                icon: ShieldCheck,
                                title: "Admin Portal",
                                desc: "Powerful tools for tracking consumers, tariffs, and complaints."
                            },
                            {
                                icon: Clock,
                                title: "Usage Insights",
                                desc: "Monitor energy consumption patterns with real-time data updates."
                            }
                        ].map((feature, idx) => (
                            <div key={idx} className="p-8 bg-slate-900/50 border border-slate-800 rounded-4xl hover:border-indigo-500/50 transition-all group backdrop-blur-sm">
                                <div className="h-14 w-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 mb-8 group-hover:scale-110 transition-transform">
                                    <feature.icon size={28} />
                                </div>
                                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section - Mobile Optimized */}
            <section className="py-20 px-6">
                <div className="container mx-auto">
                    <div className="bg-linear-to-br from-indigo-600 to-purple-700 rounded-5xl p-8 md:p-16 lg:p-24 text-center shadow-2xl overflow-hidden relative group">
                        {/* Decorative circles */}
                        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 blur-3xl rounded-full -translate-x-1/2 -translate-y-1/2 group-hover:scale-125 transition-transform duration-1000" />

                        <div className="relative z-10">
                            <h2 className="text-4xl md:text-6xl font-black mb-8 leading-[1.1] text-white">
                                Ready to Digitally <br className="hidden sm:block" />
                                Power Your Home?
                            </h2>
                            <p className="text-indigo-100 text-lg mb-10 max-w-xl mx-auto font-medium opacity-90">
                                Join our platform today and experience the future of electricity bill management.
                            </p>
                            <Link
                                to="/signup"
                                className="inline-flex items-center gap-3 px-12 py-5 bg-white text-indigo-950 font-black rounded-2xl hover:bg-slate-100 transition-all active:scale-95 shadow-xl"
                            >
                                Start Your Journey
                                <ArrowRight size={22} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <LandingFooter />
        </div>
    );
};

export default LandingPage;
