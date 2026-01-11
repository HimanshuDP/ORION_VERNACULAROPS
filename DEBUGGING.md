# Vernacular OPS - Debugging Guide

## Quick Start Checklist

### 1. Environment Setup
- [ ] Copy `.env.example` to `.env.local`
- [ ] Add your Gemini API key to `.env.local`:
  ```
  GEMINI_API_KEY=your_actual_api_key_here
  ```
- [ ] Restart dev server after adding API key

### 2. Firebase Configuration
- [ ] Ensure Firebase credentials are configured
- [ ] Check browser console for Firebase auth errors

### 3. Test Data Upload
1. Open browser console (F12)
2. Upload a CSV file
3. Look for these log messages:
   - `📁 File selected:` - File was selected
   - `✅ CSV parsed successfully` - File parsed correctly
   - `📤 Uploading to Firebase:` - Upload initiated
   - `✅ File saved successfully` - Upload completed
   - `📊 Data context updated` - Data loaded into app

## Common Issues

### Issue: "No data displaying"

**Symptoms**: File uploads but doesn't show in DataViewer

**Debug steps**:
1. Check console for `📊 Data context updated` message
2. Verify file count is > 0
3. Open Developer Inspector (DEV button) → check "ACTIVE DATA SOURCES"

**Solution**: If data context is empty, check Firebase connection

---

### Issue: "AI not responding"

**Symptoms**: File uploads successfully but AI gives errors

**Debug steps**:
1. Check for `GEMINI_API_KEY` in `.env.local`
2. Look for API errors in console
3. Verify API key is valid

**Solution**: Add/update API key and restart server

---

### Issue: "File upload fails"

**Symptoms**: Error message when selecting file

**Debug steps**:
1. Check console for `❌ CSV Parse Error`
2. Verify file is valid CSV format
3. Check file size (should be reasonable)

**Solution**: Ensure CSV has headers and is properly formatted

## Console Log Reference

| Emoji | Message | Meaning |
|-------|---------|---------|
| 📁 | File selected | User selected a file |
| ✅ | CSV parsed successfully | File parsed without errors |
| 📤 | Uploading to Firebase | Upload process started |
| 💾 | Saving file to Firebase | Firebase save initiated |
| 📊 | Data context updated | Files loaded into memory |
| ❌ | Error messages | Something went wrong |
| ⚠️ | Warning messages | Potential issues |

## Testing Steps

1. **Upload Test**:
   - Select CSV with 100+ rows
   - Verify all log messages appear
   - Check "Data Loaded" system message

2. **Display Test**:
   - Switch to DATA TABLES tab
   - Verify file appears as tab
   - Check table shows data

3. **AI Test**:
   - Ask: "show me the data"
   - Verify AI responds with table
   - Check confidence score updates

## Need Help?

Check browser console (F12) for detailed logs. All operations are logged with emoji indicators for easy tracking.
