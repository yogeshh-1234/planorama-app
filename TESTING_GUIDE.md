# 🧪 Testing Guide - Offline Planorama

## Overview

This guide provides comprehensive testing procedures for the offline-first React Native app.

## Pre-Testing Setup

### 1. Clean Installation
```bash
# Remove node_modules
rm -rf node_modules

# Clear cache
npm start -- --reset-cache

# Fresh install
npm install

# Android clean
cd android && ./gradlew clean && cd ..

# iOS clean (if applicable)
cd ios && pod install && cd ..
```

### 2. Verify Configuration
```typescript
// src/api/index.ts
const OFFLINE_MODE = true; // Should be true for offline testing
```

### 3. Clear App Data
```bash
# Uninstall app from device/emulator
# Or clear app data in device settings
```

## Test Categories

## 1. Installation & Setup Tests

### Test 1.1: Fresh Installation
**Steps:**
1. Run `npm install`
2. Run `npm run android` or `npm run ios`
3. Wait for app to launch

**Expected:**
- ✅ No installation errors
- ✅ App launches successfully
- ✅ Splash screen appears
- ✅ Home screen loads with sample data

**Status:** [ ] Pass [ ] Fail

---

### Test 1.2: Database Initialization
**Steps:**
1. Launch app for first time
2. Check console logs
3. Navigate to home screen

**Expected:**
- ✅ "offline.initialized" flag set
- ✅ Sample events visible
- ✅ User auto-logged in
- ✅ No errors in console

**Status:** [ ] Pass [ ] Fail

---

### Test 1.3: Sample Data Loading
**Steps:**
1. Launch app
2. Navigate to home screen
3. Check event counts

**Expected:**
- ✅ 5 events loaded
- ✅ Events split between "Hosting" and "Invited"
- ✅ Upcoming/Previous tabs functional
- ✅ Event images load

**Status:** [ ] Pass [ ] Fail

---

## 2. Authentication Tests

### Test 2.1: Auto-Login
**Steps:**
1. Fresh app install
2. Launch app

**Expected:**
- ✅ Skip intro screen
- ✅ Auto-login as "Demo User"
- ✅ Navigate to home screen
- ✅ Profile shows user data

**Status:** [ ] Pass [ ] Fail

---

### Test 2.2: Logout
**Steps:**
1. Navigate to Profile
2. Tap "Logout"
3. Confirm logout

**Expected:**
- ✅ User logged out
- ✅ Navigate to login screen
- ✅ User data cleared
- ✅ Can login again

**Status:** [ ] Pass [ ] Fail

---

### Test 2.3: Login Flow
**Steps:**
1. Enter phone number
2. Tap "SEND OTP"
3. Enter any OTP
4. Tap "VERIFY"

**Expected:**
- ✅ OTP sent message
- ✅ OTP verification success
- ✅ Navigate to home screen
- ✅ User data restored

**Status:** [ ] Pass [ ] Fail

---

## 3. Event Management Tests

### Test 3.1: Create Event
**Steps:**
1. Tap "+ New Event"
2. Enter event details:
   - Title: "Test Event"
   - Date: Future date
   - Time: Any time
   - Location: "Test Location"
3. Select event image
4. Tap "Save Event"

**Expected:**
- ✅ Event created successfully
- ✅ Navigate to event details
- ✅ Event appears in "Hosting" list
- ✅ All details saved correctly

**Status:** [ ] Pass [ ] Fail

---

### Test 3.2: Edit Event
**Steps:**
1. Open existing event
2. Tap "Edit"
3. Change title to "Updated Event"
4. Tap "Save Event"

**Expected:**
- ✅ Event updated successfully
- ✅ Changes reflected immediately
- ✅ Navigate back to event details
- ✅ Updated title visible

**Status:** [ ] Pass [ ] Fail

---

### Test 3.3: View Event Details
**Steps:**
1. Tap on any event
2. Scroll through details

**Expected:**
- ✅ Event details load
- ✅ Cover image displays
- ✅ Date, time, location visible
- ✅ Host information shown
- ✅ Gallery images load
- ✅ Guest list visible

**Status:** [ ] Pass [ ] Fail

---

### Test 3.4: Event Gallery
**Steps:**
1. Open event
2. Scroll to gallery section
3. View gallery images

**Expected:**
- ✅ Gallery images load
- ✅ Multiple images displayed
- ✅ Images can be viewed
- ✅ No loading errors

**Status:** [ ] Pass [ ] Fail

---

### Test 3.5: Event Settings
**Steps:**
1. Open event
2. Tap "Settings"
3. Toggle various settings
4. Save settings

**Expected:**
- ✅ Settings screen opens
- ✅ All toggles functional
- ✅ Settings save successfully
- ✅ Changes persist

**Status:** [ ] Pass [ ] Fail

---

## 4. Guest Management Tests

### Test 4.1: Add Guests from Contacts
**Steps:**
1. Open event
2. Tap "Invite"
3. Tap "Previously Invited"
4. Select contacts
5. Tap "ADD TO LIST"

**Expected:**
- ✅ Contact list loads
- ✅ Can select multiple contacts
- ✅ Guests added successfully
- ✅ Guest count updates

**Status:** [ ] Pass [ ] Fail

---

### Test 4.2: Import from Address Book
**Steps:**
1. Open event
2. Tap "Invite"
3. Tap "Address book"
4. Grant contacts permission
5. Select contacts
6. Add to list

**Expected:**
- ✅ Permission requested
- ✅ Phone contacts load
- ✅ Can search contacts
- ✅ Selected contacts added

**Status:** [ ] Pass [ ] Fail

---

### Test 4.3: View Guest List
**Steps:**
1. Open event
2. Scroll to "Guest List"
3. View guest details

**Expected:**
- ✅ Guest list displays
- ✅ Shows invited count
- ✅ Shows going count
- ✅ Guest avatars visible

**Status:** [ ] Pass [ ] Fail

---

### Test 4.4: Update Guest RSVP (Host)
**Steps:**
1. Open event as host
2. Tap "Invite"
3. Change guest RSVP status
4. Save changes

**Expected:**
- ✅ RSVP status updates
- ✅ Guest count updates
- ✅ Changes persist
- ✅ No errors

**Status:** [ ] Pass [ ] Fail

---

## 5. RSVP Tests

### Test 5.1: RSVP as Guest - Going
**Steps:**
1. Open invited event
2. Tap "Going" button
3. Confirm selection

**Expected:**
- ✅ RSVP updated to "Going"
- ✅ Success message shown
- ✅ Navigate to success screen
- ✅ Status persists

**Status:** [ ] Pass [ ] Fail

---

### Test 5.2: RSVP as Guest - Maybe
**Steps:**
1. Open invited event
2. Tap "Maybe" button
3. Confirm selection

**Expected:**
- ✅ RSVP updated to "Maybe"
- ✅ Success message shown
- ✅ Status persists
- ✅ Guest list updates

**Status:** [ ] Pass [ ] Fail

---

### Test 5.3: RSVP as Guest - Not Going
**Steps:**
1. Open invited event
2. Tap "Not Going" button
3. Confirm selection

**Expected:**
- ✅ RSVP updated to "Not Going"
- ✅ Success message shown
- ✅ Status persists
- ✅ Guest list updates

**Status:** [ ] Pass [ ] Fail

---

### Test 5.4: Change RSVP
**Steps:**
1. Open invited event with existing RSVP
2. Change to different status
3. Confirm change

**Expected:**
- ✅ RSVP updates successfully
- ✅ Previous status overwritten
- ✅ New status persists
- ✅ Guest count updates

**Status:** [ ] Pass [ ] Fail

---

## 6. Contact Management Tests

### Test 6.1: View Contacts
**Steps:**
1. Navigate to Contacts
2. View contact list

**Expected:**
- ✅ Sample contacts visible
- ✅ Contact names displayed
- ✅ Contact numbers shown
- ✅ Can scroll list

**Status:** [ ] Pass [ ] Fail

---

### Test 6.2: Add Manual Contact
**Steps:**
1. Navigate to Contacts
2. Tap "Add Contact"
3. Enter name and number
4. Save contact

**Expected:**
- ✅ Contact form opens
- ✅ Can enter details
- ✅ Contact saves successfully
- ✅ Appears in contact list

**Status:** [ ] Pass [ ] Fail

---

### Test 6.3: Search Contacts
**Steps:**
1. Navigate to Contacts
2. Use search bar
3. Enter contact name

**Expected:**
- ✅ Search bar functional
- ✅ Results filter in real-time
- ✅ Correct contacts shown
- ✅ Can clear search

**Status:** [ ] Pass [ ] Fail

---

### Test 6.4: Import Phone Contacts
**Steps:**
1. Navigate to Contacts
2. Tap "Import from Address Book"
3. Grant permission
4. Select contacts
5. Import

**Expected:**
- ✅ Permission requested
- ✅ Phone contacts load
- ✅ Can select multiple
- ✅ Contacts imported successfully

**Status:** [ ] Pass [ ] Fail

---

## 7. Profile Tests

### Test 7.1: View Profile
**Steps:**
1. Navigate to Profile
2. View profile details

**Expected:**
- ✅ Profile loads
- ✅ Name displayed
- ✅ Phone number shown
- ✅ Profile picture visible
- ✅ Credits shown

**Status:** [ ] Pass [ ] Fail

---

### Test 7.2: Update Name
**Steps:**
1. Navigate to Profile
2. Tap edit icon next to name
3. Enter new name
4. Confirm

**Expected:**
- ✅ Edit dialog opens
- ✅ Can enter new name
- ✅ Name updates successfully
- ✅ Changes persist

**Status:** [ ] Pass [ ] Fail

---

### Test 7.3: Update Profile Picture
**Steps:**
1. Navigate to Profile
2. Tap profile picture
3. Select "Capture Image" or "Select from Gallery"
4. Choose/capture image
5. Confirm

**Expected:**
- ✅ Image picker opens
- ✅ Can select image
- ✅ Image uploads successfully
- ✅ New picture displays

**Status:** [ ] Pass [ ] Fail

---

### Test 7.4: View Credits
**Steps:**
1. Navigate to Profile
2. View credits section

**Expected:**
- ✅ Credits displayed
- ✅ Shows "100" or current value
- ✅ No loading errors

**Status:** [ ] Pass [ ] Fail

---

## 8. Navigation Tests

### Test 8.1: Bottom Navigation
**Steps:**
1. Navigate between screens using bottom tabs
2. Test all tab options

**Expected:**
- ✅ All tabs functional
- ✅ Smooth transitions
- ✅ Correct screens load
- ✅ No navigation errors

**Status:** [ ] Pass [ ] Fail

---

### Test 8.2: Back Navigation
**Steps:**
1. Navigate deep into app
2. Use back button/gesture
3. Return to previous screens

**Expected:**
- ✅ Back button works
- ✅ Returns to previous screen
- ✅ State preserved
- ✅ No crashes

**Status:** [ ] Pass [ ] Fail

---

### Test 8.3: Deep Linking
**Steps:**
1. Open event link
2. App should navigate to event

**Expected:**
- ✅ Link opens app
- ✅ Navigates to correct event
- ✅ Event details load
- ✅ No errors

**Status:** [ ] Pass [ ] Fail

---

## 9. Data Persistence Tests

### Test 9.1: App Restart
**Steps:**
1. Create new event
2. Close app completely
3. Reopen app
4. Check if event exists

**Expected:**
- ✅ Event persists
- ✅ All data intact
- ✅ Images still load
- ✅ No data loss

**Status:** [ ] Pass [ ] Fail

---

### Test 9.2: Data Integrity
**Steps:**
1. Create multiple events
2. Add guests to events
3. Update RSVPs
4. Restart app
5. Verify all data

**Expected:**
- ✅ All events present
- ✅ Guest lists intact
- ✅ RSVP statuses correct
- ✅ No corruption

**Status:** [ ] Pass [ ] Fail

---

### Test 9.3: Large Data Set
**Steps:**
1. Create 20+ events
2. Add 50+ contacts
3. Add 10+ guests per event
4. Restart app
5. Test performance

**Expected:**
- ✅ All data loads
- ✅ No performance issues
- ✅ Smooth scrolling
- ✅ No crashes

**Status:** [ ] Pass [ ] Fail

---

## 10. Offline Functionality Tests

### Test 10.1: Airplane Mode
**Steps:**
1. Enable airplane mode
2. Use all app features
3. Create event
4. Add guests
5. Update RSVP

**Expected:**
- ✅ All features work
- ✅ No network errors
- ✅ Data saves locally
- ✅ No crashes

**Status:** [ ] Pass [ ] Fail

---

### Test 10.2: No Internet Connection
**Steps:**
1. Disconnect from WiFi/mobile data
2. Use app normally
3. Test all features

**Expected:**
- ✅ App fully functional
- ✅ No error messages
- ✅ All operations complete
- ✅ Data persists

**Status:** [ ] Pass [ ] Fail

---

### Test 10.3: Image Handling Offline
**Steps:**
1. Add event with image
2. View event
3. Check image loads

**Expected:**
- ✅ Image saves as base64
- ✅ Image displays correctly
- ✅ No loading errors
- ✅ Image persists

**Status:** [ ] Pass [ ] Fail

---

## 11. Performance Tests

### Test 11.1: App Launch Time
**Steps:**
1. Close app completely
2. Launch app
3. Measure time to home screen

**Expected:**
- ✅ Launches in < 3 seconds
- ✅ No lag or freezing
- ✅ Smooth animation
- ✅ Data loads quickly

**Status:** [ ] Pass [ ] Fail

---

### Test 11.2: List Scrolling
**Steps:**
1. Navigate to event list
2. Scroll rapidly
3. Test with 20+ events

**Expected:**
- ✅ Smooth scrolling
- ✅ No lag or stutter
- ✅ Images load efficiently
- ✅ No memory issues

**Status:** [ ] Pass [ ] Fail

---

### Test 11.3: Memory Usage
**Steps:**
1. Use app for 10 minutes
2. Navigate all screens
3. Create/edit multiple events
4. Check memory usage

**Expected:**
- ✅ Memory usage stable
- ✅ No memory leaks
- ✅ App doesn't slow down
- ✅ No crashes

**Status:** [ ] Pass [ ] Fail

---

## 12. Error Handling Tests

### Test 12.1: Invalid Data
**Steps:**
1. Try creating event without title
2. Try adding guest without number
3. Try invalid date/time

**Expected:**
- ✅ Validation errors shown
- ✅ User-friendly messages
- ✅ No crashes
- ✅ Can correct and retry

**Status:** [ ] Pass [ ] Fail

---

### Test 12.2: Edge Cases
**Steps:**
1. Create event with very long title
2. Add 100+ guests
3. Upload large image
4. Test limits

**Expected:**
- ✅ Handles gracefully
- ✅ Shows appropriate limits
- ✅ No crashes
- ✅ Data integrity maintained

**Status:** [ ] Pass [ ] Fail

---

## Test Summary

### Overall Results
- Total Tests: 50
- Passed: ___
- Failed: ___
- Skipped: ___
- Pass Rate: ___%

### Critical Issues
1. _______________
2. _______________
3. _______________

### Minor Issues
1. _______________
2. _______________
3. _______________

### Recommendations
1. _______________
2. _______________
3. _______________

## Automated Testing

### Unit Tests
```bash
npm test
```

### Integration Tests
```bash
npm run test:integration
```

### E2E Tests (Future)
```bash
npm run test:e2e
```

## Continuous Testing

### Daily Smoke Tests
- [ ] App launches
- [ ] Can create event
- [ ] Can add guest
- [ ] Data persists

### Weekly Regression Tests
- [ ] All features functional
- [ ] No new bugs
- [ ] Performance acceptable
- [ ] Data integrity maintained

### Release Testing
- [ ] Full test suite
- [ ] Performance benchmarks
- [ ] Security audit
- [ ] User acceptance testing

## Conclusion

This testing guide ensures comprehensive coverage of all offline functionality. Regular testing maintains app quality and reliability.

**Next Steps:**
1. Complete all tests
2. Document issues
3. Fix critical bugs
4. Retest
5. Deploy

---

**Testing Date:** ___________
**Tester Name:** ___________
**App Version:** ___________
**Device/Emulator:** ___________
