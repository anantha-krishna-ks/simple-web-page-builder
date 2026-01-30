
# Fix Plan: Resolve Build Errors Causing Blank Screen

## Problem Summary
The application shows a blank screen because there are 9 TypeScript build errors preventing the app from compiling. The main issue is that `Header` component requires `isHeaderCollapsed` and `onToggleHeader` props, but these aren't being passed in 7 different files.

---

## Solution Overview
Make the `isHeaderCollapsed` and `onToggleHeader` props **optional** with default values in the Header component. This is the cleanest approach since:
1. Not all pages need header collapse functionality
2. It minimizes changes across the codebase
3. It follows the existing pattern of having optional props with defaults

---

## Changes Required

### 1. Update Header Component Props (Main Fix)
**File:** `src/components/Header.tsx`

Make the two required props optional with default values:
- Change `isHeaderCollapsed: boolean` → `isHeaderCollapsed?: boolean`  
- Change `onToggleHeader: () => void` → `onToggleHeader?: () => void`
- Add default values: `isHeaderCollapsed = false` and `onToggleHeader = () => {}`

### 2. Fix PDFCoverImage Component
**File:** `src/components/PDFCoverImage.tsx`

Remove the invalid `alt` attribute from the `<canvas>` element (canvas doesn't support alt).

### 3. Fix Index.tsx BookReader Props
**File:** `src/pages/Index.tsx`

Add the required `ebookPath` prop to the `BookReader` component.

---

## Technical Details

```text
┌─────────────────────────────────────────────────────────────┐
│                    Current State                            │
├─────────────────────────────────────────────────────────────┤
│  HeaderProps: isHeaderCollapsed (required)                  │
│               onToggleHeader (required)                     │
│                                                             │
│  7 files using <Header /> without these props → BUILD FAIL  │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                    After Fix                                │
├─────────────────────────────────────────────────────────────┤
│  HeaderProps: isHeaderCollapsed? = false (optional)         │
│               onToggleHeader? = () => {} (optional)         │
│                                                             │
│  All files compile successfully → APP WORKS                 │
└─────────────────────────────────────────────────────────────┘
```

---

## Files to Modify

| File | Change |
|------|--------|
| `src/components/Header.tsx` | Make `isHeaderCollapsed` and `onToggleHeader` optional with defaults |
| `src/components/PDFCoverImage.tsx` | Remove `alt` attribute from canvas element |
| `src/pages/Index.tsx` | Add `ebookPath` prop to BookReader |

---

## Expected Outcome
After these changes:
- All 9 build errors will be resolved
- The application will compile and render correctly
- No blank screen
