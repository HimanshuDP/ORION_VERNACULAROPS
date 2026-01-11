import React, { useState, useEffect, useMemo } from 'react';
import Papa from 'papaparse';
import { FileText, Database, Table, Server, FolderTree, FileCode } from 'lucide-react';

import { useLanguage } from '../services/LanguageContext';

interface DataViewerProps {
    files: Record<string, string>;
    userId?: string;
}

const DataViewer: React.FC<DataViewerProps> = ({ files, userId }) => {
    const { t } = useLanguage();
    const fileNames = Object.keys(files);
    const [activeTab, setActiveTab] = useState<'DATA' | 'SCHEMA'>('DATA');
    const [activeFile, setActiveFile] = useState<string | null>(null);

    useEffect(() => {
        if (fileNames.length > 0 && (!activeFile || !files[activeFile])) {
            setActiveFile(fileNames[0]);
        } else if (fileNames.length === 0) {
            setActiveFile(null);
        }
    }, [fileNames, activeFile, files]);

    const parsedData = useMemo(() => {
        if (activeTab === 'SCHEMA' || !activeFile || !files[activeFile]) return null;

        console.log('🔍 DataViewer parsing file:', activeFile);
        console.log('   - Raw data length:', files[activeFile].length);
        console.log('   - First 200 chars:', files[activeFile].substring(0, 200));

        const result = Papa.parse(files[activeFile], {
            header: true,
            skipEmptyLines: true,
            preview: 500 // Aligned with Terminal upload limit (was 100)
        });

        console.log('   - Parsed columns:', result.meta.fields);
        console.log('   - Parsed rows:', result.data.length);
        console.log('   - First parsed row:', result.data[0]);

        return {
            columns: result.meta.fields || [],
            data: result.data as Record<string, string>[]
        };
    }, [activeFile, files, activeTab]);

    const renderSchemaView = () => {
        return (
            <div className="p-6 font-mono text-xs text-slate-300 h-full overflow-auto">
                <div className="mb-6">
                    <h3 className="text-indigo-400 font-bold mb-2 flex items-center gap-2 uppercase">
                        <Server className="w-4 h-4" /> FIREBASE FIRESTORE STRUCTURE
                    </h3>
                    <p className="text-slate-500 mb-4">
                        This visualizes how your data is stored securely in the backend database.
                    </p>
                </div>

                <div className="border-l border-slate-700 pl-4 space-y-4">
                    {/* Root */}
                    <div className="relative">
                        <div className="flex items-center gap-2 text-slate-400">
                            <FolderTree className="w-4 h-4 text-yellow-500" />
                            <span className="font-bold">/users</span> (Collection)
                        </div>

                        {/* User Document */}
                        <div className="ml-6 mt-2 border-l border-slate-700 pl-4 relative">
                            <div className="flex items-center gap-2 text-slate-300">
                                <FileCode className="w-4 h-4 text-purple-400" />
                                <span className="bg-slate-800 px-1 rounded text-purple-200">{userId || 'uid_placeholder'}</span>
                            </div>

                            {/* Files Sub-Collection */}
                            <div className="ml-6 mt-4">
                                <div className="flex items-center gap-2 text-slate-400 mb-2">
                                    <FolderTree className="w-4 h-4 text-blue-500" />
                                    <span>/files</span>
                                </div>
                                <div className="ml-6 border-l border-slate-800 pl-4 space-y-2">
                                    {fileNames.length === 0 ? (
                                        <span className="text-slate-600 italic">-- empty --</span>
                                    ) : (
                                        fileNames.map(f => (
                                            <div key={f} className="flex items-center gap-2">
                                                <FileText className="w-3 h-3 text-emerald-400" />
                                                <span>{f}</span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Chats Sub-Collection */}
                            <div className="ml-6 mt-4">
                                <div className="flex items-center gap-2 text-slate-400 mb-2">
                                    <FolderTree className="w-4 h-4 text-orange-500" />
                                    <span>/chats</span>
                                </div>
                                <div className="ml-6 border-l border-slate-800 pl-4">
                                    <span className="text-slate-500 italic">
                                        (Stores message history & analytics results)
                                    </span>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // ----------------------------------------------------------------------------------
    // MAIN RENDER
    // ----------------------------------------------------------------------------------
    return (
        <div className="w-full h-full flex flex-col bg-slate-900/50 backdrop-blur border border-slate-700 rounded-lg overflow-hidden shadow-inner">

            {/* Top Level Mode Tabs */}
            <div className="flex items-center bg-slate-950 border-b border-slate-700 shrink-0">
                <button
                    onClick={() => setActiveTab('DATA')}
                    className={`px-6 py-2 text-xs font-mono font-bold transition-colors border-r border-slate-800 ${activeTab === 'DATA' ? 'text-white bg-slate-800' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    {t('raw_data') || 'DATA TABLES'}
                </button>
                <button
                    onClick={() => setActiveTab('SCHEMA')}
                    className={`px-6 py-2 text-xs font-mono font-bold transition-colors border-r border-slate-800 ${activeTab === 'SCHEMA' ? 'text-indigo-400 bg-slate-800' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    DB STRUCTURE
                </button>
            </div>

            {activeTab === 'SCHEMA' ? (
                renderSchemaView()
            ) : fileNames.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-500 p-8 text-center">
                    <Database className="w-12 h-12 mb-4 opacity-50" />
                    <p className="font-mono text-sm uppercase">{t('no_files')}</p>
                </div>
            ) : (
                <>
                    {/* File Tabs */}
                    <div className="flex items-center bg-slate-900/80 border-b border-slate-700 overflow-x-auto scrollbar-hide shrink-0">
                        <div className="px-3 py-2 text-slate-500 border-r border-slate-800">
                            <Table className="w-4 h-4" />
                        </div>
                        {fileNames.map(name => (
                            <button
                                key={name}
                                onClick={() => setActiveFile(name)}
                                className={`px-4 py-2 text-xs font-mono flex items-center gap-2 transition-colors whitespace-nowrap ${activeFile === name
                                    ? 'bg-slate-800 text-indigo-400 border-r border-slate-700'
                                    : 'text-slate-500 hover:text-slate-300 border-r border-slate-800'
                                    }`}
                            >
                                <FileText className="w-3 h-3" />
                                {name}
                            </button>
                        ))}
                    </div>

                    {/* Table Content */}
                    <div className="flex-1 overflow-auto relative">
                        {parsedData && parsedData.columns.length > 0 ? (
                            <table className="w-full text-left border-collapse font-mono">
                                <thead className="bg-slate-800/90 sticky top-0 z-10 text-[10px] text-slate-400 uppercase tracking-wider backdrop-blur">
                                    <tr>
                                        {parsedData.columns.map((col) => (
                                            <th key={col} className="px-4 py-3 border-b border-slate-700 font-medium whitespace-nowrap">
                                                {col}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="text-xs text-slate-300 divide-y divide-slate-800/50">
                                    {parsedData.data.map((row, idx) => (
                                        <tr key={idx} className="hover:bg-slate-800/50 transition-colors">
                                            {parsedData.columns.map((col) => (
                                                <td key={`${idx}-${col}`} className="px-4 py-2 border-r border-slate-800/30 last:border-r-0 whitespace-nowrap truncate max-w-[200px]">
                                                    {row[col]}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-slate-500 font-mono text-xs">
                                <p>Unable to parse data or file is empty</p>
                            </div>
                        )}
                    </div>

                    {/* Status Bar */}
                    <div className="bg-slate-900 border-t border-slate-700 p-2 text-[10px] font-mono text-slate-500 flex justify-between items-center shrink-0">
                        <div className="flex items-center gap-4">
                            <span>PREVIEW MODE (TOP 500 ROWS)</span>
                            <span className="text-indigo-400/50">|</span>
                            <span>{t('total_rows')}: {parsedData?.data.length}</span>
                        </div>
                        <span className="text-indigo-400">{activeFile}</span>
                    </div>
                </>
            )}
        </div>
    );
};

export default DataViewer;