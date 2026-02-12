# Visual Style Guide

This document defines the shared visual language across the product family. It contains reusable design tokens, named styles, and component patterns. Individual projects map these generic styles to their specific UI elements.

---

## Colour Palette

| Token          | Hex       | Tailwind Class          | Role                                    |
|----------------|-----------|-------------------------|-----------------------------------------|
| Emerald-700    | #047857   | `emerald-700`           | Primary actions, positive state         |
| Rose-800       | #9f1239   | `rose-800`              | Warnings, errors, negative state        |
| Emerald-150    | #D1FAE5   | `bg-emerald-150`*       | Soft highlights, light accents          |
| Zinc-800       | #27272A   | `zinc-800`              | Body text, headings, dark UI elements   |
| Amber-50       | #FFFBEB   | `amber-50`              | Page background                         |
| White          | #FFFFFF   | `white`                 | Cards, modals, section backgrounds      |

*Emerald-150 is a custom shade. Define in CSS as:
```css
.bg-emerald-150 { background-color: #D1FAE5; }
.text-emerald-150 { color: #D1FAE5; }
.border-emerald-150 { border-color: #D1FAE5; }
```

---

## Typography Classes

Named type styles. Each project maps these to its own UI elements.

| Class Name         | Size         | Weight         | Colour      | Notes                  |
|--------------------|--------------|----------------|-------------|------------------------|
| `type-title`       | `text-2xl`   | `font-bold`    | Zinc-800    | Main page titles       |
| `type-heading`     | `text-lg`    | `font-semibold`| Zinc-800    | Section headings       |
| `type-body`        | `text-base`  | `font-normal`  | Zinc-800    | General body text      |
| `type-body-emphasis`| `text-base` | `font-medium`  | Zinc-800    | Emphasized body text   |
| `type-body-italic` | `text-base italic`| `font-normal`| Zinc-800  | Subtle or quoted text  |
| `type-caption`     | `text-sm`    | `font-medium`  | Zinc-800    | Labels, small text     |
| `type-number`      | `text-lg`    | `font-bold`    | Emerald-700 | Highlighted numbers    |

All text uses the system font stack via Tailwind defaults. No custom fonts.

---

## Buttons

### Primary Button
Main call-to-action. Used for the most important action on screen.
```
bg-emerald-700 hover:bg-emerald-800 text-white
font-semibold
px-6 py-2.5
rounded-lg
border-none
transition-colors duration-150
cursor-pointer
```

### Secondary Button
Alternative or less prominent action.
```
bg-white hover:bg-emerald-50 text-emerald-700
font-semibold
px-6 py-2.5
rounded-lg
border-2 border-emerald-700
transition-colors duration-150
cursor-pointer
```

### Disabled Button
Inactive state for any button.
```
bg-zinc-200 text-zinc-400
cursor-not-allowed
(same padding and rounding as primary/secondary)
```

---

## Cards & Containers

### Card Standard
Standard content container with subtle depth.
```
bg-white
rounded-xl
shadow-md
p-3
border border-zinc-200
```

### Card Light
Lightweight container with minimal elevation.
```
bg-white
rounded-lg
shadow-sm
px-6 py-3
border border-zinc-100
```

### Card Prominent
High-emphasis container for focused content (e.g. dialogs, overlays).
```
bg-white
rounded-xl
shadow-lg
p-8
max-w-sm mx-auto
border border-zinc-100
```

---

## Spacing

| Token              | Value    | Usage                                  |
|--------------------|----------|----------------------------------------|
| `spacing-page`     | `p-4`   | Page-level padding                     |
| `spacing-section`  | `gap-4` | Gap between major sections             |
| `spacing-items`    | `gap-3` | Gap between related items (e.g. buttons)|
| `spacing-internal` | `p-8`   | Internal padding for prominent containers|

---

## Transitions & Animations

| Token                  | Duration | Easing         | Usage                              |
|------------------------|----------|----------------|------------------------------------|
| `transition-fast`      | 150ms    | `ease-in-out`  | Hover states, colour changes       |
| `transition-standard`  | 200ms    | `ease-out`     | Element appear/disappear, selection|
| `transition-move`      | 250ms    | `ease-in-out`  | Position changes, movement         |
| `transition-fade`      | 250ms    | `ease-out`     | Fade in/out                        |

---

## Responsive Behaviour

- Minimum supported width: 320px
- On narrow screens: stack sections vertically
- Button touch targets: minimum 44px height
- Content scales proportionally on smaller screens
