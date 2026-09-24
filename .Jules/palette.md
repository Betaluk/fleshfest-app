## 2024-10-24 - Accessible Overlay Buttons
**Learning:** Found hover-only overlays masking interaction points in gallery cards. Keyboard users couldn't see the buttons they were tabbing into.
**Action:** Always add `focus-within:opacity-100` to containers that use `opacity-0 group-hover:opacity-100` to reveal interactive elements. Also ensured focus states using `focus-visible:ring-2` with appropriate colors (e.g. emerald/red) to match the button action.
