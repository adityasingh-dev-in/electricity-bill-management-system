import { Link } from "react-router-dom";
import { CreditCard, ShieldCheck, Clock, ArrowRight, Play } from "lucide-react";
import LandingNavbar from "../components/landing/LandingNavbar";
import LandingFooter from "../components/landing/LandingFooter";

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-indigo-500/30">
            <LandingNavbar />

            {/* Hero Section with Video Background */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                {/* Background Video Holder */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-neutral-950/60 z-10 backdrop-blur-[2px]" />
                    <video
                        className="w-full h-full object-cover"
                        autoPlay
                        loop
                        muted
                        playsInline
                        poster="https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80"
                    >
                        {/* Note: User should replace this URL with their actual video file path */}
                        <source src="backgroundLanding.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>

                <div className="container mx-auto px-6 relative z-20 text-center mt-30">
                    

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-8 leading-[1.1]">
                        Powering Your <br />
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 via-purple-400 to-indigo-400 bg-size-[200%_auto] animate-gradient">
                            Digital Future.
                        </span>
                    </h1>

                    <p className="max-w-2xl mx-auto text-lg md:text-xl text-neutral-400 mb-12 leading-relaxed font-medium">
                        Seamlessly manage bills, monitor consumption, and handle payments with our intuitive, industrial-grade utility platform.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Link
                            to="/signup"
                            className="group flex items-center gap-3 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl transition-all shadow-[0_0_40px_rgba(79,70,229,0.35)] active:scale-95"
                        >
                            Get Started Free
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <button className="group flex items-center gap-3 px-8 py-4 bg-neutral-900/80 hover:bg-neutral-800 text-white font-bold rounded-2xl border border-neutral-800 transition-all backdrop-blur-sm">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
                                <Play size={12} fill="white" />
                            </div>
                            Watch Demo
                        </button>
                    </div>
                </div>

                {/* Decorative Scroll Indicator */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
                    <div className="w-1 h-12 rounded-full bg-linear-to-b from-indigo-500/50 to-transparent" />
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 bg-neutral-950 relative overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">Designed for Excellence</h2>
                        <p className="text-neutral-500 max-w-xl mx-auto font-medium">Built with the latest technology to ensure a smooth and secure experience for both consumers and staff.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: CreditCard,
                                title: "Smart Payments",
                                desc: "Secure multi-channel payment options with instant reconciliation."
                            },
                            {
                                icon: ShieldCheck,
                                title: "Robust Security",
                                desc: "Enterprise-grade protection for your data and transactions."
                            },
                            {
                                icon: Clock,
                                title: "Real-time Tracking",
                                desc: "Monitor your energy usage and billing cycles in real-time."
                            }
                        ].map((feature, idx) => (
                            <div key={idx} className="p-8 bg-neutral-900 border border-neutral-800 rounded-3xl hover:border-indigo-500/50 transition-colors group">
                                <div className="h-14 w-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 mb-8 group-hover:scale-110 transition-transform">
                                    <feature.icon size={28} />
                                </div>
                                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                                <p className="text-neutral-400 text-sm leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-indigo-600 opacity-[0.03]" />
                <div className="container mx-auto px-6 relative z-10">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-[3rem] p-12 md:p-20 text-center shadow-2xl">
                        <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">
                            Ready to take control of <br className="hidden md:block" />
                            your energy consumption?
                        </h2>
                        <p className="text-neutral-400 text-lg mb-12 max-w-2xl mx-auto">
                            Join thousands of users who are already using ElectroBill to manage their utility bills more efficiently.
                        </p>
                        <Link
                            to="/signup"
                            className="inline-flex items-center gap-3 px-10 py-5 bg-white text-neutral-950 font-black rounded-2xl hover:bg-neutral-200 transition-all active:scale-95"
                        >
                            Create Account
                            <ArrowRight size={20} />
                        </Link>
                    </div>
                </div>
            </section>

            <LandingFooter />
        </div>
    );
};

export default LandingPage;
