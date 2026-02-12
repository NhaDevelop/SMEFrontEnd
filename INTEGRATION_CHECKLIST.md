# ✅ Integration Verification Checklist

Use this checklist to verify that the mock data integration is working correctly across all pages and roles.

---

## 🔧 Before Testing

- [ ] Dev server is running (`npm run dev`)
- [ ] No TypeScript errors in terminal
- [ ] Browser console is open (F12) to check for errors

---

## 🔵 SME Role Testing

### Dashboard (`/sme/dashboard`)

- [ ] Page loads without errors
- [ ] Company name displays: "Angkor Tech"
- [ ] Overall score displays: **72** or **73** (rounded)
- [ ] Pillar chart shows 8 pillars with scores
- [ ] Progress chart shows improvement over time
- [ ] Recommended actions display (based on active goals)
- [ ] "Active Goals" section shows goal count
- [ ] No console errors

### Goals Page (`/sme/goals`)

- [ ] Page loads without errors
- [ ] Goals list displays
- [ ] Each goal shows pillar name
- [ ] Current score vs target score visible
- [ ] Gap analysis shows correctly
- [ ] No console errors

### Profile/Settings

- [ ] User profile data displays
- [ ] Company information shows correctly
- [ ] No console errors

---

## 🟢 Investor Role Testing

### Dashboard (`/investor/dashboard`)

- [ ] Page loads without errors
- [ ] Investor name displays: "Mekong Capital"
- [ ] Watchlist shows 2 SMEs:
  - [ ] Angkor Tech
  - [ ] GreenData Farm Solutions
- [ ] Portfolio statistics display:
  - [ ] Total watched: 2
  - [ ] Average score shown
  - [ ] High performers count
- [ ] No console errors

### SME Discovery/Search

- [ ] All SMEs list displays (3 total)
- [ ] Filter by industry works
- [ ] Filter by score range works
- [ ] Filter by stage works
- [ ] SME cards show:
  - [ ] Company name
  - [ ] Industry
  - [ ] Score (if assessed)
  - [ ] Stage
- [ ] No console errors

### SME Profile View

- [ ] Click on SME shows detailed profile
- [ ] Assessment scores visible
- [ ] Pillar breakdown shown
- [ ] Goals displayed
- [ ] Documents listed
- [ ] No console errors

---

## 🔴 Admin Role Testing

### Dashboard (`/admin/dashboard`)

- [ ] Page loads without errors
- [ ] Statistics display:
  - [ ] Total SMEs: 3
  - [ ] Total Investors: 2
  - [ ] Total Programs: 3
  - [ ] Active Programs: 2 or 3
  - [ ] Completed Assessments: 3
  - [ ] In Progress: 1
  - [ ] Average Score shown
- [ ] SME list displays with scores
- [ ] Recent activity/audit logs show
- [ ] Programs list displays
- [ ] No console errors

### Programs Page (`/admin/programs`)

- [ ] Page loads without errors
- [ ] Programs list shows 3 programs:
  - [ ] AgriTech 2024 Batch
  - [ ] FinTech Innovation Fund
  - [ ] Tech Growth Accelerator
- [ ] Each program shows:
  - [ ] Enrollment count
  - [ ] Average score
  - [ ] Status (Active/Completed)
- [ ] Statistics summary displays
- [ ] No console errors

### Audit Logs

- [ ] Audit logs page loads
- [ ] Shows admin actions
- [ ] Displays timestamps
- [ ] Shows action types
- [ ] No console errors

---

## 🟡 Shared Features Testing

### Notifications

- [ ] Notification icon shows unread count
- [ ] Clicking shows notification list
- [ ] Notifications display correctly
- [ ] Mark as read works (if implemented)
- [ ] No console errors

### Documents

- [ ] Documents page/section loads
- [ ] Shows documents by type:
  - [ ] Pitch Deck
  - [ ] Financials
  - [ ] Legal
- [ ] Verification status shown
- [ ] No console errors

### Assessment Questions

- [ ] Assessment form loads
- [ ] Shows all 8 pillars
- [ ] Questions display correctly
- [ ] Different question types render:
  - [ ] CHOICE (multiple choice)
  - [ ] BOOLEAN (yes/no)
  - [ ] NUMBER (numeric input)
- [ ] No console errors

---

## 🔍 Data Verification

### Check API Responses (Network Tab)

1. **Dashboard API** (`/api/dashboard`)
   - [ ] Returns `pillars` array with 8 items
   - [ ] Returns `progress` array
   - [ ] Returns `actions` array
   - [ ] Response time ~300ms

2. **Investor Dashboard** (`/api/investor/dashboard`)
   - [ ] Returns `investor` object
   - [ ] Returns `watchlist` array (2 items)
   - [ ] Returns `allSMEs` array (3 items)
   - [ ] Returns `stats` object

3. **Admin Dashboard** (`/api/admin/dashboard`)
   - [ ] Returns comprehensive `stats` object
   - [ ] Returns `smes` array (3 items)
   - [ ] Returns `recentActivity` array
   - [ ] Returns `programs` array (3 items)

### Check Console for Errors

- [ ] No 404 errors
- [ ] No TypeScript errors
- [ ] No undefined/null errors
- [ ] No import errors

---

## 🎯 Data Accuracy Checks

### SME 1: Angkor Tech

- [ ] Score: 72.5 (or 72/73 rounded)
- [ ] Industry: Technology
- [ ] Status: Completed assessment
- [ ] Has goals
- [ ] Enrolled in "Tech Growth Accelerator"

### SME 2: GreenData Farm Solutions

- [ ] Score: 78.0 (or 78 rounded)
- [ ] Industry: AgriTech
- [ ] Status: Completed assessment (improved from 65 to 78)
- [ ] Has goals
- [ ] Enrolled in "AgriTech 2024 Batch"

### SME 3: FinTech Solutions

- [ ] Score: Not completed (null or 0)
- [ ] Industry: FinTech
- [ ] Status: In Progress
- [ ] Enrolled in "FinTech Innovation Fund"

---

## 🐛 Common Issues & Fixes

### Issue: "Cannot find module '~/utils/mock-data'"

**Fix:** Restart dev server (`npm run dev`)

### Issue: API returns 404

**Fix:** Check that API file exists in `/server/api/` folder

### Issue: Data shows as undefined

**Fix:** Check browser console for import errors

### Issue: TypeScript errors

**Fix:** Check that all imports use correct paths

### Issue: Blank page

**Fix:**

1. Check browser console for errors
2. Check terminal for build errors
3. Verify API endpoint exists

---

## ✅ Success Criteria

**Integration is successful if:**

- [ ] All pages load without errors
- [ ] All roles (SME, Investor, Admin) display data
- [ ] Data matches DATABASE_SCHEMA_DESIGN.md structure
- [ ] Relationships work (e.g., goals linked to pillars)
- [ ] No TypeScript errors
- [ ] No console errors
- [ ] API responses are fast (~200-300ms)
- [ ] Data is realistic and makes sense

---

## 🎉 When All Checks Pass

**Congratulations!** Your mock data integration is complete and working perfectly!

Next steps:

1. Continue building features using the mock data
2. When ready, migrate to real backend API
3. No frontend changes needed during migration!

---

## 📞 Need Help?

If any checks fail:

1. Check the error message in browser console
2. Check terminal for build errors
3. Verify the API endpoint exists
4. Check `MOCK_DATA_INTEGRATION_STATUS.md` for reference
5. Review `API_ENDPOINTS_REFERENCE.md` for API details
