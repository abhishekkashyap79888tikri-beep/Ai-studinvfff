import { StyleOption, PresetRoom, ShoppableItem } from '../types';

export const STYLE_OPTIONS: StyleOption[] = [
  {
    id: 'mid-century-modern',
    name: 'Mid-Century Modern',
    subtitle: 'Warm Teak & Iconic 1950s Silhouettes',
    description: 'Organic curves, tapered walnut legs, mustard and olive accents, statement lighting, and architectural balance.',
    colors: ['#8B5A2B', '#C98A2C', '#4A5B42', '#EFE6D8', '#2C3E50'],
    keyElements: ['Eames-style lounge chair', 'Fluted walnut media console', 'Arched brass floor lamp', 'Geometric wool rug'],
    thumbnail: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
    promptDescription: 'High-end Mid-Century Modern interior makeover with rich walnut wood furniture, tapered peg legs, olive green and ochre accents, iconic mid-century armchairs, arched brass floor lamp, and geometric low-pile rug. Preserve original room structure, windows, and architecture.'
  },
  {
    id: 'scandinavian',
    name: 'Scandinavian',
    subtitle: 'Bright Oak, Hygge & Airy Minimalism',
    description: 'Clean lines, light blonde woods, neutral linen textures, cozy hygge layering, and functional warmth.',
    colors: ['#F7F6F2', '#D3C5B4', '#8E979D', '#3A3F44', '#C4B5A5'],
    keyElements: ['Light oak coffee table', 'Textured boucle sofa', 'Woven wool throw', 'Pendant paper lantern'],
    thumbnail: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
    promptDescription: 'Bright Scandinavian interior makeover, Nordic hygge aesthetic, soft natural daylight, blonde light oak woodwork, crisp off-white walls, textured beige and cream boucle furniture, minimalist ceramic ceramics, and airy open feeling. Preserve room architecture.'
  },
  {
    id: 'japandi',
    name: 'Japandi Harmony',
    subtitle: 'Wabi-Sabi Simplicity & Japanese Zen',
    description: 'The union of Japanese wabi-sabi simplicity and Scandinavian functionality, low-profile seating, and fluted acoustic wood.',
    colors: ['#282624', '#C2B49F', '#7E766D', '#E8DFD1', '#54594A'],
    keyElements: ['Low-profile platform sofa', 'Blackened wood slats', 'Ceramic ikebana vase', 'Rice paper lamp'],
    thumbnail: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
    promptDescription: 'Japandi luxury interior design, blend of Japanese wabi-sabi and Scandinavian minimalism, organic fluted dark and light wood, low platform seating, natural linen drapery, subtle clay textures, and zen peaceful lighting. Preserve room architecture.'
  },
  {
    id: 'industrial-loft',
    name: 'Industrial Loft',
    subtitle: 'Distressed Leather, Raw Steel & Brick',
    description: 'Raw materials, exposed architectural elements, distressed tobacco leather, matte black metal framing, and warm Edison ambient glow.',
    colors: ['#3A3B3C', '#8C4320', '#C19A6B', '#1E1E1E', '#9E9E9E'],
    keyElements: ['Cognac leather sofa', 'Reclaimed wood coffee table', 'Matte black metal shelving', 'Factory pendant lighting'],
    thumbnail: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    promptDescription: 'Modern urban industrial loft interior makeover, reclaimed timber and exposed textured wall, deep cognac distressed leather chesterfield sofa, matte black steel pipe shelving, warm amber Edison filament lighting, polished concrete accents. Preserve room architecture.'
  },
  {
    id: 'biophilic-modern',
    name: 'Biophilic Sanctuary',
    subtitle: 'Lush Botanical Living & Natural Stone',
    description: 'Connecting indoors to nature with living greenery, organic moss walls, live-edge wood, natural travertine, and sunlight.',
    colors: ['#2E473B', '#7A8B7B', '#E4DDD3', '#96705B', '#415D43'],
    keyElements: ['Large fiddle leaf fig & monstera', 'Travertine cocktail table', 'Linen upholstered seating', 'Rattan acoustic accents'],
    thumbnail: 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=800&q=80',
    promptDescription: 'High-end biophilic modern living room makeover, filled with dramatic indoor potted plants like fiddle leaf figs and bird of paradise, travertine stone coffee table, natural unbleached linen textures, organic wood grain, and abundant warm sunlight. Preserve room architecture.'
  },
  {
    id: 'coastal-contemporary',
    name: 'Coastal Contemporary',
    subtitle: 'Breezy Linens, Sea Glass & Bleached Woods',
    description: 'Effortless seaside sophistication with soft coastal indigo, bleached driftwood, natural jute, and washed cotton textures.',
    colors: ['#E9ECEF', '#8DA9C4', '#114B5F', '#D4AF37', '#DEE2E6'],
    keyElements: ['Slipcovered white linen sofa', 'Bleached ash wood console', 'Chunky woven jute rug', 'Ceramic marine pottery'],
    thumbnail: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80',
    promptDescription: 'Airy coastal contemporary interior makeover, soft bleached woods, crisp relaxed white slipcovered sofas, sea glass subtle muted blue accents, chunky woven jute area rug, oversized coastal artwork, and serene diffused light. Preserve room architecture.'
  },
  {
    id: 'warm-minimalism',
    name: 'Warm Minimalist',
    subtitle: 'Limewash Plaster & Sculptural Monochromes',
    description: 'Sculptural forms, tactile limewash walls, curved velvet/boucle seating, and refined quiet luxury.',
    colors: ['#F3EFEA', '#DACDC0', '#A3998E', '#4A443F', '#D7C7B2'],
    keyElements: ['Curved asymmetrical sofa', 'Honed travertine plinth', 'Matte plaster walls', 'Minimalist architectural lighting'],
    thumbnail: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80',
    promptDescription: 'Sophisticated warm minimalist interior makeover, hand-applied chalky limewash plaster finish, curved sculptural cloud sofa in ivory boucle, fluted travertine pedestal, understated gallery lighting, and seamless clutter-free tranquility. Preserve room architecture.'
  }
];

export const PRESET_ROOMS: PresetRoom[] = [
  {
    id: 'dated-living-room',
    name: 'Standard Living Room',
    category: 'Living Room',
    imageUrl: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=1400&q=80',
    description: 'A traditional neutral living room with basic layout, ripe for contemporary elevated reimagining.',
    styleImages: {
      'mid-century-modern': 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=1400&q=80',
      'scandinavian': 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1400&q=80',
      'japandi': 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1400&q=80',
      'industrial-loft': 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1400&q=80',
      'biophilic-modern': 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=1400&q=80',
      'coastal-contemporary': 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1400&q=80',
      'warm-minimalism': 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=80'
    },
    initialShoppableItems: [
      {
        id: 'item-1',
        name: 'Solano Walnut Armchair',
        category: 'Seating',
        price: '$489',
        retailer: 'Article',
        searchUrl: 'https://www.google.com/search?tbm=shop&q=Mid-Century+Walnut+Lounge+Chair',
        imageUrl: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=400&q=80',
        description: 'Solid American walnut framing with tailored high-density cushions.',
        styleMatch: 'Mid-Century Modern'
      },
      {
        id: 'item-2',
        name: 'Aura Arched Brass Floor Lamp',
        category: 'Lighting',
        price: '$219',
        retailer: 'CB2',
        searchUrl: 'https://www.google.com/search?tbm=shop&q=Arched+Brass+Floor+Lamp+Marble+Base',
        imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=400&q=80',
        description: 'Sleek brushed brass arm anchored by a heavy white Carrara marble plinth.',
        styleMatch: 'Mid-Century Modern'
      },
      {
        id: 'item-3',
        name: 'Kallio Moroccan Wool Area Rug (8x10)',
        category: 'Rugs',
        price: '$345',
        retailer: 'West Elm',
        searchUrl: 'https://www.google.com/search?tbm=shop&q=Moroccan+Diamond+Wool+Area+Rug+8x10',
        imageUrl: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=400&q=80',
        description: 'Hand-knotted plush New Zealand wool with minimalist charcoal lines.',
        styleMatch: 'Scandinavian'
      },
      {
        id: 'item-4',
        name: 'Monstera Deliciosa with Fluted Planter',
        category: 'Decor & Greenery',
        price: '$110',
        retailer: 'The Sill',
        searchUrl: 'https://www.google.com/search?tbm=shop&q=Large+Monstera+Deliciosa+Ceramic+Planter',
        imageUrl: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=400&q=80',
        description: 'Mature split-leaf indoor statement plant in matte bone stoneware.',
        styleMatch: 'Biophilic Modern'
      }
    ]
  },
  {
    id: 'empty-bedroom',
    name: 'Minimal Bedroom Studio',
    category: 'Bedroom',
    imageUrl: 'https://images.unsplash.com/photo-1540518614846-7ede433c4550?auto=format&fit=crop&w=1400&q=80',
    description: 'Empty bedroom with hardwood flooring and natural sunlight, waiting for personalized style infusion.',
    styleImages: {
      'mid-century-modern': 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1400&q=80',
      'scandinavian': 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1400&q=80',
      'japandi': 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80',
      'industrial-loft': 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1400&q=80',
      'biophilic-modern': 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1400&q=80',
      'coastal-contemporary': 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1400&q=80',
      'warm-minimalism': 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80'
    },
    initialShoppableItems: [
      {
        id: 'bed-1',
        name: 'Mesa Upholstered Platform Bed',
        category: 'Furniture',
        price: '$799',
        retailer: 'Castlery',
        searchUrl: 'https://www.google.com/search?tbm=shop&q=Low+Profile+Upholstered+Platform+Bed',
        imageUrl: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=400&q=80',
        description: 'Tapered solid wood frame with padded textured headboard.',
        styleMatch: 'Japandi Harmony'
      },
      {
        id: 'bed-2',
        name: 'Washed European Flax Linen Duvet',
        category: 'Textiles',
        price: '$180',
        retailer: 'Brooklinen',
        searchUrl: 'https://www.google.com/search?tbm=shop&q=Washed+European+Flax+Linen+Duvet+Oatmeal',
        imageUrl: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=400&q=80',
        description: '100% French linen garment washed for relaxed softness and breathability.',
        styleMatch: 'Scandinavian'
      },
      {
        id: 'bed-3',
        name: 'Akari-Inspired Rice Paper Pendant',
        category: 'Lighting',
        price: '$120',
        retailer: 'Hay',
        searchUrl: 'https://www.google.com/search?tbm=shop&q=Japanese+Paper+Lantern+Pendant+Light',
        imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=400&q=80',
        description: 'Handcrafted mulberry washi paper diffusing gentle warm ambience.',
        styleMatch: 'Japandi Harmony'
      }
    ]
  },
  {
    id: 'open-kitchen-dining',
    name: 'Open Dining & Nook',
    category: 'Dining Room',
    imageUrl: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1400&q=80',
    description: 'Clean architectural dining nook ready for bespoke lighting, statement seating, and artisanal tableware.',
    styleImages: {
      'mid-century-modern': 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1400&q=80',
      'scandinavian': 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1400&q=80',
      'japandi': 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1400&q=80',
      'industrial-loft': 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1400&q=80',
      'biophilic-modern': 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=1400&q=80',
      'coastal-contemporary': 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1400&q=80',
      'warm-minimalism': 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=80'
    },
    initialShoppableItems: [
      {
        id: 'dining-1',
        name: 'Olsen Oval Oak Dining Table',
        category: 'Furniture',
        price: '$950',
        retailer: 'Crate & Barrel',
        searchUrl: 'https://www.google.com/search?tbm=shop&q=Solid+White+Oak+Oval+Dining+Table',
        imageUrl: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=400&q=80',
        description: 'Generous pill-shaped tabletop in wire-brushed solid white oak.',
        styleMatch: 'Scandinavian'
      },
      {
        id: 'dining-2',
        name: 'Wishbone Dining Chairs (Set of 2)',
        category: 'Seating',
        price: '$380',
        retailer: 'Rove Concepts',
        searchUrl: 'https://www.google.com/search?tbm=shop&q=Hans+Wegner+Style+Wishbone+Dining+Chairs',
        imageUrl: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=400&q=80',
        description: 'Iconic curved backrest with hand-woven paper cord seat.',
        styleMatch: 'Mid-Century Modern'
      }
    ]
  }
];
