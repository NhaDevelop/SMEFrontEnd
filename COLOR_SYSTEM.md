# Global Color System Documentation

## Overview

This document describes the **global color system** used throughout the SME Frontend application. All colors are centralized in `/utils/sme-data.ts` to ensure consistency across all components, charts, and UI elements.

## Color Categories

### 1. Risk Level Colors (`RISK_COLORS`)

Used for risk badges, scatter plot dots, and risk indicators.

| Risk Level | Background       | Light BG        | Text               | Border               | Chart Color |
| ---------- | ---------------- | --------------- | ------------------ | -------------------- | ----------- |
| **Low**    | `bg-emerald-500` | `bg-emerald-50` | `text-emerald-700` | `border-emerald-100` | `#10b981`   |
| **Medium** | `bg-amber-500`   | `bg-amber-50`   | `text-amber-700`   | `border-amber-100`   | `#f59e0b`   |
| **High**   | `bg-rose-500`    | `bg-rose-50`    | `text-rose-700`    | `border-rose-100`    | `#f43f5e`   |

**Usage:**

```typescript
import { getRiskColors } from "~/utils/sme-data";

const colors = getRiskColors("Low");
// Returns: { bg, bgLight, text, border, dot, chart }
```

---

### 2. Readiness Score Colors (`READINESS_COLORS`)

Used for score badges, progress bars, and readiness indicators.

| Readiness Level      | Score Range | Background       | Text               | Progress Bar     | Chart Color |
| -------------------- | ----------- | ---------------- | ------------------ | ---------------- | ----------- |
| **Investment Ready** | 80-100      | `bg-emerald-100` | `text-emerald-800` | `bg-emerald-600` | `#059669`   |
| **Near Ready**       | 60-79       | `bg-cyan-100`    | `text-cyan-800`    | `bg-cyan-600`    | `#0891b2`   |
| **Early Stage**      | 40-59       | `bg-amber-100`   | `text-amber-800`   | `bg-amber-600`   | `#d97706`   |
| **Pre-Investment**   | 0-39        | `bg-orange-100`  | `text-orange-800`  | `bg-orange-600`  | `#ea580c`   |

**Usage:**

```typescript
import { getReadinessColors, getReadinessLevel } from "~/utils/sme-data";

const level = getReadinessLevel(75); // Returns: 'Near Ready'
const colors = getReadinessColors(75);
// Returns: { bg, text, border, progress, chart }
```

---

### 3. Status Colors (`STATUS_COLORS`)

Used for goal status, action status, and general status indicators.

| Status        | Background       | Text               | Border               | Dot              |
| ------------- | ---------------- | ------------------ | -------------------- | ---------------- |
| **active**    | `bg-cyan-100`    | `text-cyan-700`    | `border-cyan-200`    | `bg-cyan-500`    |
| **completed** | `bg-emerald-100` | `text-emerald-700` | `border-emerald-200` | `bg-emerald-500` |
| **achieved**  | `bg-emerald-100` | `text-emerald-700` | `border-emerald-200` | `bg-emerald-500` |
| **pending**   | `bg-amber-100`   | `text-amber-700`   | `border-amber-200`   | `bg-amber-500`   |
| **overdue**   | `bg-rose-100`    | `text-rose-700`    | `border-rose-200`    | `bg-rose-500`    |
| **cancelled** | `bg-gray-100`    | `text-gray-700`    | `border-gray-200`    | `bg-gray-500`    |

**Usage:**

```typescript
import { getStatusColors } from "~/utils/sme-data";

const colors = getStatusColors("active");
// Returns: { bg, text, border, dot }
```

---

### 4. Priority Colors (`PRIORITY_COLORS`)

Used for action priorities and task priorities.

| Priority   | Background    | Text             | Border             |
| ---------- | ------------- | ---------------- | ------------------ |
| **high**   | `bg-rose-50`  | `text-rose-700`  | `border-rose-100`  |
| **medium** | `bg-amber-50` | `text-amber-700` | `border-amber-100` |
| **low**    | `bg-blue-50`  | `text-blue-700`  | `border-blue-100`  |

**Usage:**

```typescript
import { getPriorityColors } from "~/utils/sme-data";

const colors = getPriorityColors("high");
// Returns: { bg, text, border }
```

---

### 5. Primary Action Colors (`PRIMARY_COLORS`)

Used for primary buttons, CTAs, and success indicators.

| Type              | Class                  |
| ----------------- | ---------------------- |
| **Primary**       | `bg-[#198754]`         |
| **Primary Hover** | `hover:bg-[#157347]`   |
| **Success**       | `bg-emerald-600`       |
| **Success Hover** | `hover:bg-emerald-700` |

**Usage:**

```typescript
import { PRIMARY_COLORS } from '~/utils/sme-data'

// In template:
<button :class="[PRIMARY_COLORS.primary, PRIMARY_COLORS.primaryHover]">
  Submit
</button>
```

---

### 6. Chart Colors (`CHART_COLORS`)

Used for all charts, graphs, and data visualizations.

**Risk Charts:**

- Low: `#10b981` (emerald-500)
- Medium: `#f59e0b` (amber-500)
- High: `#f43f5e` (rose-500)

**Readiness Charts:**

- Investment Ready: `#059669` (emerald-600)
- Near Ready: `#0891b2` (cyan-600)
- Early Stage: `#d97706` (amber-600)
- Pre-Investment: `#ea580c` (orange-600)

**Pillar Charts:**

- Excellent (80-100): `#10b981` (emerald-500)
- Good (60-79): `#0891b2` (cyan-600)
- Fair (40-59): `#f59e0b` (amber-500)
- Poor (0-39): `#f43f5e` (rose-500)

**Usage:**

```typescript
import { CHART_COLORS, getPillarChartColor } from "~/utils/sme-data";

// For charts:
const pillarColor = getPillarChartColor(75); // Returns: '#0891b2'

// Direct access:
const riskColor = CHART_COLORS.risk.low; // Returns: '#10b981'
```

---

## Helper Functions

### `getRiskColors(risk)`

Returns all color classes for a risk level.

### `getReadinessLevel(score)`

Converts a score to a readiness level string.

### `getReadinessColors(score)`

Returns all color classes for a readiness score.

### `getStatusColors(status)`

Returns all color classes for a status.

### `getPriorityColors(priority)`

Returns all color classes for a priority level.

### `getPillarChartColor(score)`

Returns the hex color for a pillar score (for charts).

### `getPillarColor(score)`

Returns the Tailwind class for a pillar score (for progress bars).

---

## Migration Guide

### Old Code (Inconsistent):

```vue
<!-- Different colors in different files -->
<div class="bg-green-100 text-green-800">Low Risk</div>
<div class="bg-emerald-50 text-emerald-600">Low Risk</div>
<div class="bg-cyan-100 text-cyan-700">Low Risk</div>
```

### New Code (Consistent):

```vue
<script setup>
import { getRiskColors } from "~/utils/sme-data";

const riskColors = getRiskColors("Low");
</script>

<template>
  <div :class="[riskColors.bgLight, riskColors.textDark, riskColors.border]">
    Low Risk
  </div>
</template>
```

---

## Color Consistency Rules

1. **Always import from `/utils/sme-data.ts`**
2. **Never hardcode colors** - use the global constants
3. **Use helper functions** for dynamic colors
4. **For charts**, use `CHART_COLORS` hex values
5. **For UI elements**, use Tailwind classes from color objects

---

## Examples

### Risk Badge Component:

```vue
<script setup>
import { getRiskColors } from '~/utils/sme-data'

const props = defineProps<{ risk: 'Low' | 'Medium' | 'High' }>()
const colors = computed(() => getRiskColors(props.risk))
</script>

<template>
  <span
    :class="[
      colors.bgLight,
      colors.textDark,
      colors.border,
      'px-3 py-1 rounded-full',
    ]"
  >
    <span :class="[colors.dot, 'w-2 h-2 rounded-full']"></span>
    {{ risk }} Risk
  </span>
</template>
```

### Progress Bar:

```vue
<script setup>
import { getReadinessColors } from '~/utils/sme-data'

const props = defineProps<{ score: number }>()
const colors = computed(() => getReadinessColors(props.score))
</script>

<template>
  <div class="w-full bg-gray-200 rounded-full h-2">
    <div
      :class="[colors.progress, 'h-2 rounded-full']"
      :style="{ width: `${score}%` }"
    ></div>
  </div>
</template>
```

### Chart Configuration:

```typescript
import { CHART_COLORS } from "~/utils/sme-data";

const chartData = {
  datasets: [
    {
      data: [10, 20, 30],
      backgroundColor: [
        CHART_COLORS.risk.low,
        CHART_COLORS.risk.medium,
        CHART_COLORS.risk.high,
      ],
    },
  ],
};
```

---

## Benefits

✅ **Consistency** - Same colors everywhere  
✅ **Maintainability** - Change once, update everywhere  
✅ **Accessibility** - Carefully chosen color contrasts  
✅ **Type Safety** - TypeScript ensures correct usage  
✅ **Documentation** - Clear color purpose and usage

---

## Color Palette Reference

### Emerald (Success/Low Risk)

- 50: `#ecfdf5`
- 100: `#d1fae5`
- 500: `#10b981`
- 600: `#059669`
- 700: `#047857`

### Cyan (Near Ready)

- 50: `#ecfeff`
- 100: `#cffafe`
- 500: `#06b6d4`
- 600: `#0891b2`
- 700: `#0e7490`

### Amber (Medium Risk/Early Stage)

- 50: `#fffbeb`
- 100: `#fef3c7`
- 500: `#f59e0b`
- 600: `#d97706`
- 700: `#b45309`

### Rose (High Risk)

- 50: `#fff1f2`
- 100: `#ffe4e6`
- 500: `#f43f5e`
- 600: `#e11d48`
- 700: `#be123c`

---

**Last Updated:** 2026-02-03  
**Maintained By:** Development Team
