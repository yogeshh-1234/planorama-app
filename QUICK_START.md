# 🚀 Quick Start Guide - Offline Planorama

## ⚡ 3-Step Setup

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Run the App

**Android:**
```bash
npx react-native run-android
```

**iOS:**
```bash
cd ios && pod install && cd ..
npx react-native run-ios
```

### Step 3: Enjoy!
The app will automatically:
- ✅ Initialize offline database
- ✅ Load sample data (5 events, 8 contacts)
- ✅ Auto-login as "Demo User"
- ✅ Work 100% offline

## 🎮 What You Can Do

### Create Events
1. Tap "+ New Event" on home screen
2. Fill in event details
3. Add images (camera or gallery)
4. Save - works instantly offline!

### Manage Guests
1. Open any event
2. Tap "Invite" button
3. Import from contacts or add manually
4. Send invites (simulated in offline mode)

### RSVP to Events
1. Open an invited event
2. Select: Going / Maybe / Not Going
3. Response saved instantly

### View Dashboard
- **Hosting:** Your created events
- **Invited Events:** Events you're invited to
- **Upcoming/Previous:** Auto-filtered by date

## 📊 Sample Data Included

### Events (5 total)
1. **New Year Celebration 2026** - Dec 31, 2025
2. **Christmas Party 2025** - Dec 25, 2025
3. **Birthday Bash** - Dec 15, 2025
4. **Team Building Workshop** - Nov 20, 2025 (Invited)
5. **Summer BBQ 2024** - Aug 15, 2024 (Past)

### Contacts (8 total)
- Alice Cooper, Bob Martin, Charlie Davis, Diana Prince
- Edward Norton, Fiona Apple, George Lucas, Hannah Montana

### Guests (5 per event)
- John Doe (Going)
- Jane Smith (Going)
- Mike Johnson (Maybe)
- Sarah Williams (Invited)
- David Brown (Not Going)

## 🔧 Common Tasks

### Reset All Data
```typescript
import { OfflineDB } from './src/storage/offlineDB';
OfflineDB.clearAll();
// Restart app to reinitialize
```

### Toggle Online/Offline Mode
Edit `src/api/index.ts`:
```typescript
const OFFLINE_MODE = true;  // Offline
const OFFLINE_MODE = false; // Online (requires backend)
```

### Clear Cache & Rebuild
```bash
# Android
cd android && ./gradlew clean && cd ..
npm start -- --reset-cache
npm run android

# iOS
cd ios && pod install && cd ..
npm start -- --reset-cache
npm run ios
```

## 🐛 Troubleshooting

### "Unable to load script"
```bash
npm start -- --reset-cache
```

### "Task :app:installDebug FAILED"
```bash
cd android && ./gradlew clean && cd ..
npm run android
```

### App crashes on startup
```bash
# Uninstall app from device
# Clear cache
npm start -- --reset-cache
# Reinstall
npm run android
```

### Images not showing
- Check internet permission in AndroidManifest.xml
- Verify image URLs in sample data
- Try using base64 images instead

## 📱 Testing Checklist

- [ ] App launches successfully
- [ ] Home screen shows sample events
- [ ] Can create new event
- [ ] Can edit existing event
- [ ] Can add guests to event
- [ ] Can update RSVP status
- [ ] Can view event details
- [ ] Can add comments
- [ ] Can manage contacts
- [ ] Can update profile
- [ ] Data persists after app restart

## 🎯 Key Features to Test

### Event Creation
1. Tap "+ New Event"
2. Enter title: "Test Event"
3. Select date & time
4. Add location
5. Select RSVP option
6. Save

### Guest Management
1. Open event
2. Tap "Invite"
3. Import from contacts
4. Select guests
5. Add to list

### RSVP Flow
1. Open invited event
2. Tap "Going"
3. See confirmation
4. Check guest list updates

## 💡 Pro Tips

1. **Fast Development**
   - Enable Fast Refresh in dev menu
   - Use React DevTools for debugging

2. **Data Inspection**
   - Check MMKV storage in device files
   - Use console.log to debug data flow

3. **Performance**
   - Images are cached automatically
   - Lists use optimized rendering
   - Data loads instantly (no network delay)

4. **Customization**
   - Edit `src/storage/sampleData.ts` for custom data
   - Modify `src/storage/offlineDB.ts` for data structure
   - Update `src/api/offlineApi.ts` for API behavior

## 📚 File Structure

```
src/
├── api/
│   ├── index.ts          # API router (offline/online)
│   ├── offlineApi.ts     # Offline API implementation
│   └── urls.ts           # API endpoints
├── storage/
│   ├── offlineDB.ts      # Database manager
│   └── sampleData.ts     # Sample data generator
├── screens/              # All app screens
├── components/           # Reusable components
├── navigation/           # Navigation setup
└── functions/
    └── storage.ts        # MMKV storage instance
```

## 🚀 Production Build

### Android APK
```bash
cd android
./gradlew assembleRelease
# Output: android/app/build/outputs/apk/release/app-release.apk
```

### iOS Archive
```bash
open ios/Planorama.xcworkspace
# Product > Archive > Distribute App
```

## ✅ Success Indicators

You'll know it's working when:
- ✅ App launches without errors
- ✅ Home screen shows 5 sample events
- ✅ Can navigate all screens
- ✅ Can create/edit events
- ✅ Data persists after restart
- ✅ No network errors
- ✅ All features work offline

## 🎉 You're Ready!

Your offline-first Planorama app is ready to use. Everything works without internet!

**Need help?** Check `OFFLINE_MODE_README.md` for detailed documentation.

---

**Happy Coding! 🎊**
