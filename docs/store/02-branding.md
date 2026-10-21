# Branding

Brand tokens live in [client/src/theme/brand.js](../../client/src/theme/brand.js).

- The name is `buyy`.
- The tagline is `Shopping designed around you.`
- The canvas is `#f2f4f5`. Ink and the accent are black (`#000000`).
- Body type is Inter. The wordmark uses Archivo Black.
- Card, inner, and pill radii are `0`.

Global square corners are forced in `client/index.css`: `#root` and its children use `border-radius: 0`.

The wordmark component is [client/src/components/BuyyLogo.jsx](../../client/src/components/BuyyLogo.jsx). The homepage also draws the letters in [client/src/pages/user/home/HomeLayout.jsx](../../client/src/pages/user/home/HomeLayout.jsx). That wordmark is part of the storefront layout. It is not a field on the admin hero screen.

Favicon and touch icon live in `client/public/` (`favicon.svg`, `apple-touch-icon.png`). The document title is set in `client/index.html`.

Current catalog products carry a `buyy` tag. [client/src/components/ProductMarks.jsx](../../client/src/components/ProductMarks.jsx) paints that tag as a black label with white text on the product photo. Products without the tag do not get the label.
