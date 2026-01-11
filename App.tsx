import React, { useState, useEffect } from 'react';
import DataViewer from './components/DataViewer';
import Terminal from './components/Terminal';
import LoginPage from './components/LoginPage';
import { processCommand } from './services/ai';
import { BusinessState, TerminalMessage, INITIAL_BUSINESS_STATE, InsightType } from './types';
import canvasConfetti from 'canvas-confetti';
import {
    subscribeToAuth,
    logoutService,
    AppUser,
    subscribeToHistory,
    subscribeToFiles,
    saveMessage,
    saveFile,
    deleteFile
} from './services/firebase';
import { LogOut, Code, Bug, X, Database, Cpu } from 'lucide-react';

import { useLanguage } from './services/LanguageContext';

const App: React.FC = () => {
    const { t, language, setLanguage } = useLanguage();
    const [user, setUser] = useState<AppUser | null>(null);
    const [authLoading, setAuthLoading] = useState(true);

    const [businessState, setBusinessState] = useState<BusinessState>(INITIAL_BUSINESS_STATE);
    const [messages, setMessages] = useState<TerminalMessage[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [dataContext, setDataContext] = useState<Record<string, string>>({});

    const [showDevPanel, setShowDevPanel] = useState(false);

    // 1. Auth Listener
    useEffect(() => {
        const unsubscribe = subscribeToAuth((currentUser) => {
            setUser(currentUser);
            setAuthLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // 2. Data Subscriptions (History & Files) - Triggers when User changes
    useEffect(() => {
        if (!user) {
            setMessages([]);
            setDataContext({});
            return;
        }

        // Subscribe to chat history
        const unsubHistory = subscribeToHistory(user.uid, (history) => {
            if (history.length === 0) {
                // Default Welcome Message if no history
                setMessages([{
                    id: 'init-1',
                    sender: 'system',
                    text: t('terminal_welcome'),
                    timestamp: new Date()
                }]);
            } else {
                setMessages(history);
            }
        });

        // Subscribe to Files
        const unsubFiles = subscribeToFiles(user.uid, (files) => {
            console.log('📊 Data context updated from Firebase');
            console.log('   - Files loaded:', Object.keys(files).length);
            Object.keys(files).forEach(fileName => {
                console.log(`   - ${fileName}: ${files[fileName].length} characters`);
            });

            setDataContext(files);
            // Optional: Update Business State based on file count
            if (Object.keys(files).length > 0) {
                setBusinessState(prev => ({ ...prev, recordsLoaded: 1000 })); // Approximate or could store metadata
            }
        });

        return () => {
            unsubHistory();
            unsubFiles();
        };
    }, [user, t]); // Added t as dependency


    const handleLogout = async () => {
        try {
            await logoutService();
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    const handleFileUpload = async (files: Array<{ name: string, content: string, rowCount: number }> | { name: string, content: string, rowCount: number }) => {
        if (!user) return;

        const filesToUpload = Array.isArray(files) ? files : [files];

        console.log(`🔄 App.handleFileUpload called for ${filesToUpload.length} file(s)`);

        try {
            // Upload all files
            const uploadPromises = filesToUpload.map(f => {
                console.log(`   - Saving: ${f.name} (${f.rowCount} rows)`);
                return saveFile(user.uid, f.name, f.content);
            });

            await Promise.all(uploadPromises);
            console.log('✅ All files saved successfully');

            // Filter out empty skips from the message results
            const successFiles = filesToUpload.filter(f => !f.name.startsWith('EMPTY_SKIP_'));

            // Add ONE summary system message
            let messageText = "";
            if (successFiles.length === 1) {
                messageText = `📊 ${t('data_loaded')}: ${successFiles[0].name} \n(${successFiles[0].rowCount} ${t('rows_tracked')})`;
            } else if (successFiles.length > 1) {
                const itemNames = successFiles.map(f => f.name.replace('.csv', '')).join(', ');
                messageText = `📊 ${t('data_loaded')}: ${successFiles.length} ${t('items_collected')}\nItems: ${itemNames}\nTotal rows tracked across all data sources.`;
            } else {
                messageText = `⚠️ No valid data was found in the upload.`;
            }

            const sysMsg: TerminalMessage = {
                id: Date.now().toString(),
                sender: 'system',
                text: messageText,
                timestamp: new Date()
            };
            await saveMessage(user.uid, sysMsg);
            console.log('✅ Summary system message sent');

        } catch (e) {
            console.error("❌ Upload failed:", e);
            alert(`Failed to upload file(s): ${e instanceof Error ? e.message : 'Unknown error'}`);
        }
    };

    const handleRemoveFile = async (fileName: string) => {
        if (!user) return;
        try {
            await deleteFile(user.uid, fileName);
            // System message
            const sysMsg: TerminalMessage = {
                id: Date.now().toString(),
                sender: 'system',
                text: `${t('file_removed')}: ${fileName}`,
                timestamp: new Date()
            };
            await saveMessage(user.uid, sysMsg);
        } catch (e) {
            console.error("Delete failed", e);
        }
    };

    const handleRemoveAllFiles = async () => {
        const fileNames = Object.keys(dataContext);
        if (!user || fileNames.length === 0) return;
        if (!confirm(`Are you sure you want to remove all ${fileNames.length} files?`)) return;

        try {
            console.log('🗑️ Removing all files...');
            const deletePromises = fileNames.map(f => deleteFile(user.uid, f));
            await Promise.all(deletePromises);

            const sysMsg: TerminalMessage = {
                id: Date.now().toString(),
                sender: 'system',
                text: `🗑️ ${t('workspace_cleared')}`,
                timestamp: new Date()
            };
            await saveMessage(user.uid, sysMsg);
            console.log('✅ Workspace cleared');
        } catch (e) {
            console.error("Clear all failed", e);
        }
    };

    const handleSendCommand = async (commandText: string) => {
        if (!user) return;

        // 1. Create User Message
        const userMsg: TerminalMessage = {
            id: Date.now().toString(),
            sender: 'user',
            text: commandText,
            timestamp: new Date()
        };

        // 2. Optimistically add to UI (optional, but good for perceived speed)
        // We rely on Firestore subscription mostly, but adding it locally prevents "jumpiness" if offline
        // setMessages(prev => [...prev, userMsg]); 

        setIsProcessing(true);
        setBusinessState(prev => ({ ...prev, status: 'ANALYZING' }));

        try {
            // 3. Save User Message to DB
            await saveMessage(user.uid, userMsg);

            // 4. Process Logic (AI)
            const newState = await processCommand(commandText, businessState, dataContext);
            setBusinessState(newState);

            // 5. Create System Message
            const sysMsg: TerminalMessage = {
                id: (Date.now() + 1).toString(),
                sender: 'system',
                text: newState.message || "Analysis complete.",
                timestamp: new Date(),
                chartData: newState.chartData,
                tableData: newState.tableData
            };

            // 6. Save System Message to DB
            await saveMessage(user.uid, sysMsg);

            // 7. Effects
            if (newState.insightType === InsightType.FINANCIAL && newState.confidenceScore > 80) {
                canvasConfetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#34d399', '#10b981', '#fbbf24']
                });
            }

        } catch (error) {
            console.error(error);
            const errorMsg: TerminalMessage = {
                id: Date.now().toString(),
                sender: 'system',
                text: 'ERROR: Business logic core unreachable.',
                timestamp: new Date()
            };
            // We might not save errors to DB, or we can.
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsProcessing(false);
        }
    };

    if (authLoading) {
        return (
            <div className="h-screen w-screen bg-slate-950 flex items-center justify-center text-slate-500 font-mono">
                INITIALIZING SECURE CONNECTION...
            </div>
        );
    }

    if (!user) {
        return <LoginPage />;
    }

    return (
        <div className="flex h-screen w-screen bg-slate-950 text-white overflow-hidden relative">
            {/* DEV MODAL */}
            {showDevPanel && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-700 rounded-lg shadow-2xl flex flex-col overflow-hidden">
                        <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800">
                            <h2 className="font-mono font-bold text-white flex items-center gap-2">
                                <Bug className="w-5 h-5 text-red-400" /> {t('dev_mode')} INSPECTOR
                            </h2>
                            <button onClick={() => setShowDevPanel(false)} className="text-slate-400 hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-auto p-6 font-mono text-xs space-y-6">
                            <section>
                                <h3 className="text-indigo-400 font-bold mb-2 border-b border-indigo-500/30 pb-1 flex items-center gap-2">
                                    <Cpu className="w-4 h-4" /> CURRENT USER SESSION (AUTH)
                                </h3>
                                <pre className="bg-slate-950 p-4 rounded text-slate-300 border border-slate-800 overflow-auto max-h-[200px] scrollbar-thin">
                                    {JSON.stringify(user, null, 2)}
                                </pre>
                            </section>
                            <section>
                                <h3 className="text-emerald-400 font-bold mb-2 border-b border-emerald-500/30 pb-1 flex items-center gap-2">
                                    <Database className="w-4 h-4" /> BUSINESS STATE (AI CONTEXT)
                                </h3>
                                <pre className="bg-slate-950 p-4 rounded text-slate-300 border border-slate-800 overflow-auto max-h-[200px] scrollbar-thin">
                                    {JSON.stringify(businessState, null, 2)}
                                </pre>
                            </section>
                            <section>
                                <h3 className="text-amber-400 font-bold mb-2 border-b border-amber-500/30 pb-1 flex items-center gap-2">
                                    <Code className="w-4 h-4" /> ACTIVE DATA SOURCES (IN-MEMORY)
                                </h3>
                                <div className="bg-slate-950 p-4 rounded text-slate-300 border border-slate-800">
                                    {Object.keys(dataContext).length === 0 ? (
                                        <span className="text-slate-600 italic">No files loaded in memory</span>
                                    ) : (
                                        Object.keys(dataContext).map(key => (
                                            <div key={key} className="flex justify-between border-b border-slate-800 last:border-0 py-2">
                                                <span className="text-indigo-300">{key}</span>
                                                <span className="text-slate-500">{(dataContext[key].length / 1024).toFixed(2)} KB</span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            )}

            {/* Left Side - Data Viewer */}
            <div className="w-1/2 h-full p-6 flex flex-col gap-4 relative">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black -z-10"></div>

                <header className="flex justify-between items-start shrink-0">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white/90">{t('brand_name')}</h1>
                        <p className="text-indigo-400 text-sm font-mono tracking-wider">{t('dashboard_title')}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        {/* Language Selector */}
                        <div className="flex bg-slate-900/50 rounded-lg p-1 border border-slate-800">
                            <button
                                onClick={() => setLanguage('en')}
                                className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${language === 'en' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                            >
                                EN
                            </button>
                            <button
                                onClick={() => setLanguage('hi')}
                                className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${language === 'hi' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                            >
                                हिं
                            </button>
                        </div>

                        <button
                            onClick={() => setShowDevPanel(true)}
                            className="flex items-center gap-2 text-xs font-mono text-slate-500 hover:text-indigo-400 transition-colors"
                            title="Open Developer Inspector"
                        >
                            <Code className="w-4 h-4" /> {t('dev_mode')}
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 text-xs font-mono text-slate-500 hover:text-red-400 transition-colors"
                            title="Sign Out"
                        >
                            <LogOut className="w-4 h-4" /> {t('sign_out')}
                        </button>
                    </div>
                </header>

                <div className="flex-1 min-h-0 relative">
                    <DataViewer files={dataContext} userId={user.uid} />
                </div>

                <div className="grid grid-cols-2 gap-4 shrink-0">
                    <div className="bg-slate-900/80 border border-slate-700 p-3 rounded backdrop-blur">
                        <div className="text-xs text-slate-500 font-mono mb-1">{t('user_id')}</div>
                        <div className="text-xs font-mono text-emerald-400 truncate">{user.email}</div>
                    </div>
                    <div className="bg-slate-900/80 border border-slate-700 p-3 rounded backdrop-blur">
                        <div className="text-xs text-slate-500 font-mono mb-1">{t('data_layer')}</div>
                        <div className="text-xl font-mono text-indigo-400">
                            {Object.keys(dataContext).length > 0 ? t('active') : t('awaiting_input')}
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Terminal Interface */}
            <div className="w-1/2 h-full">
                <Terminal
                    messages={messages}
                    businessState={businessState}
                    onSendCommand={handleSendCommand}
                    onFileUpload={handleFileUpload}
                    onRemoveFile={handleRemoveFile}
                    onRemoveAllFiles={handleRemoveAllFiles}
                    isProcessing={isProcessing}
                    activeFiles={Object.keys(dataContext)}
                />
            </div>
        </div>
    );
};

export default App;