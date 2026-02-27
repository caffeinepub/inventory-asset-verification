# Specification

## Summary
**Goal:** Fix the GPS capture and camera/photo button functionality in the AssetEntryForm so both work correctly on mobile devices.

**Planned changes:**
- Fix the `PhotoUpload` component's file input so that `accept` and `capture` attributes are correctly set, and the "Take Photo" / "Upload from Gallery" buttons properly trigger the file input on mobile devices.
- Fix the GPS capture flow in `AssetEntryForm.tsx` so that the `useGeolocation` hook's `capture` function is called and awaited on form submission, and the resolved coordinates are read from the promise result (not stale state) before building the submission payload.
- Ensure GPS latitude, longitude, and accuracy are correctly included in the asset record sent to the backend.
- Show a clear error message to the user if GPS capture fails, blocking or gracefully handling submission.

**User-visible outcome:** On mobile, tapping the camera button opens the device camera and tapping the gallery button opens the file picker. On form submission, the user is prompted for location permission, and the captured GPS coordinates are stored with the asset record and displayed in the confirmation and Admin Dashboard detail view.
