import { initializeApp } from 'firebase/app';
import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';
import {
    getFirestore,
    collection,
    addDoc,
    query,
    where,
    orderBy,
    onSnapshot,
    setDoc,
    doc,
    deleteDoc,
    serverTimestamp
} from 'firebase/firestore';
import { TerminalMessage } from '../types';

// =========================================================================
// FIREBASE CONFIGURATION
// =========================================================================

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "REPLACE_ME",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

console.log('🚀 Checking Firebase Configuration Status...');
const missingKeys = Object.entries(firebaseConfig)
    .filter(([_, value]) => !value || value === "REPLACE_ME")
    .map(([key]) => key);

if (missingKeys.length > 0) {
    console.warn(`⚠️ Firebase is in MOCK MODE because these keys are missing in .env.local: ${missingKeys.join(', ')}`);
    console.info('👉 Follow the FIREBASE_GUIDE.md to fix this.');
} else {
    console.log('✅ All Firebase environment variables detected.');
}

// =========================================================================
// AUTHENTICATION & DATABASE ABSTRACTION LAYER
// =========================================================================

const isMockMode = !firebaseConfig.apiKey || firebaseConfig.apiKey === "REPLACE_ME";

export interface AppUser {
    uid: string;
    email: string | null;
    displayName?: string | null;
}

let _auth: any;
let _db: any;
let _login: (email: string, pass: string) => Promise<any>;
let _signup: (email: string, pass: string) => Promise<any>;
let _logout: () => Promise<void>;
let _subscribe: (callback: (user: AppUser | null) => void) => () => void;
let _saveMessage: (userId: string, message: TerminalMessage) => Promise<void>;
let _saveFile: (userId: string, fileName: string, content: string) => Promise<void>;
let _deleteFile: (userId: string, fileName: string) => Promise<void>;
let _subscribeToHistory: (userId: string, callback: (msgs: TerminalMessage[]) => void) => () => void;
let _subscribeToFiles: (userId: string, callback: (files: Record<string, string>) => void) => () => void;

if (!isMockMode) {
    try {
        const app = initializeApp(firebaseConfig);
        _auth = getAuth(app);
        _db = getFirestore(app);
        console.log('🔥 Firebase Initialized: REAL BACKEND ACTIVE');

        _login = async (email, password) => {
            console.log('🔑 Firebase: Attempting Login...');
            return signInWithEmailAndPassword(_auth, email, password);
        };

        _signup = async (email, password) => {
            console.log('📝 Firebase: Attempting Signup...');
            return createUserWithEmailAndPassword(_auth, email, password);
        };

        _logout = () => signOut(_auth);
        _subscribe = (callback) => onAuthStateChanged(_auth, (user) => {
            console.log('👤 Auth State:', user ? `USER_ID: ${user.uid}` : 'NO_USER');
            callback(user ? { uid: user.uid, email: user.email, displayName: user.displayName } : null);
        });

        _saveMessage = async (userId, message) => {
            try {
                console.log('💾 Firestore: Saving message...');
                // Firestore does NOT allow 'undefined'. We must clean the object.
                const msgData: any = {
                    sender: message.sender,
                    text: message.text,
                    timestamp: message.timestamp.toISOString(),
                    createdAt: serverTimestamp()
                };

                if (message.chartData !== undefined) msgData.chartData = message.chartData;
                if (message.tableData !== undefined) msgData.tableData = message.tableData;

                await addDoc(collection(_db, 'users', userId, 'chats'), msgData);
                console.log('✅ Firestore: Message saved');
            } catch (err) {
                console.error('❌ Firestore: SAVE_MESSAGE_ERROR:', err);
                throw err;
            }
        };

        _saveFile = async (userId, fileName, content) => {
            try {
                console.log(`💾 Firestore: Saving file "${fileName}"...`);
                await setDoc(doc(_db, 'users', userId, 'files', fileName), {
                    content: content,
                    fileName: fileName,
                    updatedAt: serverTimestamp()
                });
                console.log(`✅ Firestore: File "${fileName}" saved`);
            } catch (err) {
                console.error(`❌ Firestore: SAVE_FILE_ERROR for "${fileName}":`, err);
                throw err;
            }
        };

        _deleteFile = async (userId, fileName) => {
            try {
                console.log(`🗑️ Firestore: Deleting file "${fileName}"...`);
                await deleteDoc(doc(_db, 'users', userId, 'files', fileName));
                console.log(`✅ Firestore: File "${fileName}" deleted`);
            } catch (err) {
                console.error(`❌ Firestore: DELETE_FILE_ERROR:`, err);
                throw err;
            }
        };

        _subscribeToHistory = (userId, callback) => {
            const q = query(collection(_db, 'users', userId, 'chats'), orderBy('createdAt', 'asc'));
            return onSnapshot(q, (snapshot) => {
                const messages: TerminalMessage[] = snapshot.docs.map(doc => {
                    const data = doc.data();
                    let ts = new Date();
                    if (data.timestamp) ts = new Date(data.timestamp);
                    return { id: doc.id, ...data, timestamp: isNaN(ts.getTime()) ? new Date() : ts } as TerminalMessage;
                });
                callback(messages);
            }, (err) => console.error('❌ Firestore: HISTORY_SYNC_ERROR:', err));
        };

        _subscribeToFiles = (userId, callback) => {
            const q = query(collection(_db, 'users', userId, 'files'));
            return onSnapshot(q, (snapshot) => {
                const files: Record<string, string> = {};
                snapshot.docs.forEach(doc => {
                    const data = doc.data();
                    files[data.fileName] = data.content;
                });
                callback(files);
            }, (err) => console.error('❌ Firestore: FILES_SYNC_ERROR:', err));
        };

    } catch (error) {
        console.error("❌ Firebase Core Error:", error);
    }
} else {
    // MOCK BACKEND
    console.log("%c 🟢 VERNACULAR OPS: MOCK MODE ACTIVE (LOCAL ONLY) ", "background: #10b981; color: white");

    _auth = { currentUser: null };
    const mockListeners = new Set<(user: AppUser | null) => void>();
    let mockUser: AppUser | null = null;
    const mockDb = { chats: {} as Record<string, any[]>, files: {} as Record<string, any> };
    const chatSubs = new Map();
    const fileSubs = new Map();

    _login = async (email, _) => {
        mockUser = { uid: `mock_${email}`, email, displayName: email.split('@')[0] };
        mockListeners.forEach(cb => cb(mockUser));
        return { user: mockUser };
    };
    _signup = _login;
    _logout = async () => { mockUser = null; mockListeners.forEach(cb => cb(null)); };
    _subscribe = (cb) => { mockListeners.add(cb); cb(mockUser); return () => mockListeners.delete(cb); };
    _saveMessage = async (uid, msg) => {
        if (!mockDb.chats[uid]) mockDb.chats[uid] = [];
        mockDb.chats[uid].push(msg);
        chatSubs.get(uid)?.forEach((cb: any) => cb([...mockDb.chats[uid]]));
    };
    _saveFile = async (uid, name, content) => {
        if (!mockDb.files[uid]) mockDb.files[uid] = {};
        mockDb.files[uid][name] = content;
        fileSubs.get(uid)?.forEach((cb: any) => cb({ ...mockDb.files[uid] }));
    };
    _deleteFile = async (uid, name) => {
        if (mockDb.files[uid]) delete mockDb.files[uid][name];
        fileSubs.get(uid)?.forEach((cb: any) => cb({ ...mockDb.files[uid] }));
    };
    _subscribeToHistory = (uid, cb) => {
        if (!chatSubs.has(uid)) chatSubs.set(uid, new Set());
        chatSubs.get(uid).add(cb);
        cb(mockDb.chats[uid] || []);
        return () => chatSubs.get(uid).delete(cb);
    };
    _subscribeToFiles = (uid, cb) => {
        if (!fileSubs.has(uid)) fileSubs.set(uid, new Set());
        fileSubs.get(uid).add(cb);
        cb(mockDb.files[uid] || {});
        return () => fileSubs.get(uid).delete(cb);
    };
}

export const auth = _auth;
export const loginService = _login;
export const signupService = _signup;
export const logoutService = _logout;
export const subscribeToAuth = _subscribe;
export const saveMessage = _saveMessage;
export const saveFile = _saveFile;
export const deleteFile = _deleteFile;
export const subscribeToHistory = _subscribeToHistory;
export const subscribeToFiles = _subscribeToFiles;
