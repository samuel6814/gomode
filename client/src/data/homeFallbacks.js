/** Static fallbacks for home sections when API data is unavailable */

export const GALLERY_FALLBACK_ITEMS = [
  {
    id: 'fallback-gallery-0',
    title: 'Portrait Study I',
    caption: 'Graphite on paper',
    image: { url: '/569842621_17984761403874841_335621393189909569_n.jpg' },
    isFeatured: true,
    sortOrder: 0,
  },
  {
    id: 'fallback-gallery-1',
    title: 'Portrait Study II',
    caption: 'Graphite on paper',
    image: { url: '/572537084_17985895217874841_3918828426063924237_n.jpg' },
    isFeatured: true,
    sortOrder: 1,
  },
  {
    id: 'fallback-gallery-2',
    title: 'Portrait Study III',
    caption: 'Graphite on paper',
    image: { url: '/608022069_17991468155874841_8624161264141853649_n.jpg' },
    isFeatured: true,
    sortOrder: 2,
  },
  {
    id: 'fallback-gallery-3',
    title: 'Portrait Study IV',
    caption: 'Graphite on paper',
    image: { url: '/715338439_1370312594940476_2712085561365120953_n.jpg' },
    isFeatured: true,
    sortOrder: 3,
  },
];

export const GALLERY_FALLBACK_CONFIG = {
  title: 'Gallery',
  subtitle: 'Graphite portraits and pencil studies',
  items: GALLERY_FALLBACK_ITEMS,
};
