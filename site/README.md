# Tech Express 2.0 — Live Google Sheets Edition

## Backend connection
This build is configured to use the deployed Google Apps Script Web App URL in `js/config.js`.
The public storefront loads active products/categories/settings from Google Sheets.
Checkout creates a real order in the `Orders` and `OrderItems` sheets and reserves stock.
Order tracking verifies the Order ID with the last four digits of the customer's phone number.
Admin login and management pages use the Apps Script API (Products, Categories, Orders, Settings).

## Deploy
1. Upload all files and folders to the GitHub repository root.
2. Enable GitHub Pages (or use the existing static hosting).
3. Ensure the Apps Script deployment is accessible to Anyone and uses the latest deployed version.
4. Keep the Apps Script URL in `js/config.js` unchanged unless you create a new deployment.

## Important
- Do not publish admin credentials in the repository.
- Admin login is the mobile/Login ID and password set in Apps Script Script Properties.
- If you edit Apps Script after deployment, use Deploy > Manage deployments > Edit > New version > Deploy.
- Browser/API connectivity is dependent on Google Apps Script web-app CORS/redirect behavior; test storefront loading, checkout and admin login after publishing.
