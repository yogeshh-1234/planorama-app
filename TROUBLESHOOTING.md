# 🔧 Troubleshooting Guide - Offline Planorama

## Common Issues & Solutions

## 1. Installation Issues

### Issue: `npm install` fails
**Symptoms:**
- Error messages during installation
- Missing dependencies
- Version conflicts

**Solutions:**
```bash
# Solution 1: Clear cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install

# Solution 2: Use specific Node version
nvm use 18
npm install

# Solution 3: Check npm version
npm --version  # Should be >= 8.0.0
npm install -g npm@latest
```

---

### Issue: iOS pod install fails
**Symptoms:**
- CocoaPods errors
- Missing pods
- Version conflicts

**Solutions:**
```bash
# Solution 1: Update CocoaPods
sudo gem install cocoapods
cd ios
pod install
cd ..

# Solution 2: Clean and reinstall
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..

# Solution 3: Deintegrate and reinstall
cd ios
pod deintegrate
pod install
cd ..
```

---

### Issue: Android Gradle build fails
**Symptoms:**
- Gradle sync errors
- Build failures
- Dependency issues

**Solutions:**
```bash
# Solution 1: Clean Gradle
cd android
./gradlew clean
cd ..

# Solution 2: Clear Gradle cache
cd android
./gradlew cleanBuildCache
cd ..

# Solution 3: Delete build folders
cd android
rm -rf .gradle build app/build
./gradlew clean
cd ..
```

---

## 2. Runtime Issues

### Issue: App crashes on startup
**Symptoms:**
- Red screen error
- App closes immediately
- "Unable to load script" error

**Solutions:**
```bash
# Solution 1: Reset Metro bundler
npm start -- --reset-cache

# Solution 2: Clear app data
# Uninstall app from device
# Reinstall: npm run android

# Solution 3: Check for syntax errors
npm run lint

# Solution 4: Verify imports
# Check all import statements in new files
```

**Code Check:**
```typescript
// Verify these imports exist
import { OfflineDB } from './src/storage/offlineDB';
import { OfflineAPI } from './src/api/offlineApi';
import { SampleDataGenerator } from './src/storage/sampleData';
```

---

### Issue: White screen on launch
**Symptoms:**
- App launches but shows white screen
- No content visible
- No errors in console

**Solutions:**
```bash
# Solution 1: Check Metro bundler
# Ensure Metro is running
npm start

# Solution 2: Reload app
# Press 'r' in Metro terminal
# Or shake device and tap "Reload"

# Solution 3: Check navigation
# Verify navigation setup in src/navigation/index.tsx
```

**Debug Code:**
```typescript
// Add to App.tsx
console.log('App rendering...');

// Add to MainNavigation
console.log('Navigation rendering...');
console.log('User token:', userToken);
```

---

### Issue: "Network request failed" errors
**Symptoms:**
- Network errors despite offline mode
- API call failures
- Timeout errors

**Solutions:**
```typescript
// Solution 1: Verify offline mode flag
// src/api/index.ts
const OFFLINE_MODE = true; // Must be true

// Solution 2: Check routing
console.log('Endpoint:', endpoint, 'Mode:', data.mode);

// Solution 3: Add error handling
try {
  const result = await postData(endpoint, data);
  return result;
} catch (error) {
  console.error('API Error:', error);
  throw error;
}
```

---

## 3. Data Issues

### Issue: Data not persisting
**Symptoms:**
- Data disappears after app restart
- Events/contacts not saving
- User logged out on restart

**Solutions:**
```typescript
// Solution 1: Verify MMKV initialization
import { storage } from './src/functions/storage';

// Test storage
storage.set('test', 'value');
console.log(storage.getString('test')); // Should print 'value'

// Solution 2: Check initialization
// App.tsx should have:
OfflineDB.initializeDefaultData();

// Solution 3: Verify data is being saved
console.log('Events:', OfflineDB.getEvents());
console.log('User:', OfflineDB.getUser());
```

---

### Issue: Sample data not loading
**Symptoms:**
- No events on home screen
- Empty contact list
- No demo data

**Solutions:**
```typescript
// Solution 1: Force reload sample data
import { SampleDataGenerator } from './src/storage/sampleData';

// Clear and reload
OfflineDB.clearAll();
OfflineDB.initializeDefaultData();
SampleDataGenerator.initializeAllSampleData();

// Solution 2: Check initialization flag
console.log('Initialized:', storage.getString('offline.initialized'));

// Solution 3: Manual data check
console.log('Events count:', OfflineDB.getEvents().length);
```

---

### Issue: Duplicate data
**Symptoms:**
- Multiple copies of same event
- Duplicate contacts
- Repeated entries

**Solutions:**
```typescript
// Solution 1: Clear all data
OfflineDB.clearAll();
// Restart app

// Solution 2: Add unique ID check
const events = OfflineDB.getEvents();
const uniqueEvents = events.filter((event, index, self) =>
  index === self.findIndex((e) => e.evt_id === event.evt_id)
);
OfflineDB.saveEvents(uniqueEvents);

// Solution 3: Prevent duplicate initialization
// Check before initializing
if (OfflineDB.getEvents().length === 0) {
  SampleDataGenerator.initializeAllSampleData();
}
```

---

## 4. Image Issues

### Issue: Images not loading
**Symptoms:**
- Broken image icons
- Images show as blank
- Loading spinner never stops

**Solutions:**
```typescript
// Solution 1: Check image format
// Ensure images are base64 or valid URLs
console.log('Image:', image.substring(0, 50));

// Solution 2: Add error handling
<Image
  source={{ uri: image }}
  onError={(error) => console.log('Image error:', error)}
  onLoad={() => console.log('Image loaded')}
/>

// Solution 3: Use fallback image
const imageSource = image && image.length > 0
  ? { uri: image }
  : require('./assets/images/placeholder.png');
```

---

### Issue: Large images causing crashes
**Symptoms:**
- App crashes when adding images
- Out of memory errors
- Slow performance

**Solutions:**
```typescript
// Solution 1: Resize images before storage
import ImageResizer from '@bam.tech/react-native-image-resizer';

const resizedImage = await ImageResizer.createResizedImage(
  imageUri,
  800,  // max width
  800,  // max height
  'JPEG',
  80,   // quality
);

// Solution 2: Limit image size
if (base64Image.length > 1000000) { // ~1MB
  Alert.alert('Image too large', 'Please select a smaller image');
  return;
}

// Solution 3: Use compression
// Already implemented in image picker options
maxHeight: 500,
maxWidth: 500,
quality: 0.8,
```

---

## 5. Performance Issues

### Issue: App running slowly
**Symptoms:**
- Laggy scrolling
- Slow navigation
- Delayed responses

**Solutions:**
```typescript
// Solution 1: Optimize list rendering
import { FlashList } from '@shopify/flash-list';

<FlashList
  data={items}
  renderItem={renderItem}
  estimatedItemSize={100}
/>

// Solution 2: Memoize components
const MemoizedComponent = memo(({ data }) => {
  // Component code
});

// Solution 3: Reduce data size
// Limit events to last 6 months
const recentEvents = events.filter(e =>
  moment(e.date, 'DD/MM/YYYY').isAfter(moment().subtract(6, 'months'))
);
```

---

### Issue: High memory usage
**Symptoms:**
- App becomes unresponsive
- Device heats up
- Battery drains quickly

**Solutions:**
```typescript
// Solution 1: Clean up listeners
useEffect(() => {
  const listener = storage.addOnValueChangedListener(callback);
  
  return () => {
    listener.remove(); // Important!
  };
}, []);

// Solution 2: Limit cached images
// Clear old images periodically
const clearOldImages = () => {
  // Implementation
};

// Solution 3: Profile memory usage
// Use React DevTools Profiler
// Check for memory leaks
```

---

## 6. UI Issues

### Issue: Keyboard covering inputs
**Symptoms:**
- Can't see input field when typing
- Keyboard overlaps content
- Scroll doesn't work

**Solutions:**
```typescript
// Solution 1: Use KeyboardAvoidingView
import { KeyboardAvoidingView, Platform } from 'react-native';

<KeyboardAvoidingView
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  style={{ flex: 1 }}
>
  {/* Content */}
</KeyboardAvoidingView>

// Solution 2: Use ScrollView with keyboardShouldPersistTaps
<ScrollView
  keyboardShouldPersistTaps="handled"
  keyboardDismissMode="interactive"
>
  {/* Content */}
</ScrollView>
```

---

### Issue: Animations not working
**Symptoms:**
- No smooth transitions
- Jerky movements
- Animations freeze

**Solutions:**
```bash
# Solution 1: Enable Reanimated
# Verify babel.config.js has:
plugins: ['react-native-reanimated/plugin']

# Solution 2: Rebuild app
npm run android

# Solution 3: Check Hermes
# Ensure Hermes is enabled in android/app/build.gradle
```

---

## 7. Build Issues

### Issue: Android build fails
**Symptoms:**
- Gradle errors
- Compilation failures
- Missing dependencies

**Solutions:**
```bash
# Solution 1: Clean and rebuild
cd android
./gradlew clean
./gradlew assembleDebug
cd ..

# Solution 2: Check Java version
java -version  # Should be Java 11 or 17

# Solution 3: Update Gradle
# Edit android/gradle/wrapper/gradle-wrapper.properties
distributionUrl=https\://services.gradle.org/distributions/gradle-8.0-all.zip

# Solution 4: Sync Gradle files
# In Android Studio: File > Sync Project with Gradle Files
```

---

### Issue: iOS build fails
**Symptoms:**
- Xcode errors
- Linking failures
- Missing frameworks

**Solutions:**
```bash
# Solution 1: Clean build folder
cd ios
xcodebuild clean
cd ..

# Solution 2: Update pods
cd ios
pod update
cd ..

# Solution 3: Reset derived data
rm -rf ~/Library/Developer/Xcode/DerivedData

# Solution 4: Check signing
# Verify code signing in Xcode
# Ensure provisioning profile is valid
```

---

## 8. Testing Issues

### Issue: Can't test offline functionality
**Symptoms:**
- Need to verify offline mode
- Want to test without network

**Solutions:**
```bash
# Solution 1: Enable airplane mode on device

# Solution 2: Disable network in emulator
# Android: Settings > Network & Internet > Turn off WiFi/Mobile

# Solution 3: Use network interceptor
# Add to src/api/index.ts for testing
const FORCE_OFFLINE = true;
```

---

### Issue: Sample data conflicts with tests
**Symptoms:**
- Tests fail due to existing data
- Can't test fresh install

**Solutions:**
```typescript
// Solution 1: Clear data before tests
beforeEach(() => {
  OfflineDB.clearAll();
  OfflineDB.initializeDefaultData();
});

// Solution 2: Use test-specific data
const testData = {
  // Custom test data
};

// Solution 3: Mock storage
jest.mock('./src/functions/storage');
```

---

## 9. Development Issues

### Issue: Hot reload not working
**Symptoms:**
- Changes don't reflect
- Need to rebuild app
- Fast Refresh fails

**Solutions:**
```bash
# Solution 1: Restart Metro
# Press Ctrl+C in Metro terminal
npm start -- --reset-cache

# Solution 2: Enable Fast Refresh
# Shake device > Enable Fast Refresh

# Solution 3: Check file watchers
# Increase limit on Linux:
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

---

### Issue: TypeScript errors
**Symptoms:**
- Type errors in IDE
- Build fails due to types
- Import errors

**Solutions:**
```bash
# Solution 1: Regenerate types
npm run tsc

# Solution 2: Check tsconfig.json
# Ensure paths are correct

# Solution 3: Install type definitions
npm install --save-dev @types/uuid
npm install --save-dev @types/lodash
```

---

## 10. Production Issues

### Issue: Release build crashes
**Symptoms:**
- Debug works, release crashes
- ProGuard issues
- Minification problems

**Solutions:**
```bash
# Solution 1: Check ProGuard rules
# android/app/proguard-rules.pro
-keep class com.facebook.react.** { *; }
-keep class com.swmansion.reanimated.** { *; }

# Solution 2: Disable minification temporarily
# android/app/build.gradle
minifyEnabled false
shrinkResources false

# Solution 3: Test release build
cd android
./gradlew assembleRelease
adb install app/build/outputs/apk/release/app-release.apk
```

---

## Debug Tools

### Enable Debug Mode
```typescript
// Add to App.tsx
if (__DEV__) {
  console.log('Debug mode enabled');
  // Enable additional logging
}
```

### Check Storage Contents
```typescript
// Add to any screen
import { storage } from './src/functions/storage';

const debugStorage = () => {
  console.log('User:', storage.getString('user.name'));
  console.log('Events:', storage.getString('offline.events'));
  console.log('Contacts:', storage.getString('offline.contacts'));
};
```

### Monitor Performance
```typescript
// Add performance monitoring
const startTime = Date.now();
// ... operation ...
const endTime = Date.now();
console.log(`Operation took ${endTime - startTime}ms`);
```

## Getting Help

### 1. Check Logs
```bash
# Android logs
adb logcat | grep ReactNative

# iOS logs
# Xcode > Window > Devices and Simulators > View Device Logs
```

### 2. Enable Verbose Logging
```typescript
// src/api/index.ts
const DEBUG = true;

if (DEBUG) {
  console.log('API Call:', endpoint, data);
}
```

### 3. Use React DevTools
```bash
npm install -g react-devtools
react-devtools
```

### 4. Check Documentation
- React Native: https://reactnative.dev/
- MMKV: https://github.com/mrousavy/react-native-mmkv
- React Query: https://tanstack.com/query/latest

## Emergency Reset

If all else fails:
```bash
# Nuclear option - complete reset
rm -rf node_modules
rm -rf android/build
rm -rf android/.gradle
rm -rf ios/Pods
rm -rf ios/build
rm package-lock.json

npm install
cd ios && pod install && cd ..
npm start -- --reset-cache
npm run android
```

## Still Having Issues?

1. Check the main README files
2. Review code comments
3. Search for similar issues online
4. Check React Native GitHub issues
5. Verify all dependencies are installed

## Prevention Tips

1. **Regular Backups**
   - Export data regularly
   - Keep backup of working version

2. **Version Control**
   - Commit working code frequently
   - Use meaningful commit messages

3. **Testing**
   - Test on real devices
   - Test both Android and iOS
   - Test offline scenarios

4. **Documentation**
   - Document custom changes
   - Keep notes on issues and solutions

5. **Updates**
   - Keep dependencies updated
   - Test after each update
   - Read changelogs

---

**Remember:** Most issues can be resolved by:
1. Clearing cache
2. Reinstalling dependencies
3. Restarting Metro bundler
4. Rebuilding the app

Good luck! 🚀
