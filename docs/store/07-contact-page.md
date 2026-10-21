# Contact

The contact page is [client/src/pages/user/others/ContactUs.jsx](../../client/src/pages/user/others/ContactUs.jsx) at `/contact`.

The form posts to `/api/contact`. WhatsApp, Instagram, mail, and phone links are read from [client/src/utils/contactLinks.js](../../client/src/utils/contactLinks.js):

- `WHATSAPP_URL`
- `INSTAGRAM_URL`
- `MAILTO_URL`
- `PHONE_TEL`

Display name, city, and related copy come from [client/src/theme/brand.js](../../client/src/theme/brand.js). Change those two files when the public contact details change. Do not commit personal addresses into these guides.
