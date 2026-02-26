# Specification

## Summary
**Goal:** Fix the GPS capture bug in the asset entry form and add delete asset functionality to both the backend and admin dashboard.

**Planned changes:**
- Fix GPS capture in `AssetEntryForm.tsx` so the `useGeolocation` hook's `capture` callback is invoked correctly, coordinates are displayed in the form before submission, and included in the submission payload sent to the backend; show a clear error if geolocation is denied or unavailable
- Add a `deleteAsset(id: Text)` function to the backend Motoko actor (`backend/main.mo`) that removes the record from the in-memory map and returns a success/failure result
- Add a Delete button for each asset in the Admin Dashboard (detail drawer and/or table row) with a confirmation dialog before calling the backend delete function
- Add a `useDeleteAsset` mutation in `useQueries.ts` that calls the backend `deleteAsset` function and invalidates the asset list query on success
- Show a success toast on successful deletion and an error toast on failure, then refresh the asset list

**User-visible outcome:** GPS coordinates are correctly captured and saved when adding a new asset, and admins can delete individual asset records from the dashboard with a confirmation prompt and toast feedback.
