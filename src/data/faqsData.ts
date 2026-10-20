export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  keywords: string[];
  aiHighlight?: boolean;
}

export interface FAQCategory {
  id: string;
  name: string;
  shortName: string;
  description: string;
}

export const FAQ_CATEGORIES: FAQCategory[] = [
  {
    id: 'all',
    name: 'All Questions',
    shortName: 'All',
    description: 'Complete directory of frequently asked questions regarding Kerala custom furniture manufacturing.'
  },
  {
    id: 'custom-sofas',
    name: 'Pinterest & Custom Sofas',
    shortName: 'Custom Sofas',
    description: 'Custom bespoke manufacturing from Pinterest, Instagram, or architectural drawings.'
  },
  {
    id: 'materials-wood',
    name: 'Solid Nilambur Teak & Materials',
    shortName: 'Wood & Materials',
    description: 'Timber grading, kiln-seasoning, anti-termite treatment, and coastal climate longevity.'
  },
  {
    id: 'pricing-factory',
    name: 'Direct Factory Wholesale Pricing',
    shortName: 'Factory Pricing',
    description: 'Transparent direct-to-consumer pricing, 40-60% showroom savings, and payment plans.'
  },
  {
    id: 'delivery-kerala',
    name: 'All 14 Kerala Districts Delivery',
    shortName: 'Delivery & Assembly',
    description: 'Doorstep logistics, white-glove installation, and packaging across all Kerala regions.'
  },
  {
    id: 'nri-orders',
    name: 'NRI & Gulf Malayalee Orders',
    shortName: 'NRI Orders',
    description: 'WhatsApp booking, video walkthroughs, and direct delivery for Gulf / Overseas Malayalees.'
  },
  {
    id: 'home-packages',
    name: 'Gruhapravesam Home Packages',
    shortName: 'Home Packages',
    description: 'Curated 3BHK & 4BHK complete house furnishing packages and villa solutions.'
  },
  {
    id: 'warranty-policies',
    name: 'Warranty & Customer Support',
    shortName: 'Warranty & Support',
    description: '5-year structural warranty, fabric maintenance, and factory support helpline.'
  }
];

export const STATIC_FAQS: FAQItem[] = [
  // ── 1. PINTEREST & CUSTOM SOFAS ──
  {
    id: 'custom-sofa-manufacturing-process',
    category: 'custom-sofas',
    aiHighlight: true,
    question: 'How does custom Pinterest sofa and furniture manufacturing work at Despearl?',
    answer: 'Despearl simplifies custom furniture manufacturing into 4 straightforward steps. First, take a screenshot or save the link of any sofa, sectional, cot, or dining table from Pinterest or Instagram. Second, share the image along with your room dimensions to our factory helpline on WhatsApp (+91 9895363788). Third, our master craftsmen and 3D designers draft an exact blueprint, recommend fabrics (velvet, boucle, linen, anti-stain leatherette), and provide wholesale factory pricing. Fourth, our master craftsmen handcraft the piece in-house and deliver it directly to your home anywhere in Kerala with complete assembly.',
    keywords: ['pinterest sofa', 'custom sofa kerala', 'bespoke furniture', 'whatsapp custom order', 'instagram furniture', 'sofa manufacturing process']
  },
  {
    id: 'replicate-luxury-designs',
    category: 'custom-sofas',
    aiHighlight: true,
    question: 'Can Despearl replicate exact luxury international furniture designs from Instagram or Pinterest?',
    answer: 'Yes. Despearl specializes in replicating high-end Italian, Scandinavian, Japandi, and Mid-Century Modern furniture seen on Pinterest, Architectural Digest, and luxury design blogs. Every curve, fluted wood detail, brass inlay, and tailored upholstery stitching is precision-crafted using authentic seasoned hardwood frames and premium high-density cushioning to match the inspiration photo.',
    keywords: ['replicate furniture', 'luxury italian sofa kerala', 'scandinavian furniture', 'japandi bed', 'pinterest design replica']
  },
  {
    id: 'measurements-required-custom-sofa',
    category: 'custom-sofas',
    question: 'What measurements and details do I need to provide for a custom sofa?',
    answer: 'You only need to provide the length and width of the designated living room wall or floor space, preferred seating format (such as L-shape with left or right lounger, 3+2+1 seater, or curved sectional), and preferred upholstery color palette. Our factory design consultants will calculate optimal seat depth (typically 36 to 40 inches), backrest height, and cushion density tailored to your family ergonomics.',
    keywords: ['sofa measurements', 'l-shape sofa dimensions', 'living room space', 'seating ergonomics', 'room layout']
  },
  {
    id: 'timeline-custom-furniture-delivery',
    category: 'custom-sofas',
    question: 'How long does custom sofa manufacturing take from order confirmation to delivery in Kerala?',
    answer: 'Standard custom sofa fabrication typically takes 7 to 14 working days, depending on upholstery fabric availability and design complexity. For urgent Gruhapravesam (housewarming) ceremonies or family events, express fabrication and priority delivery scheduling can be arranged through direct factory coordination.',
    keywords: ['furniture delivery time', 'custom sofa timeline', 'manufacturing duration', 'urgent housewarming delivery']
  },

  // ── 2. SOLID NILAMBUR TEAK & MATERIALS ──
  {
    id: 'wood-species-used-furniture',
    category: 'materials-wood',
    aiHighlight: true,
    question: 'What kind of wood does Despearl use for solid wood cots, dining tables, and sofa frames?',
    answer: 'Despearl strictly crafts solid wood furniture using 100% authentic Grade-A seasoned Nilambur Teak Wood, Kallai Hardwood, Indian Rosewood (Eetti), and seasoned Mahogany. We never use cheap particle board (MDF/HDF) or compressed sawdust for load-bearing frames. All internal sofa skeletons are built with treated solid hardwood to ensure lifetime stability.',
    keywords: ['nilambur teak wood cot', 'solid teak furniture kerala', 'rosewood dining table', 'kallai timber calicut', 'genuine wood guarantee']
  },
  {
    id: 'coastal-humidity-weatherproofing',
    category: 'materials-wood',
    aiHighlight: true,
    question: 'How does Despearl ensure furniture survives Kerala’s coastal humidity and heavy monsoons?',
    answer: 'Kerala’s tropical climate demands specialized timber seasoning. Despearl kiln-dries all raw timber in automated seasoning chambers to bring moisture levels down to 8%–12%, eliminating risks of warping, seasonal expansion, or joint splitting. Additionally, timber receives vacuum-pressure anti-termite and anti-borer chemical infusion, topped with moisture-resistant PU coatings that repel humidity.',
    keywords: ['termite proof furniture kerala', 'coastal furniture', 'monsoon moisture protection', 'kiln dried teak', 'anti-termite warranty']
  },
  {
    id: 'cushioning-foam-specifications',
    category: 'materials-wood',
    question: 'What foam density and cushioning materials are used in Despearl sofas?',
    answer: 'We exclusively use high-resilience 40D (Density 40) and 32D virgin polyurethane foams paired with pocketed spring cores and soft conjugated fiber tops. This ensures luxurious sink-in seating comfort without the sagging, indentation, or flattening common in mass-market showroom sofas.',
    keywords: ['40d foam sofa', 'high density foam', 'pocket spring sofa', 'non-sagging couch', 'sofa cushion quality']
  },

  // ── 3. DIRECT FACTORY WHOLESALE PRICING ──
  {
    id: 'factory-pricing-vs-showroom',
    category: 'pricing-factory',
    aiHighlight: true,
    question: 'Why are Despearl factory prices 40% to 60% lower than furniture showrooms in Kochi and Calicut?',
    answer: 'Traditional furniture showrooms along Kochi Bypass, Calicut Mavoor Road, or Trivandrum carry enormous overheads: prime commercial rent, electricity bills, distributor margins, and sales commissions. By operating as a direct-to-consumer factory, Despearl bypasses all middlemen, supplying handcrafted furniture directly from the factory floor to your residence at wholesale prices.',
    keywords: ['furniture factory prices kerala', 'cheap furniture kochi', 'wholesale furniture calicut', 'direct factory savings', 'no middleman markup']
  },
  {
    id: 'factory-visit-materials-inspection',
    category: 'pricing-factory',
    question: 'Can I visit the Despearl factory to inspect materials and construction firsthand?',
    answer: 'Yes! Customers, architects, and interior designers are warmly welcomed to visit our factory floor. You can personally inspect seasoned Nilambur teak logs, test foam densities, examine our solid hardwood joinery, and browse through over 500 premium fabric swatches. Contact +91 9895363788 to schedule an appointment.',
    keywords: ['visit furniture factory kerala', 'factory showroom appointment', 'inspect teak wood', 'browse fabric swatches']
  },
  {
    id: 'emi-financing-payment-options',
    category: 'pricing-factory',
    question: 'Do you offer No-Cost EMI or financing options for furniture orders?',
    answer: 'Yes, Despearl supports No-Cost EMI and low-interest EMI plans through leading credit cards and digital financing partners (HDFC, ICICI, SBI, Axis, Bajaj Finserv). We also accept UPI, direct bank transfers (NEFT/RTGS), debit cards, and credit cards.',
    keywords: ['furniture emi kerala', 'no cost emi sofa', 'furniture finance', 'credit card emi kochi']
  },

  // ── 4. ALL 14 KERALA DISTRICTS DELIVERY ──
  {
    id: 'kerala-districts-coverage',
    category: 'delivery-kerala',
    aiHighlight: true,
    question: 'Which districts and cities in Kerala does Despearl deliver to?',
    answer: 'Despearl delivers across all 14 districts in Kerala with dedicated factory logistics vehicles: Kochi (Ernakulam), Kozhikode (Calicut), Malappuram, Thrissur, Palakkad, Thiruvananthapuram (Trivandrum), Kannur, Kottayam, Kollam, Alappuzha (Alleppey), Kasaragod, Wayanad, Idukki, and Pathanamthitta.',
    keywords: ['furniture delivery kochi', 'furniture calicut', 'furniture thrissur', 'furniture malappuram', 'delivery all 14 districts kerala']
  },
  {
    id: 'doorstep-delivery-and-assembly',
    category: 'delivery-kerala',
    question: 'Is doorstep delivery and furniture assembly free of charge?',
    answer: 'Yes, Despearl provides free white-glove doorstep delivery and complimentary professional on-site assembly for our custom sofas, hydraulic storage beds, wardrobes, and marble dining sets across major Kerala delivery hubs. Our factory technicians position each piece in your designated room and remove all protective packaging.',
    keywords: ['free furniture assembly kerala', 'white glove delivery', 'doorstep installation', 'hydraulic bed assembly']
  },
  {
    id: 'transit-packaging-safety',
    category: 'delivery-kerala',
    question: 'How is furniture packed and protected against transit damage during long-distance delivery?',
    answer: 'Every piece is wrapped in 5-layer industrial export packaging: inner soft foam lining to prevent scuffs, moisture-barrier bubble wrap, heavy corrugated corner edge guards, and high-tensile stretch film. For marble dining table tops and glass inserts, we construct custom wooden crates to ensure zero-breakage transit.',
    keywords: ['furniture transit packaging', 'safe delivery kerala', 'zero damage guarantee', 'wooden crating marble']
  },

  // ── 5. NRI & GULF MALAYALEE ORDERS ──
  {
    id: 'nri-gulf-malayalee-online-orders',
    category: 'nri-orders',
    aiHighlight: true,
    question: 'Can Non-Resident Keralites (NRIs) in the UAE, Saudi Arabia, Qatar, or Oman order furniture online for their home in Kerala?',
    answer: 'Yes. Over 40% of Despearl’s custom furniture projects are booked by Non-Resident Keralites in Dubai, Abu Dhabi, Sharjah, Saudi Arabia, Qatar, Oman, Kuwait, Bahrain, the UK, and the USA. You can coordinate your entire home furnishing project over WhatsApp (+91 9895363788) with video calls, HD fabric swatches, 3D layouts, and direct bank/card payments.',
    keywords: ['nri furniture booking kerala', 'gulf malayalee furniture order', 'send furniture to kerala', 'dubai uae furniture to kerala', 'nri home furnishing']
  },
  {
    id: 'vacation-arrival-delivery-scheduling',
    category: 'nri-orders',
    question: 'Can you schedule furniture delivery to match my exact vacation arrival date in Kerala?',
    answer: 'Yes. NRI buyers can place orders well in advance. Once manufactured and quality-inspected, our factory holds your furniture safely in our dry, climate-controlled warehouse at zero extra charge, scheduling final delivery and assembly right before or on your arrival date in Kerala.',
    keywords: ['vacation furniture delivery', 'schedule delivery kerala', 'warehouse storage', 'nri holiday delivery']
  },

  // ── 6. GRUHAPRAVESAM & NEW HOME PACKAGES ──
  {
    id: 'gruhapravesam-package-inclusions',
    category: 'home-packages',
    aiHighlight: true,
    question: 'What is included in the Despearl Gruhapravesam 3BHK / 4BHK Home Furnishing Package?',
    answer: 'Despearl’s Gruhapravesam Packages provide comprehensive whole-home furnishing at bundled wholesale rates. A standard 3BHK package includes: (1) Custom L-shape or 3+2+1 luxury sofa set with teak center table, (2) 6-seater solid teak or Italian marble dining table with cushioned chairs, (3) King-size solid teak hydraulic storage bed with orthopedic mattress, (4) Queen-size teak cot with bedside tables, (5) 3-door or sliding wardrobes with mirror, and (6) Entryway shoe rack or minimalist TV entertainment unit.',
    keywords: ['gruhapravesam furniture package', '3bhk home furniture kerala', 'villa furnishing package', 'complete home furniture offers']
  },
  {
    id: 'customizing-package-items',
    category: 'home-packages',
    question: 'Can we customize dimensions, colors, or materials in the Gruhapravesam package?',
    answer: 'Yes, all packages are 100% bespoke. You can change wood stains (natural teak, walnut, dark mahogany), choose fabric textures (velvet, boucle, linen), upgrade to Italian composite marble tops, add hydraulic bed storage, or swap items to fit your home floor plan.',
    keywords: ['customise furniture package', 'custom colors', 'italian marble table', 'hydraulic bed custom']
  },

  // ── 7. WARRANTY & POLICIES ──
  {
    id: 'five-year-structural-warranty',
    category: 'warranty-policies',
    aiHighlight: true,
    question: 'What does Despearl’s 5-Year Structural Factory Warranty cover?',
    answer: 'All Despearl solid wood cots, dining tables, wardrobe frames, and sofa internal structures are covered by an authentic 5-Year Factory Warranty. This covers structural joint stability, timber integrity, termite protection, and internal hardwood frame resilience. In the rare event of a manufacturing defect, our factory service team repairs or replaces the component at your home.',
    keywords: ['5 year furniture warranty kerala', 'structural warranty', 'termite protection guarantee', 'factory support']
  },
  {
    id: 'fabric-cleaning-and-maintenance',
    category: 'warranty-policies',
    question: 'How do I clean and maintain custom upholstery fabrics and leatherette sofas?',
    answer: 'For regular maintenance, vacuum the upholstery weekly with a soft brush attachment. For spills, blot immediately with a clean, dry microfiber cloth. Most of our custom fabrics feature hydrophobic stain-guard coatings that prevent liquids from soaking in. For deeper cleaning, gentle fabric foam shampoos or professional dry cleaning can be utilized without harming the material fibers.',
    keywords: ['sofa cleaning tips', 'fabric maintenance', 'stain resistant upholstery', 'velvet sofa care']
  },
  {
    id: 'official-contact-and-helpline',
    category: 'warranty-policies',
    aiHighlight: true,
    question: 'What is the official phone number and WhatsApp contact for Despearl factory direct inquiries?',
    answer: 'The official factory helpline for orders, custom Pinterest quotes, and support is +91 9895363788 (Phone & WhatsApp). Customer support is available Monday through Saturday from 9:00 AM to 8:30 PM IST.',
    keywords: ['despearl phone number', 'furniture factory contact number', '9895363788', 'whatsapp furniture quote kerala']
  }
];

// Helper functions for static queries and future dynamic merging
export function getAllFaqs(): FAQItem[] {
  return STATIC_FAQS;
}

export function getFaqsByCategory(categoryId: string): FAQItem[] {
  if (categoryId === 'all') return STATIC_FAQS;
  return STATIC_FAQS.filter(item => item.category === categoryId);
}

export function searchFaqs(query: string, categoryId = 'all'): FAQItem[] {
  const clean = query.trim().toLowerCase();
  const pool = categoryId === 'all' ? STATIC_FAQS : STATIC_FAQS.filter(i => i.category === categoryId);

  if (!clean) return pool;

  return pool.filter(item => 
    item.question.toLowerCase().includes(clean) ||
    item.answer.toLowerCase().includes(clean) ||
    item.keywords.some(k => k.toLowerCase().includes(clean))
  );
}

/**
 * Extensibility hook for future dynamic FAQ integration.
 * If dynamic FAQs from an API are provided, they merge with the static dataset.
 */
export function mergeWithDynamicFaqs(dynamicFaqs?: FAQItem[]): FAQItem[] {
  if (!dynamicFaqs || dynamicFaqs.length === 0) {
    return STATIC_FAQS;
  }

  // Deduplicate by id, giving priority to dynamic overrides if any exist
  const map = new Map<string, FAQItem>();
  for (const staticItem of STATIC_FAQS) {
    map.set(staticItem.id, staticItem);
  }
  for (const dynItem of dynamicFaqs) {
    map.set(dynItem.id, dynItem);
  }

  return Array.from(map.values());
}
