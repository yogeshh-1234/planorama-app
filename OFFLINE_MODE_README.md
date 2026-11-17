# Planorama - Offline-First React Native App

## 🎯 Overview

This React Native app has been transformed into a **fully offline-capable version** that works 100% without internet connection. All API calls have been replaced with local storage solutions using MMKV and AsyncStorage.

## ✨ Features

### Offline Capabilities
- ✅ **Complete offline operation** - No network required
- ✅ **Local data persistence** - All data stored locally using MMKV
- ✅ **Sample data pre-loaded** - Demo events, contacts, and guests
- ✅ **Full CRUD operations** - Create, read, update, delete events
- ✅ **Image handling** - Base64 image storage for offline access
- ✅ **State management** - React Query with offline data layer
- ✅ **Zero crashes** - Robust error handling and fallbacks

### Maintained Features
- ✅ Same UI and navigation structure
- ✅ All screens functional offline
- ✅ Event creation and management
- ✅ Guest list management
- ✅ RSVP functionality
- ✅ Comments and questions
- ✅ Gallery management
- ✅ Contact management
- ✅ Profile management

## 🏗️ Architecture

### New Files Added

1. **`src/storage/offlineDB.ts`**
   - Core offline database manager
   - Handles all data operations (events, contacts, guests, etc.)
   - Uses MMKV for fast, persistent storage

2. **`src/api/offlineApi.ts`**
   - Offline API implementation
   - Mimics REST API responses
   - Simulates network delays for realistic behavior

3. **`src/storage/sampleData.ts`**
   - Sample data generator
   - Pre-populates app with demo events and contacts
   - Provides realistic testing environment

### Modified Files

1. **`src/api/index.ts`**
   - Added offline mode flag (`OFFLINE_MODE = true`)
   - Routes requests to offline API when enabled
   - Maintains backward compatibility with online mode

2. **`App.tsx`**
   - Initializes offline database on app start
   - Loads sample data for demo purposes

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18
- React Native development environment set up
- Android Studio (for Android) or Xcode (for iOS)

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Install iOS dependencies (iOS only):**
```bash
cd ios && pod install && cd ..
```

3. **Run the app:**

**Android:**
```bash
npm run android
# or
npx react-native run-android
```

**iOS:**
```bash
npm run ios
# or
npx react-native run-ios
```

## 📱 Usage

### First Launch
On first launch, the app will:
1. Initialize the offline database
2. Create a demo user account
3. Load sample events, contacts, and guests
4. Auto-login with offline credentials

### Default Credentials
- **User:** Demo User
- **Phone:** +91 9876543210
- **Token:** Auto-generated offline token

### Sample Data Included
- **5 Events:** Mix of upcoming and past events
- **8 Contacts:** Pre-loaded contact list
- **5 Guests per event:** With various RSVP statuses
- **Gallery images:** Sample event photos
- **Comments:** Demo comments on events

## 🔧 Configuration

### Toggle Offline Mode

To switch between offline and online modes, edit `src/api/index.ts`:

```typescript
// Set to true for offline operation
const OFFLINE_MODE = true;

// Set to false to use real API
const OFFLINE_MODE = false;
```

### Clear Offline Data

To reset all offline data:

```typescript
import { OfflineDB } from './src/storage/offlineDB';

// Clear all data
OfflineDB.clearAll();

// Re-initialize
OfflineDB.initializeDefaultData();
```

### Customize Sample Data

Edit `src/storage/sampleData.ts` to modify:
- Sample events
- Guest lists
- Contacts
- Gallery images
- Comments

## 📊 Data Structure

### Events
```typescript
{
  evt_id: number,
  name: string,
  cover_img: string,
  date: string,
  time: string,
  location: string,
  rsvp: 'Y' | 'N' | 'M' | null,
  published: 'Y' | 'N',
  is_host: boolean,
  is_guest: boolean,
  // ... more fields
}
```

### Guests
```typescript
{
  id: number,
  name: string,
  number: string,
  country_code: string,
  rsvp: 'I~Y' | 'R~Y' | 'R~N' | 'R~M',
  // ... more fields
}
```

### Contacts
```typescript
{
  id: string,
  name: string,
  number: string,
  country_code: string,
  pic: string | null,
}
```

## 🎨 Features Breakdown

### ✅ Fully Implemented

1. **Authentication**
   - OTP sending (simulated)
   - OTP verification
   - User registration
   - Logout

2. **Events**
   - Create new events
   - Edit existing events
   - View event details
   - Delete events
   - Event gallery management
   - Event settings/configuration

3. **Guests**
   - Add guests to events
   - Update guest RSVP
   - Remove guests
   - View guest lists
   - RSVP statistics

4. **Contacts**
   - Import from phone contacts
   - Add manual contacts
   - Edit contacts
   - Delete contacts
   - Search contacts

5. **Profile**
   - View profile
   - Update name
   - Update profile picture
   - View credits

6. **Comments & Questions**
   - Add comments to events
   - View comments
   - Add questions
   - View questions

### 🔄 Simulated (Offline Mode)

1. **WhatsApp Integration**
   - Connection status (always returns disconnected)
   - QR code sharing (simulated)
   - Message sending (simulated)

2. **Push Notifications**
   - Device token updates (simulated)
   - Notification handling (local only)

3. **Deep Links**
   - Event sharing links (generated locally)
   - Link handling (works with local data)

## 🐛 Troubleshooting

### App crashes on startup
```bash
# Clear cache and rebuild
cd android && ./gradlew clean && cd ..
npm start -- --reset-cache
npm run android
```

### Data not persisting
```bash
# Check MMKV storage
# Uninstall and reinstall the app
```

### Images not loading
- Ensure images are stored as base64 strings
- Check network permissions (even for offline mode)
- Verify image URLs in sample data

## 📈 Performance Optimizations

1. **MMKV Storage**
   - Fast, synchronous storage
   - Efficient for frequent reads/writes
   - Minimal overhead

2. **Lazy Loading**
   - Images loaded on demand
   - Gallery images cached
   - Optimized list rendering

3. **Memory Management**
   - Efficient data structures
   - Proper cleanup on unmount
   - Optimized re-renders

## 🔐 Security Notes

- All data stored locally on device
- No network transmission in offline mode
- User data encrypted by device OS
- No external API calls when offline

## 📝 Development Notes

### Adding New Features

1. **Add to OfflineDB:**
```typescript
// src/storage/offlineDB.ts
static getNewFeature() {
  // Implementation
}
```

2. **Add to OfflineAPI:**
```typescript
// src/api/offlineApi.ts
static async newFeatureEndpoint(data: any) {
  // Implementation
}
```

3. **Route in API index:**
```typescript
// src/api/index.ts
if (mode === 'NEW_FEATURE') return OfflineAPI.newFeatureEndpoint(data);
```

### Testing

```bash
# Run tests
npm test

# Run with coverage
npm test -- --coverage
```

## 🚢 Production Build

### Android
```bash
cd android
./gradlew assembleRelease
# APK location: android/app/build/outputs/apk/release/app-release.apk
```

### iOS
```bash
# Open Xcode
open ios/Planorama.xcworkspace

# Select Product > Archive
# Follow App Store submission process
```

## 📦 Dependencies

### Core
- `react-native`: 0.77.0
- `react`: 18.3.1
- `react-native-mmkv`: ^2.12.2 (Offline storage)
- `@tanstack/react-query`: ^5.61.3 (State management)

### UI
- `react-native-paper`: ^5.12.5
- `react-native-reanimated`: ^3.16.2
- `react-native-gesture-handler`: ^2.22.1

### Navigation
- `@react-navigation/native`: ^7.0.4
- `@react-navigation/native-stack`: ^7.1.1

### Utilities
- `moment`: ^2.30.1 (Date handling)
- `uuid`: ^11.1.0 (ID generation)
- `lodash`: ^4.17.21 (Utilities)

## 🎯 Next Steps

### Potential Enhancements

1. **Sync Capability**
   - Add background sync when online
   - Conflict resolution
   - Merge strategies

2. **Export/Import**
   - Export data to JSON
   - Import from backup
   - Share data between devices

3. **Advanced Search**
   - Full-text search
   - Filters and sorting
   - Search history

4. **Analytics**
   - Offline usage tracking
   - Event statistics
   - Guest insights

## 📞 Support

For issues or questions:
1. Check this README
2. Review code comments
3. Check React Native documentation
4. Review MMKV documentation

## 📄 License

This project maintains the original license of the Planorama application.

## 🎉 Success!

Your app is now fully offline-capable! Run it with:

```bash
npm install && npx react-native run-android
```

Enjoy your offline-first React Native app! 🚀
