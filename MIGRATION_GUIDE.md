# 🔄 Migration Guide: Online ↔️ Offline Mode

## Overview

This guide explains how to switch between online (REST API) and offline (local storage) modes, and how to migrate data between them.

## Quick Toggle

### Enable Offline Mode
```typescript
// src/api/index.ts
const OFFLINE_MODE = true;
```

### Enable Online Mode
```typescript
// src/api/index.ts
const OFFLINE_MODE = false;
```

**Note:** Restart the app after changing this flag.

## Architecture Comparison

### Online Mode (Original)
```
App → React Query → axios → REST API → Backend Database
```

### Offline Mode (New)
```
App → React Query → offlineApi → MMKV Storage → Device Storage
```

## Data Flow

### Online Mode
1. User action triggers API call
2. axios sends HTTP request to backend
3. Backend processes and returns JSON
4. React Query caches response
5. UI updates with data

### Offline Mode
1. User action triggers API call
2. offlineApi intercepts request
3. MMKV storage accessed directly
4. Simulated delay for realism
5. React Query caches response
6. UI updates with data

## API Mapping

### Authentication

| Endpoint | Mode | Online | Offline |
|----------|------|--------|---------|
| SEND_OTP | login | POST /api/login.php | OfflineAPI.sendOTP() |
| VERIFY_OTP | login | POST /api/login.php | OfflineAPI.verifyOTP() |
| REGISTER | login | POST /api/login.php | OfflineAPI.register() |
| LOGOUT | login | POST /api/login.php | OfflineAPI.logout() |

### Profile

| Endpoint | Mode | Online | Offline |
|----------|------|--------|---------|
| VIEW_PROFILE | profile | POST /api/profile.php | OfflineAPI.viewProfile() |
| UPDATE_PROFILE | profile | POST /api/profile.php | OfflineAPI.updateProfile() |
| UPDATE_DEVICE_TOKEN | profile | POST /api/profile.php | OfflineAPI.updateDeviceToken() |
| ADD_CONTACTS | profile | POST /api/profile.php | OfflineAPI.addContacts() |

### Events

| Endpoint | Mode | Online | Offline |
|----------|------|--------|---------|
| ADD_EVENT | event | POST /api/event.php | OfflineAPI.addEvent() |
| UPDATE_EVENT | event | POST /api/event.php | OfflineAPI.updateEvent() |
| VIEW_EVENT | event | POST /api/event.php | OfflineAPI.viewEvent() |
| DELETE_EVENT | event | POST /api/event.php | OfflineAPI.deleteEvent() |
| ADD_GALLERY | event | POST /api/event.php | OfflineAPI.addGallery() |
| VIEW_GALLERY | event | POST /api/event.php | OfflineAPI.viewGallery() |

### Dashboard

| Endpoint | Mode | Online | Offline |
|----------|------|--------|---------|
| MY_EVT_LIST_UP | dashboard | POST /api/dashboard.php | OfflineAPI.getDashboardEvents() |
| MY_EVT_LIST_PREV | dashboard | POST /api/dashboard.php | OfflineAPI.getDashboardEvents() |
| INV_EVT_LIST_UP | dashboard | POST /api/dashboard.php | OfflineAPI.getDashboardEvents() |
| INV_EVT_LIST_PREV | dashboard | POST /api/dashboard.php | OfflineAPI.getDashboardEvents() |

### Guests

| Endpoint | Mode | Online | Offline |
|----------|------|--------|---------|
| VIEW_EVENT_GUEST | event | POST /api/event.php | OfflineAPI.viewEventGuests() |
| ADD_EVENT_GUEST | event | POST /api/event.php | OfflineAPI.addEventGuests() |
| UPDATE_GUESTS_RSVP | event | POST /api/event.php | OfflineAPI.updateGuestRSVP() |
| DELETE_EVENT_GUEST | event | POST /api/event.php | OfflineAPI.deleteEventGuest() |

## Data Export/Import

### Export Offline Data to JSON

```typescript
import { OfflineDB } from './src/storage/offlineDB';
import { storage } from './src/functions/storage';

// Export all data
const exportData = () => {
  return {
    user: OfflineDB.getUser(),
    events: OfflineDB.getEvents(),
    contacts: OfflineDB.getContacts(),
    guests: JSON.parse(storage.getString('offline.guests') || '{}'),
    galleries: JSON.parse(storage.getString('offline.galleries') || '{}'),
    comments: JSON.parse(storage.getString('offline.comments') || '{}'),
    questions: JSON.parse(storage.getString('offline.questions') || '{}'),
  };
};

// Save to file
const data = exportData();
console.log(JSON.stringify(data, null, 2));
```

### Import Data from JSON

```typescript
import { OfflineDB } from './src/storage/offlineDB';
import { storage } from './src/functions/storage';

const importData = (jsonData: any) => {
  // Import user
  if (jsonData.user) {
    OfflineDB.updateUser(jsonData.user);
  }
  
  // Import events
  if (jsonData.events) {
    OfflineDB.saveEvents(jsonData.events);
  }
  
  // Import contacts
  if (jsonData.contacts) {
    OfflineDB.saveContacts(jsonData.contacts);
  }
  
  // Import guests
  if (jsonData.guests) {
    storage.set('offline.guests', JSON.stringify(jsonData.guests));
  }
  
  // Import galleries
  if (jsonData.galleries) {
    storage.set('offline.galleries', JSON.stringify(jsonData.galleries));
  }
  
  // Import comments
  if (jsonData.comments) {
    storage.set('offline.comments', JSON.stringify(jsonData.comments));
  }
  
  // Import questions
  if (jsonData.questions) {
    storage.set('offline.questions', JSON.stringify(jsonData.questions));
  }
};
```

## Sync Strategy (Future Enhancement)

### Hybrid Mode Implementation

```typescript
// src/api/index.ts
const OFFLINE_MODE = false;
const ENABLE_SYNC = true;

export const postData = async <T, R>(endpoint: string, data: T): Promise<R> => {
  if (OFFLINE_MODE) {
    return routeOfflineRequest(endpoint, data) as Promise<R>;
  }
  
  try {
    // Try online first
    const response = await apiClient.post(`${endpoint}.php`, data);
    
    // Cache response offline if sync enabled
    if (ENABLE_SYNC) {
      await cacheResponseOffline(endpoint, data, response.data);
    }
    
    return response.data;
  } catch (error) {
    // Fallback to offline if network fails
    if (ENABLE_SYNC) {
      console.log('Network error, using offline data');
      return routeOfflineRequest(endpoint, data) as Promise<R>;
    }
    throw error;
  }
};

async function cacheResponseOffline(endpoint: string, request: any, response: any) {
  // Cache logic here
  // Store in MMKV for offline access
}
```

### Conflict Resolution

```typescript
interface SyncConflict {
  localData: any;
  serverData: any;
  timestamp: number;
}

function resolveConflict(conflict: SyncConflict): any {
  // Strategy 1: Last write wins
  if (conflict.localData.updated_at > conflict.serverData.updated_at) {
    return conflict.localData;
  }
  return conflict.serverData;
  
  // Strategy 2: Server always wins
  // return conflict.serverData;
  
  // Strategy 3: Manual resolution
  // return showConflictDialog(conflict);
}
```

## Testing Both Modes

### Test Offline Mode
```bash
# 1. Set OFFLINE_MODE = true
# 2. Run app
npm run android

# 3. Verify:
# - App works without internet
# - Data persists after restart
# - All features functional
```

### Test Online Mode
```bash
# 1. Set OFFLINE_MODE = false
# 2. Ensure backend is running
# 3. Run app
npm run android

# 4. Verify:
# - API calls reach backend
# - Data syncs with server
# - Network errors handled
```

### Test Hybrid Mode (Future)
```bash
# 1. Set OFFLINE_MODE = false, ENABLE_SYNC = true
# 2. Run app with internet
# 3. Disable internet mid-session
# 4. Verify:
# - App continues working offline
# - Data queued for sync
# - Sync occurs when online
```

## Performance Comparison

### Online Mode
- **Latency:** 100-500ms (network dependent)
- **Reliability:** Depends on network
- **Data Size:** Limited by bandwidth
- **Offline:** Not available

### Offline Mode
- **Latency:** <10ms (local storage)
- **Reliability:** 100% (no network needed)
- **Data Size:** Limited by device storage
- **Offline:** Fully functional

## Storage Comparison

### Online Mode
```
User Data: Server database
Images: Server storage (URLs)
Cache: React Query (memory)
Persistence: None (clears on restart)
```

### Offline Mode
```
User Data: MMKV (device)
Images: Base64 in MMKV
Cache: React Query + MMKV
Persistence: Permanent (survives restart)
```

## Migration Checklist

### Switching to Offline Mode
- [ ] Set `OFFLINE_MODE = true`
- [ ] Initialize offline database
- [ ] Load sample data (optional)
- [ ] Test all features
- [ ] Verify data persistence
- [ ] Test app restart

### Switching to Online Mode
- [ ] Set `OFFLINE_MODE = false`
- [ ] Configure API base URL
- [ ] Test backend connectivity
- [ ] Verify API responses
- [ ] Test error handling
- [ ] Test network failures

### Implementing Hybrid Mode
- [ ] Add sync flag
- [ ] Implement cache logic
- [ ] Add conflict resolution
- [ ] Test online → offline transition
- [ ] Test offline → online transition
- [ ] Test sync queue
- [ ] Test conflict scenarios

## Common Issues

### Issue: Data not persisting
**Solution:** Ensure MMKV is properly initialized
```typescript
import { storage } from './src/functions/storage';
// Check if storage is working
storage.set('test', 'value');
console.log(storage.getString('test')); // Should print 'value'
```

### Issue: API calls failing in offline mode
**Solution:** Check routing in `src/api/index.ts`
```typescript
// Ensure mode is correctly routed
console.log('Endpoint:', endpoint, 'Mode:', data.mode);
```

### Issue: Images not loading
**Solution:** Use base64 encoding for offline images
```typescript
// Convert URL to base64
const response = await fetch(imageUrl);
const blob = await response.blob();
const base64 = await blobToBase64(blob);
```

### Issue: Sync conflicts
**Solution:** Implement conflict resolution strategy
```typescript
// Add timestamp to all data
const data = {
  ...existingData,
  updated_at: new Date().toISOString(),
};
```

## Best Practices

### 1. Always Use Timestamps
```typescript
{
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}
```

### 2. Implement Proper Error Handling
```typescript
try {
  const result = await OfflineAPI.someMethod(data);
  return result;
} catch (error) {
  console.error('Offline API error:', error);
  throw error;
}
```

### 3. Validate Data Before Storage
```typescript
if (!data.name || !data.date) {
  throw new Error('Invalid data');
}
OfflineDB.addEvent(data);
```

### 4. Use Unique IDs
```typescript
import { v4 as uuidv4 } from 'uuid';

const newItem = {
  id: uuidv4(),
  ...data,
};
```

### 5. Clean Up Old Data
```typescript
// Remove old events
const events = OfflineDB.getEvents();
const filtered = events.filter(e => 
  moment(e.date, 'DD/MM/YYYY').isAfter(moment().subtract(1, 'year'))
);
OfflineDB.saveEvents(filtered);
```

## Future Enhancements

### 1. Background Sync
- Sync data when app is in background
- Use WorkManager (Android) / Background Tasks (iOS)

### 2. Selective Sync
- Sync only changed data
- Delta sync for efficiency

### 3. Compression
- Compress large data before storage
- Decompress on retrieval

### 4. Encryption
- Encrypt sensitive data
- Use device keychain

### 5. Cloud Backup
- Backup to cloud storage
- Restore from backup

## Conclusion

The offline mode provides a robust, production-ready solution for running the app without internet. The architecture is designed to be easily switchable between online and offline modes, with potential for hybrid sync in the future.

For questions or issues, refer to the main `OFFLINE_MODE_README.md` documentation.
