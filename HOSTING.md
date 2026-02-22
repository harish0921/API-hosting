# Hosting on Vercel

Follow these steps so **harishgov.vercel.app** works correctly.

## 1. Set Root Directory in Vercel

Your app code lives in the **govsit** folder. Vercel must use it as the project root:

1. Open [Vercel Dashboard](https://vercel.com/dashboard) → your project **siteonegove** (or harishgov).
2. Go to **Settings** → **General**.
3. Under **Root Directory**, click **Edit**, enter: `govsit`
4. Save.

## 2. Redeploy

After changing the Root Directory, trigger a new deployment:

- **Deployments** → … on the latest deployment → **Redeploy**,  
  or push a new commit to your repo.

## 3. Course site URL (optional)

When a user clicks **Watch** on a course, the app opens the course in an iframe. By default it expects the course site at a URL you set.

- If you host the **couressit** (course) site separately (e.g. another Vercel project or static URL), set this in your Vercel project:
  - **Settings** → **Environment Variables**
  - Add: `COURSE_SITE_BASE` = `https://your-course-site-url.com`
  - Redeploy.

- If you haven’t set `COURSE_SITE_BASE`, the app still runs; only the course iframe may not load until you point it to the real course site URL.

## Flow after hosting

1. User visits **harishgov.vercel.app** → redirects to **login**.
2. User logs in (e.g. harish / 1234) → goes to **courses**.
3. User clicks **Watch** on a course → gets a ticket and is redirected to **/launch-course?ticket=...**.
4. That page shows the course in an iframe (from `COURSE_SITE_BASE`).

Login, courses list, and “Watch” redirect all work on Vercel once the Root Directory is set to **govsit** and you redeploy.
