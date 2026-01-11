# Debug Steps for Garbled Data

## What to Check in Browser Console

After uploading a file, look for these log messages:

### 1. Upload Stage (Terminal.tsx)
```
📁 File selected: filename.csv
📄 File read as text, length: XXXX  ← MUST see this!
✅ CSV validated successfully
📤 Uploading original CSV to Firebase
```

**If you DON'T see "📄 File read as text"**: The FileReader code isn't running. Server needs restart.

### 2. Data Context Stage (App.tsx)
```
📊 Data context updated from Firebase
   - Files loaded: 1
   - filename.csv: XXXX characters
```

### 3. Display Stage (DataViewer.tsx)
```
🔍 DataViewer parsing file: filename.csv
   - Raw data length: XXXX
   - First 200 chars: [should show actual CSV text]
   - Parsed columns: [array of column names]
   - Parsed rows: XX
```

## What Each Stage Tells Us

- **No "📄 File read as text"** → FileReader code not active, need server restart
- **"First 200 chars" shows garbled symbols** → Data corrupted in Firebase
- **"First 200 chars" shows readable CSV** → DataViewer parsing issue
- **"Parsed columns" is empty or wrong** → Papa.parse failing

## Next Steps

1. Open browser console (F12)
2. Remove all existing files from app
3. Upload a fresh CSV
4. Copy ALL console output
5. Share the output to diagnose exact issue
