# Quick Fix for 404 Error on Vercel

## ⚠️ IMPORTANT: Set Root Directory

Your app code is in the **`govsit`** folder, but Vercel is trying to build from the repository root. You **must** set the Root Directory in Vercel:

### Steps:

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Click your project** (harishgov or siteonegove)
3. **Go to Settings** → **General**
4. **Find "Root Directory"** section
5. **Click "Edit"** and enter: `govsit`
6. **Save**
7. **Redeploy**: Go to **Deployments** → Click **⋯** on latest deployment → **Redeploy**

## Why This Fixes the 404

- Without Root Directory set: Vercel looks for `server.js` at repo root → **404**
- With Root Directory = `govsit`: Vercel builds from `govsit/` folder → finds `server.js` ✅

## After Setting Root Directory

Once Root Directory is set to `govsit` and you redeploy:
- ✅ `harishgov.vercel.app` → Shows login page
- ✅ Login works → Redirects to courses
- ✅ Watch button → Creates ticket and redirects to course

## Still Getting 404?

1. **Check Root Directory is saved**: Settings → General → Root Directory should show `govsit`
2. **Check deployment logs**: Deployments → Click latest → Check "Build Logs" for errors
3. **Verify files exist**: Make sure `govsit/server.js` and `govsit/public/` are in your repo
4. **Check vercel.json**: Should be at repo root with `"src": "server.js"` (this works when Root Directory = `govsit`)
