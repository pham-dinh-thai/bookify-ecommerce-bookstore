# Design System: Bookify

## 1. Overview & Creative North Star
**Creative North Star: "The Digital Archivist"**
This design system rejects the cluttered, "big-box" retail aesthetic in favor of a high-end editorial experience. It is built to feel like a quiet, sun-drenched library where foreign literature is curated, not just sold. We move beyond standard minimalism through **intentional asymmetry** and **tonal layering**.

Instead of rigid grids, we use breathing room as a functional element to guide the eye. The interface should feel like high-quality paper stock: tactile, premium, and sophisticated. We achieve "friendly" not through loud colors, but through soft geometry and an approachable, human-centric hierarchy.

---

## 2. Colors & Surface Architecture
The palette is rooted in botanical and academic tones—`primary` (Forest Green) and `secondary` (Deep Navy)—set against warm, organic neutrals.

### The No-Line Rule
**Borders are prohibited for sectioning.** To separate content, use background shifts. For example, a global navigation bar should use `surface-container-low` against a `surface` background. This creates a molded look rather than a constructed one.

### Surface Hierarchy & Nesting
Depth is created by stacking surface tokens.
- **Base Layer:** `surface` (`#f7faf5`) — the canvas.
- **Secondary Sectioning:** `surface-container-low` (`#eff5ef`) — subtle grouping.
- **Interactive/Elevated Cards:** `surface-container-lowest` (`#ffffff`) — makes book covers and featured content pop.
- **The Glass Rule:** For floating navigation or modal overlays, use `surface-container-lowest` at 80% opacity with `24px` backdrop blur. This glassmorphism keeps the UI integrated with the content beneath it.

### Signature Textures
Apply a subtle linear gradient to primary CTAs: `primary` (`#3f6754`) to `primary-dim` (`#335b48`). This adds visual soul and avoids a flat digital look.

---

## 3. Typography: The Editorial Voice
Use **Manrope** exclusively. It is a modern sans-serif with geometric foundations and organic terminals, balancing professional and friendly tone.

- **Display (lg/md/sm):** Hero sections and literary quotes. Letter spacing: `-0.02em` for a tight, high-end masthead feel.
- **Headline (lg/md/sm):** Category titles and key section headers.
- **Body (lg/md):** Readability-first. Use `on-surface-variant` (`#58615b`) for long-form descriptions to reduce eye strain and support the soft aesthetic.
- **Labels:** Always uppercase with `+0.05em` letter spacing for metadata (ISBN, language, weight), creating an archival contrast to fluid headlines.

---

## 4. Elevation & Depth
Avoid heavy shadow-driven UI and prefer **tonal layering**.

- **Layering Principle:** To lift a book card, place a `surface-container-lowest` card on a `surface-container` background.
- **Ambient Shadows:** Use only for floating elements (cart drawers, popovers).
  - **Spec:** `0px 20px 40px rgba(43, 53, 47, 0.06)`.
- **Ghost Border:** If a boundary is needed for accessibility, use `outline-variant` (`#aab4ad`) at **15% opacity**. Never use fully opaque borders.

---

## 5. Component Guidance

### Buttons
- **Primary:** `primary` background, `on-primary` text, `xl` (`1.5rem`) corner radius.
- **Secondary:** `secondary-container` background, `on-secondary-container` text, no border.
- **Tertiary:** Text-only with a subtle underline using `primary-fixed-dim`.

### Cards & Lists
- **Constraint:** No dividers. Use `24px` or `32px` vertical whitespace between list items.
- **Book Cards:** `surface-container-lowest` with `lg` (`1rem`) corner radius. Book covers should be slightly inset for a framed gallery effect.

### Input Fields
- **Default State:** Soft-filled using `surface-container-high` background.
- **Focus State:** Transition background to `surface-container-lowest` and apply a `1px` ghost border in `primary`.

### Navigation (Floating Bar)
Use a centered, floating navigation pill with `9999px` radius, following the Glass Rule, instead of a full-width header.

---

## 6. Do's and Don'ts

### Do
- **Embrace Asymmetry:** Left-align headlines while constraining body content in a narrower adjacent column.
- **Use Generous Leading:** Keep body line-height at least `1.6`.
- **Tone-on-Tone:** Use `on-surface-variant` text on `surface-container` backgrounds for secondary information.

### Don't
- **No Pure Black:** Never use `#000000`. Use `on-surface` (`#2b352f`) for dark text.
- **No Sharp Corners:** Every interactive element should use at least `DEFAULT` (`0.5rem`) rounding.
- **No Grid Lock:** Do not stretch sparse content to fill space. Preserve intentional whitespace as a visual frame.
