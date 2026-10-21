# Commissions

The public page is [client/src/pages/user/others/CommissionsPage.jsx](../../client/src/pages/user/others/CommissionsPage.jsx) at `/commissions`.

The inquiry form posts to `/api/contact`. The subject is `SERVICE_SUBJECT` from [client/src/theme/brand.js](../../client/src/theme/brand.js) (`Commission Inquiry`). The admin list uses that subject to separate these messages from other contact mail.

Admins read them at `/admin/commissions`, with a detail route at `/admin/commissions/:id`. The admin sidebar links to that inbox.

Copy and the WhatsApp link on the public page come from `brand.js` and [client/src/utils/contactLinks.js](../../client/src/utils/contactLinks.js).
