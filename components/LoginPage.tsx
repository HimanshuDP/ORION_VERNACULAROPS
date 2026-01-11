import React, { useState, useEffect } from 'react';
import { Terminal, AlertCircle, UserPlus, LogIn, Mail, Lock, ShieldCheck, Zap, Globe, BarChart3, Database } from 'lucide-react';
import { loginService, signupService } from '../services/firebase';
import { useLanguage } from '../services/LanguageContext';

const LoginPage: React.FC = () => {
    const { t, language, setLanguage } = useLanguage();
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) return;

        setIsLoading(true);
        setError(null);

        try {
            if (isSignUp) {
                await signupService(email, password);
            } else {
                await loginService(email, password);
            }
        } catch (err: any) {
            console.error("Auth failed", err);
            let errorMessage = "Authentication failed.";
            const code = err.code || '';

            if (code === 'auth/invalid-credential' || code === 'auth/user-not-found' || code === 'auth/wrong-password') {
                errorMessage = "Invalid email or password.";
            } else if (code === 'auth/email-already-in-use') {
                errorMessage = "This email is already registered.";
            } else if (code === 'auth/weak-password') {
                errorMessage = "Password should be at least 6 characters.";
            }

            setError(errorMessage);
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#030712] flex flex-col md:flex-row relative font-sans selection:bg-indigo-500/30">
            {/* Interactive Background Grid */}
            <div className="fixed inset-0 z-0 opacity-20 pointer-events-none"
                style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, #1e293b 1px, transparent 0)`,
                    backgroundSize: '40px 40px'
                }}
            />

            {/* Mouse Flow Glow */}
            <div
                className="fixed inset-0 z-0 pointer-events-none opacity-40 blur-[120px] transition-all duration-300"
                style={{
                    background: `radial-gradient(circle 400px at ${mousePosition.x}px ${mousePosition.y}px, rgba(79, 70, 229, 0.15), transparent)`
                }}
            />

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-15px); }
                    100% { transform: translateY(0px); }
                }
                .animate-float {
                    animation: float 5s infinite ease-in-out;
                }
                .glass-surface {
                    background: rgba(15, 23, 42, 0.4);
                    backdrop-filter: blur(12px);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                }
                .text-gradient {
                    background: linear-gradient(to right, #818cf8, #c084fc);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                `
            }} />

            {/* Language Toggle in Corner */}
            <div className="absolute top-6 right-6 z-50 flex gap-2">
                <button
                    onClick={() => setLanguage('en')}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${language === 'en' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white/5 text-slate-500 hover:bg-white/10'}`}
                >
                    EN
                </button>
                <button
                    onClick={() => setLanguage('hi')}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${language === 'hi' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white/5 text-slate-500 hover:bg-white/10'}`}
                >
                    हिं
                </button>
            </div>

            {/* LEFT SIDE: Branding & Features */}
            <div className="hidden md:flex w-1/2 flex-col justify-center p-12 lg:p-24 relative z-10 min-h-fit py-24">
                <div className="mb-12 animate-float">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
                            <Terminal className="text-white w-7 h-7" />
                        </div>
                        <span className="text-xl font-bold tracking-tighter text-white uppercase">{t('brand_name')}</span>
                    </div>
                    <h1 className="text-5xl lg:text-7xl font-black text-white leading-[0.9] tracking-tight mb-6">
                        {t('ai_powered')} <br />
                        <span className="text-gradient">{t('bi')}</span>
                    </h1>
                    <p className="text-slate-400 text-lg max-w-md leading-relaxed">
                        {t('bi_desc')}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-2xl">
                    <FeatureCard icon={<ShieldCheck className="w-5 h-5 text-emerald-400" />} title={t('secure_storage')} desc={t('secure_desc')} />
                    <FeatureCard icon={<Zap className="w-5 h-5 text-amber-400" />} title={t('instant_analysis')} desc={t('instant_desc')} />
                    <FeatureCard icon={<Globe className="w-5 h-5 text-blue-400" />} title={t('vernacular_support')} desc={t('vernacular_desc')} />
                    <FeatureCard icon={<BarChart3 className="w-5 h-5 text-indigo-400" />} title={t('smart_visuals')} desc={t('smart_desc')} />
                </div>

                <div className="mt-12 flex items-center gap-6 text-slate-500 font-mono text-xs uppercase tracking-[0.2em]">
                    <div className="flex -space-x-3">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="w-8 h-8 rounded-full border-2 border-[#030712] bg-slate-800 flex items-center justify-center overflow-hidden">
                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i * 123}`} alt="User" />
                            </div>
                        ))}
                    </div>
                    <span>{t('trusted_by')}</span>
                </div>
            </div>

            {/* RIGHT SIDE: Auth Form */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12 relative z-10 min-h-fit py-24">
                <div className="w-full max-w-[440px] glass-surface rounded-[2.5rem] p-8 lg:p-12 shadow-2xl border-white/5 relative overflow-hidden group">
                    {/* Top Accent Line */}
                    <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

                    <div className="text-center mb-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-widest mb-4">
                            System Node: V-2.0.4
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-2">
                            {isSignUp ? t('signup_title') : t('login_title')}
                        </h2>
                        <p className="text-slate-400 text-sm">{isSignUp ? t('signup_subtitle') : t('login_subtitle')}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-4 flex items-center gap-3 animate-shake">
                                <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                                <p className="text-xs text-red-200 font-medium">{error}</p>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">{t('email_label')}</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-[#0d111c]/80 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none"
                                    placeholder={t('email_placeholder')}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">{t('password_label')}</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-[#0d111c]/80 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none"
                                    placeholder={t('password_placeholder')}
                                />
                            </div>
                        </div>

                        {!isSignUp && (
                            <div className="flex justify-end">
                                <button type="button" className="text-xs text-slate-500 hover:text-indigo-400 transition-colors">Forgot identifier?</button>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50 group/btn"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-[3px] border-white/20 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span>{isSignUp ? t('signup_btn') : t('login_btn')}</span>
                                    <LogIn className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-slate-800/50 text-center">
                        <button
                            onClick={() => {
                                setIsSignUp(!isSignUp);
                                setError(null);
                                setEmail('');
                                setPassword('');
                            }}
                            className="text-sm text-slate-400 hover:text-indigo-400 transition-colors"
                        >
                            {isSignUp ? t('have_account') : t('need_account')}
                        </button>
                    </div>

                    <div className="mt-8 flex justify-center gap-4">
                        <SocialIcon icon={<Globe className="w-4 h-4" />} />
                        <SocialIcon icon={<Database className="w-4 h-4" />} />
                    </div>
                </div>
            </div>

            {/* Bottom Credits */}
            <div className="absolute bottom-6 left-12 hidden md:block z-20 pointer-events-none">
                <p className="text-[10px] text-slate-600 font-mono tracking-widest flex items-center gap-2 uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    {t('systems_operational')}
                </p>
            </div>
        </div>
    );
};

const FeatureCard: React.FC<{ icon: React.ReactNode, title: string, desc: string }> = ({ icon, title, desc }) => (
    <div className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all hover:bg-white/[0.08] group">
        <div className="mb-3">{icon}</div>
        <h3 className="text-white font-bold text-sm mb-1 group-hover:text-indigo-300 transition-colors">{title}</h3>
        <p className="text-slate-400 text-xs leading-relaxed">{desc}</p>
    </div>
);

const SocialIcon: React.FC<{ icon: React.ReactNode }> = ({ icon }) => (
    <div className="p-3 rounded-full bg-slate-800/50 border border-white/5 text-slate-500 hover:text-white hover:bg-slate-700/50 cursor-pointer transition-all">
        {icon}
    </div>
);

export default LoginPage;