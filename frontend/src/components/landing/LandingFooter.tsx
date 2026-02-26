import { Zap, Twitter, Github, Linkedin, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const LandingFooter = () => {
    return (
        <footer className="bg-neutral-950 border-t border-neutral-900 pt-20 pb-10">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.3)]">
                                <Zap size={22} fill="currentColor" />
                            </div>
                            <span className="font-bold text-xl tracking-tight text-white">
                                ElectroBill
                            </span>
                        </Link>
                        <p className="text-neutral-400 text-sm leading-relaxed max-w-xs">
                            Simplify your utility management with our cutting-edge billing and payment platform. Fast, secure, and transparent.
                        </p>
                        <div className="flex items-center gap-4 text-neutral-500">
                            <Twitter size={20} className="hover:text-white cursor-pointer transition-colors" />
                            <Github size={20} className="hover:text-white cursor-pointer transition-colors" />
                            <Linkedin size={20} className="hover:text-white cursor-pointer transition-colors" />
                        </div>
                    </div>

                    {/* Product Links */}
                    <div className="space-y-6">
                        <h4 className="text-white font-bold uppercase tracking-wider text-xs">Product</h4>
                        <ul className="space-y-4">
                            <li><a href="#features" className="text-neutral-400 hover:text-white text-sm transition-colors">Features</a></li>
                            <li><a href="#pricing" className="text-neutral-400 hover:text-white text-sm transition-colors">Pricing</a></li>
                            <li><a href="#" className="text-neutral-400 hover:text-white text-sm transition-colors">API Reference</a></li>
                            <li><a href="#" className="text-neutral-400 hover:text-white text-sm transition-colors">Status</a></li>
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div className="space-y-6">
                        <h4 className="text-white font-bold uppercase tracking-wider text-xs">Company</h4>
                        <ul className="space-y-4">
                            <li><a href="#about" className="text-neutral-400 hover:text-white text-sm transition-colors">About Us</a></li>
                            <li><a href="#" className="text-neutral-400 hover:text-white text-sm transition-colors">Careers</a></li>
                            <li><a href="#" className="text-neutral-400 hover:text-white text-sm transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="text-neutral-400 hover:text-white text-sm transition-colors">Terms of Service</a></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className="space-y-6">
                        <h4 className="text-white font-bold uppercase tracking-wider text-xs">Stay Updated</h4>
                        <p className="text-neutral-400 text-sm">Join our newsletter for the latest updates and offers.</p>
                        <div className="relative group">
                            <input
                                type="email"
                                placeholder="email@example.com"
                                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                            />
                            <button className="absolute right-2 top-1.5 p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors">
                                <Mail size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-neutral-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
                    <p className="text-neutral-500 text-xs font-medium">
                        © {new Date().getFullYear()} ElectroBill Inc. All rights reserved. Made by Aditya.
                    </p>
                    <div className="flex gap-8 text-neutral-600 text-[10px] font-bold uppercase tracking-widest">
                        <span className="hover:text-neutral-400 cursor-pointer">Privacy</span>
                        <span className="hover:text-neutral-400 cursor-pointer">Security</span>
                        <span className="hover:text-neutral-400 cursor-pointer">Cookies</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default LandingFooter;
