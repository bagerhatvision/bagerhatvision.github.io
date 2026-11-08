# Tech Express — Smart Watch Shop

Lightweight static e-commerce starter for GitHub Pages. The current build runs in **Demo Mode** using browser LocalStorage. Google Sheets / Apps Script is intentionally not connected yet.

## Run locally
Open `index.html` in a browser, or use VS Code Live Server.

## Publish to GitHub Pages
1. Create a GitHub repository.
2. Upload the contents of this folder to the repository root.
3. In **Settings → Pages**, choose **Deploy from a branch**, select `main` and `/ (root)`.
4. Save. GitHub will provide the site URL.

## Demo admin
- URL: `admin/index.html`
- Username: `admin`
- Password: `1234`

**Important:** Demo credentials and LocalStorage are for preview only, not production security. Before public launch, replace demo authentication and data operations with server-side Apps Script authorization.

## Later Google Sheets connection
Edit `js/config.js` and set `API_MODE` to `apps-script` and `APPS_SCRIPT_URL` to the deployed Apps Script Web App URL. Then implement/enable the API actions in `js/store.js` to match the final Apps Script contract. No Apps Script URL is required for this demo build.

## Included pages
Home, products, product details, cart, COD checkout, order tracking, about, contact, admin login, admin dashboard, products, orders, categories and settings.

## Notes
- Product images are URL fields, not uploaded into Google Sheets.
- Demo products and orders are stored in LocalStorage in this browser.
- This site is designed mobile-first and includes keyboard/remote-friendly focus styles for Android TV browsers.

## UI refinements (v2)
- Replaced unrelated remote demo photos with local product-specific SVG illustrations.
- Reduced mobile intro and product-card whitespace.
- Hid the horizontal category scrollbar while keeping swipe scrolling.
- Added arrow-key focus navigation for Android TV remotes and keyboards.

## Reference UI update (v4)
- Rebuilt responsive header with red cart mark, search and cart actions.
- Added persistent four-item mobile bottom navigation.
- Added a proper footer with brand, quick links and help links; short pages use a flex sticky-footer layout.
- Added Android TV user-agent styling for dark navy remote-friendly presentation.
- Bumped demo LocalStorage keys so stale demo image URLs from older versions do not override the corrected local sample images.

## UI refinement (v5)
- Simplified the footer to a compact brand row, one Contact link, copyright and Admin Login.
- Removed duplicated Home, Products and Order Tracking footer links because primary navigation is already available in the mobile bottom navigation.
- Reduced footer vertical padding on mobile and desktop.

## UI refinement (v6 — final footer reference)
- Rebuilt the storefront footer as a short brand-and-benefits strip.
- Removed Contact and Admin Login links from the footer.
- Copyright now reads exactly: © Tech Express 2.0 - 2026 / All Rights Reserved.
- Kept the mobile bottom navigation separate and unchanged.

## UI refinement (v7 — official branding and contacts)
- Updated store name to Tech Express 2.0 and tagline to “🛒Quality gadgets you can trust.🛍️”.
- Added the supplied Imgur direct logo URL to the storefront header and footer.
- Added official Facebook page and WhatsApp contact 01303-072964 to the compact footer.
- Updated the Contact page phone and WhatsApp links.
- Kept the compact footer copyright and mobile bottom navigation.
