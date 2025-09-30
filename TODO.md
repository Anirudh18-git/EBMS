# TODO: Fix Login Issue After Deployment

## Step 1: Verify Deployment and Env Vars
- Check Vercel dashboard for backend deployment logs (look for "MongoDB Connected" or errors).
- Ensure MONGO_URI and JWT_SECRET are set as environment variables in Vercel project settings.
- If missing, add them and redeploy.

## Step 2: Confirm API URL
- Verify the deployed backend URL in Vercel (e.g., project-name.vercel.app).
- If different from constants.ts, update API_BASE_URL and rebuild frontend.

## Step 3: Test API Directly
- Use curl or Postman to test POST https://[deployed-url]/api/auth/login with {"email": "admin@system.com", "password": "admin"}.
- Expect { token, user } on success.
- Issue: API call redirected to Vercel authentication, indicating deployment is private or preview-protected. Make deployment public in Vercel project settings (under Settings > Privacy > Public).

## Step 4: Minor Code Cleanup
- Remove extra 'role' parameter from LoginPage.tsx login call. [DONE]

## Step 5: Frontend Redeploy
- If URL updated, rebuild and redeploy frontend.
