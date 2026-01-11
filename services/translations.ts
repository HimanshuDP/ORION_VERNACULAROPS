export type Language = 'en' | 'hi';

export const translations = {
    en: {
        // Header
        brand_name: "Vernacular Ops",
        dashboard_title: "DATA INSPECTOR & ANALYTICS",
        dev_mode: "DEV",
        sign_out: "SIGN OUT",
        user_id: "USER ID",
        data_layer: "DATA LAYER",
        active: "ACTIVE",
        awaiting_input: "AWAITING INPUT",

        // Login Page
        login_title: "Login Existing User",
        signup_title: "Sign Up New Operator",
        login_subtitle: "Welcome back to your command center.",
        signup_subtitle: "Join the Vernacular Ops intelligence network.",
        email_label: "Network Identifier",
        password_label: "Encrypted Key",
        email_placeholder: "Enter your email",
        password_placeholder: "Enter your password",
        login_btn: "LOGIN",
        signup_btn: "SIGN UP",
        need_account: "Don't have an account? Sign Up",
        have_account: "Already have an account? Login",
        ai_powered: "AI-POWERED",
        bi: "BUSINESS INTELLIGENCE",
        bi_desc: "Transform multi-sheet data into actionable vernacular insights in seconds. Enterprise-grade security for your data-driven decisions.",
        secure_storage: "Secure Storage",
        secure_desc: "Military-grade encryption for all your uploaded business context.",
        instant_analysis: "Instant Analysis",
        instant_desc: "Real-time multi-sheet processing with Google Gemini 1.5.",
        vernacular_support: "Vernacular Support",
        vernacular_desc: "Natural language processing in Hindi, English, and beyond.",
        smart_visuals: "Smart Visuals",
        smart_desc: "Automatic chart generation and predictive trend analysis.",
        trusted_by: "Trusted by 500+ Enterprise Operators",
        systems_operational: "All Systems Operational • Data encryption active",

        // Terminal
        terminal_welcome: "Hello. I am Vernacular Ops. \nUpload your business data (CSV) or ask me anything.",
        terminal_placeholder: "Enter command or ask a question...",
        analyzing: "ANALYZING",
        ready: "READY",
        upload_data: "Upload Data",
        clear_workspace: "Clear Workspace",
        items_collected: "items collected",
        data_loaded: "Data Loaded",
        rows_tracked: "rows tracked",
        file_removed: "File removed",
        workspace_cleared: "Workspace cleared. All files removed.",

        // Data Viewer
        no_files: "No data sources active. Please upload a CSV or Excel file.",
        raw_data: "RAW DATA PREVIEW",
        total_rows: "Total Rows",
        columns: "Columns"
    },
    hi: {
        // Header
        brand_name: "वर्नाकुलर ऑप्स",
        dashboard_title: "डेटा निरीक्षक और विश्लेषण",
        dev_mode: "डेव",
        sign_out: "साइन आउट",
        user_id: "यूजर आईडी",
        data_layer: "डेटा लेयर",
        active: "सक्रिय",
        awaiting_input: "इनपुट की प्रतीक्षा",

        // Login Page
        login_title: "मौजूदा यूजर लॉगिन करें",
        signup_title: "नए ऑपरेटर रजिस्टर करें",
        login_subtitle: "अपने कमांड सेंटर में वापस स्वागत है।",
        signup_subtitle: "वर्नाकुलर ऑप्स इंटेलिजेंस नेटवर्क से जुड़ें।",
        email_label: "नेटवर्क पहचानकर्ता",
        password_label: "एन्क्रिप्टेड कुंजी",
        email_placeholder: "अपना ईमेल दर्ज करें",
        password_placeholder: "अपना पासवर्ड दर्ज करें",
        login_btn: "लॉगिन",
        signup_btn: "साइन अप",
        need_account: "अकाउंट नहीं है? साइन अप करें",
        have_account: "पहले से अकाउंट है? लॉगिन करें",
        ai_powered: "एआई-संचालित",
        bi: "बिजनेस इंटेलिजेंस",
        bi_desc: "मल्टी-शीट डेटा को कुछ ही सेकंड में कार्रवाई योग्य वर्नाकुलर अंतर्दृष्टि में बदलें। आपके डेटा-संचालित निर्णयों के लिए एंटरप्राइज-ग्रेड सुरक्षा।",
        secure_storage: "सुरक्षित स्टोरेज",
        secure_desc: "आपके सभी अपलोड किए गए बिजनेस संदर्भ के लिए मिलिट्री-ग्रेड एन्क्रिप्शन।",
        instant_analysis: "त्वरित विश्लेषण",
        instant_desc: "गूगल जेमिनी 1.5 के साथ रीयल-टाइम मल्टी-शीट प्रोसेसिंग।",
        vernacular_support: "वर्नाकुलर सहायता",
        vernacular_desc: "हिंदी, अंग्रेजी और उससे आगे में प्राकृतिक भाषा प्रसंस्करण।",
        smart_visuals: "स्मार्ट विजुअल्स",
        smart_desc: "स्वचालित चार्ट निर्माण और भविष्य कहनेवाला प्रवृत्ति विश्लेषण।",
        trusted_by: "500+ एंटरप्राइज ऑपरेटरों द्वारा विश्वसनीय",
        systems_operational: "सभी सिस्टम चालू हैं • डेटा एन्क्रिप्शन सक्रिय है",

        // Terminal
        terminal_welcome: "नमस्ते। मैं वर्नाकुलर ऑप्स हूँ। \nअपना बिजनेस डेटा (CSV) अपलोड करें या मुझसे कुछ भी पूछें।",
        terminal_placeholder: "कमांड दर्ज करें या प्रश्न पूछें...",
        analyzing: "विश्लेषण कर रहा है",
        ready: "तैयार",
        upload_data: "डेटा अपलोड करें",
        clear_workspace: "वर्कस्पेस खाली करें",
        items_collected: "आइटम एकत्र किए गए",
        data_loaded: "डेटा लोड हो गया",
        rows_tracked: "पंक्तियाँ ट्रैक की गईं",
        file_removed: "फ़ाइल हटा दी गई",
        workspace_cleared: "वर्कस्पेस साफ हो गया। सभी फाइलें हटा दी गईं।",

        // Data Viewer
        no_files: "कोई डेटा स्रोत सक्रिय नहीं है। कृपया CSV या Excel फ़ाइल अपलोड करें।",
        raw_data: "रॉ डेटा पूर्वावलोकन",
        total_rows: "कुल पंक्तियाँ",
        columns: "कॉलम"
    }
};
