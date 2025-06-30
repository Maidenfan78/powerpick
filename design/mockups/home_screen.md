# UI Style Guide

## Overall View Hierarchy

1. **Safe-area container** (full screen)
   - Background: **#121212**
   - Vertical layout:
     1. Status bar (native)
     2. Top app bar
     3. Main scrollable grid
     4. Bottom navigation bar

## 1. Top App Bar

- **Height**: ~56 dp
- **Background**: **#000000**
- **Contents** (horizontal row, spaced):
  1. **Left**: App logo placeholder (width ~120 dp)
  2. **Center**: Region selector dropdown
     - Container: width ~140 dp, height ~36 dp, background **#1E1E1E**, corner radius ~8 dp
     - Padding: 0 dp vertically, 12 dp horizontal
     - Layout: text label + down-caret icon, arranged in a row, centered
     - **Label**: 14 sp, medium weight, white (e.g. “NSW”)
     - **Icon**: caret-down, white, 16 dp
  3. **Right**: Overflow menu icon (“⋮”), white, 24 dp

## 2. Main Grid of Cards

- **Scrollable area** (vertical), padding **8 dp** top & bottom
- **Grid**: 2 columns, gutter **8 dp**, outer margins **8 dp**
- **Each card**:
  - **Container**:
    - Width = (screen_width – 3×8 dp)/2
    - Height ≈ 160 dp
    - Background **#1E1E1E**, corner radius **8 dp**
  - **Padding**: top/bottom 16 dp, left/right 12 dp
  - **Layout**: vertical, center-aligned
    1. **Icon placeholder**
       - Circle, diameter ~64 dp, solid fill (varies per card)
    2. **Spacer**: 12 dp
    3. **Headline**: jackpot amount
       - 18 sp, bold, white
    4. **Spacer**: 4 dp
    5. **Subtext**: draw day or format
       - 14 sp, regular, white

## 3. Bottom Navigation Bar

- **Height**: ~56 dp
- **Background**: **#000000**
- **Layout**: 4 items, equally spaced
- **Each item**:
  - Icon (24 dp) above label (12 sp)
  - **Selected**: tinted **#7B1FA2**
  - **Unselected**: tinted **#B0B0B0**

## Colour Palette

| Role                 | Colour  |
| -------------------- | ------- |
| Screen background    | #121212 |
| App bar/backgrounds  | #000000 |
| Card background      | #1E1E1E |
| Dropdown background  | #1E1E1E |
| Primary accent       | #7B1FA2 |
| Text primary         | #FFFFFF |
| Text secondary/icons | #B0B0B0 |

## Spacing & Typography

- **Margins/gutters**: 8 dp
- **Corner radii**: cards & dropdown 8 dp
- **Font sizes**:
  - Dropdown label: 14 sp
  - Card headline: 18 sp
  - Card subtext: 14 sp
  - Bottom-nav label: 12 sp
