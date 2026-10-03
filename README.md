How to Setup
1. Create a new database in your MySQL server named `harvest_hotel`.
2. Open the `harvest_hotel.sql` file located in the `harvest-hotel-api` folder and execute the commands in your MySQL server with XAMPP to create the Reviews Table (yes, there is a MySQL database, but it is only used for storing reviews).
3. Inside the same `harvest-hotel-api` folder, run `npm install` to install the required dependencies.
4. Run `node index.js` to start the API server.
5. Open another terminal window and navigate to the `harvest-hotel` folder.
6. Run `npm install` to install the required dependencies.
7. Run `ionic serve` to start the Ionic application.
8. Open your web browser and go to `http://localhost:8100` to access the Harvest Hotel application.

Notes:
1. Default Initial Password is `1234567890`.
2. Yes, there arent any promo codes. Havent coded it in pa, though unsure if I have the time to do so currently.
3. The Booking and Account Details are stored in local storage. So if you clear your browser data, your bookings and account details will be lost.
4. I made this with the "Galaxy Note 20 Ultra Android 11" device setting in the Dev Tools, so it may look odd for larger widths. You can see how to simulate it here: https://developer.chrome.com/docs/devtools/device-mode#open_the_device_toolbar

How to Edit Events and Rooms Images
1. Go to the `src/app/events/events.page.ts` file to edit the events details including the image file names.
2. Go to the `src/app/rooms/rooms.page.ts` file to edit the rooms details including the image file names.
3. Place the event images in the `src/assets/img/events/` folder.
4. Place the room images in the `src/assets/img/rooms/` folder.
5. Make sure the image file names match the ones specified in the respective page.ts files.

---

## How to Deploy Online for Your Portfolio (100% Free Forever)

### Option A: Frontend on Vercel (Instant & Fast)
1. Push this project to your GitHub repository.
2. Go to [Vercel](https://vercel.com/) and sign in with GitHub.
3. Click **Add New** > **Project** and select this repo.
4. Set the settings:
   - **Framework Preset**: Angular / Other
   - **Root Directory**: `harvest-hotel`
   - **Build Command**: `npm run build`
   - **Output Directory**: `www`
5. Click **Deploy**. Vercel will give you a live production URL (e.g., `https://your-harvest-hotel.vercel.app`).
   *(Note: A `vercel.json` file is already included for SPA client routing).*

### Option B: Backend API on Render + Free MySQL
1. Create a free MySQL database at [TiDB Cloud](https://tidbcloud.com/) or [Aiven.io](https://aiven.io/).
2. Run the `harvest-hotel-api/harvest_hotel.sql` commands in your cloud database.
3. Go to [Render](https://render.com/) > **New** > **Web Service** and connect your GitHub repo.
   - **Root Directory**: `harvest-hotel-api`
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`
4. Add Environment Variables in Render:
   - `DB_HOST` = (Your Cloud DB Host)
   - `DB_USER` = (Your Cloud DB User)
   - `DB_PASSWORD` = (Your Cloud DB Password)
   - `DB_NAME` = `harvest_hotel`
   - `DB_PORT` = `3306` (or `4000` for TiDB)
   - `DB_SSL` = `true`
5. Copy your Render API URL (e.g. `https://harvest-hotel-api.onrender.com/api`) and update `baseUrl` in `src/app/services/review-api.service.ts`.
   *(Note: The app includes a smart fallback to local reviews, so your portfolio site will ALWAYS work seamlessly even when the backend is sleeping).*