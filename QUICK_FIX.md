# Quick Fix Guide - Garbled Data

## The Issue
Data showing as garbled characters (◆◆◆ symbols) instead of readable text.

## The Fix Applied
Changed `Terminal.tsx` to use `FileReader` instead of `Papa.unparse()` to preserve original CSV formatting.

## CRITICAL: Clear Old Data First

**The fix only works for NEW uploads.** Old files have corrupted data stored in Firebase.

### Steps to Fix:

1. **Open the app**: http://localhost:3000/

2. **Remove ALL existing files**:
   - Look at bottom of Terminal (right side)
   - You'll see file chips like `January_23.xlsx ×`
   - Click the **X** on each file to remove it
   - This clears corrupted data

3. **Refresh the page**: Press `F5`

4. **Upload a fresh CSV file**:
   - Click paperclip icon
   - Select your CSV
   - Watch for success message

5. **Check the display**:
   - Left panel → DATA TABLES tab
   - Click your file name
   - Data should now be readable!

## If Still Garbled

The code might not have hot-reloaded. **Restart the dev server**:

```bash
# In terminal, press Ctrl+C to stop
# Then run:
npm run dev
```

Then repeat steps above.

## How to Verify Fix is Active

Open browser console (F12) and upload a file. You should see:
```
📁 File selected: filename.csv
📄 File read as text, length: XXXX  ← This line confirms fix is active
✅ CSV validated successfully
```

If you DON'T see "📄 File read as text", the code didn't reload - restart server.
