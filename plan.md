1. **Improve Accessibility in Moderation Page (`src/app/dashboard/evento/[id]/moderacao/page.tsx`)**
   - Add `focus-within:opacity-100` to the approval queue overlay so it becomes visible when keyboard users tab into the approve/reject buttons.
   - Add `focus-within:opacity-100` to the active gallery delete button so it becomes visible when focused.
   - Add `focus-visible:ring-2` and `outline-none` to all buttons in the moderation page for clear keyboard focus indicators.
   - Add `aria-label="Excluir Mídia"` to the icon-only delete button in the active gallery to fix the screen reader experience.
2. **Complete pre commit steps**
   - Run required checks using instructions from the environment to ensure everything is correct and no regressions are introduced.
3. **Submit the change.**
   - Commit and submit the code with a descriptive message.
