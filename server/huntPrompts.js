// Curated Walmart & Store Scavenger Hunt Deck for Couples
// Creative, hilarious, and engaging prompts designed to spark laughs, friendly rivalry, and date-night memories

const HUNT_PROMPTS = [
  {
    id: 'odd-flavor-combo',
    title: 'Unholy Flavor Combination',
    icon: '🍕',
    category: 'Food & Snacks',
    badge: 'Taste Test Risk',
    points: 150,
    description: 'Find a snack, drink, or condiment combining two flavors that have absolutely zero business being together.',
    hint: 'Check the chip aisle, exotic soda shelves, or weird seasonal candy stands (e.g., pickle cotton candy, Flamin Hot chocolate, watermelon Oreos).',
    verificationCriteria: 'Opposing partner must agree this flavor pairing is genuinely questionable or cursed.'
  },
  {
    id: 'misplaced-in-wild',
    title: 'Misplaced in the Wild',
    icon: '🛒',
    category: 'Store Curiosities',
    badge: 'A Decision Was Made',
    points: 120,
    description: 'Find an item abandoned in an aisle where it definitely does not belong. The more tragic or confusing the trade-off, the higher the points.',
    hint: 'Examples: A tub of ice cream melting in automotive, raw bacon in the shoe section, or a baby toy in party supplies.',
    verificationCriteria: 'Must be clearly out of place. Extra couple points if you can imagine the exact moment someone abandoned it.'
  },
  {
    id: 'who-approved-this',
    title: 'Who Approved This Design?',
    icon: '🤨',
    category: 'Design Blunders',
    badge: 'Cursed Object',
    points: 140,
    description: 'Find a plushie, toy, mug, or piece of decor with an unintentionally terrifying, derpy, or wildly inappropriate facial expression or design.',
    hint: 'Check the seasonal plush bin, cheap pet toys, or the novelty mug endcap.',
    verificationCriteria: 'Partner must visibly cringe or burst out laughing upon seeing the photo.'
  },
  {
    id: 'unhinged-clearance',
    title: 'Unhinged Clearance Find',
    icon: '🏷️',
    category: 'Bargains & Blunders',
    badge: 'Last Chance Disaster',
    points: 130,
    description: 'Find a clearance or rollback sticker on an item so odd, dusty, or battered that nobody on Earth has bought it.',
    hint: 'Look for yellow clearance tags buried at the bottom shelf or the weird back corner clearance aisle.',
    verificationCriteria: 'Clearance sticker or price tag must be visible in the photo.'
  },
  {
    id: 'funniest-knockoff',
    title: 'Shameless Brand Impersonator',
    icon: '🦹',
    category: 'Food & Goods',
    badge: 'Store Brand Audacity',
    points: 110,
    description: 'Find an off-brand, generic, or Great Value item that is desperately trying to fool people into thinking it is a famous name brand.',
    hint: 'Cereal aisle, generic cookies, knock-off perfumes, or tool sets.',
    verificationCriteria: 'Both players must instantly recognize what famous product it is mimicking.'
  },
  {
    id: 'worst-packaging-pun',
    title: 'Worst Pun On Packaging',
    icon: '🤦',
    category: 'Words & Wisdom',
    badge: 'Dad Joke Gold',
    points: 100,
    description: 'Find a product, greeting card, kitchen towel, or snack that features a groan-worthy, facepalm-inducing pun.',
    hint: 'Greeting cards, kitchen dish towels ("Lettuce celebrate!"), graphic oven mitts, or toddler clothing.',
    verificationCriteria: 'You must read the pun aloud in your mind and groan. Pun must be legible in photo.'
  },
  {
    id: 'hyper-specific-tee',
    title: 'Hyper-Specific Graphic Tee',
    icon: '👕',
    category: 'Fashion & Apparel',
    badge: 'Wardrobe Statement',
    points: 140,
    description: 'Find a graphic T-shirt or hoodie with an absurdly detailed, oddly aggressive, or strangely specific slogan.',
    hint: 'Men\'s or women\'s graphic tee racks (e.g. "Never underestimate an angry forklift driver born in July who loves tacos").',
    verificationCriteria: 'Slogan must be readable and genuinely unhinged.'
  },
  {
    id: 'accidental-art',
    title: 'Accidental Renaissance in Aisle 7',
    icon: '🎨',
    category: 'Aesthetic',
    badge: 'Museum Worthy',
    points: 120,
    description: 'Take an artistic photo of a store shelf, display pyramid, or chaotic shopping cart that looks like a dramatic classical painting or modern art piece.',
    hint: 'Produce displays, color-coded energy drink stacks, or fallen towers of paper towels.',
    verificationCriteria: 'Partner grades the photo on artistic composition and drama.'
  },
  {
    id: 'questionable-scent',
    title: 'Questionable Candle or Soap Scent',
    icon: '👃',
    category: 'Sensory Check',
    badge: 'Sniff Test',
    points: 110,
    description: 'Find a candle, air freshener, or body wash with a name that leaves you wondering what on Earth it actually smells like.',
    hint: 'Candle aisle or bath care (e.g., "Warm Flannel & Concrete", "Alien Amber", "Grandma\'s Attic Mystery").',
    verificationCriteria: 'Photo must clearly show the scent label.'
  },
  {
    id: 'why-is-this-one-dollar',
    title: 'The "$1 Mystery Object"',
    icon: '🪙',
    category: 'Bargains & Blunders',
    badge: 'Economic Wonder',
    points: 100,
    description: 'Find an item priced around $1 that defies all manufacturing logic. How did raw materials, assembly, shipping across the planet, and Walmart shelf space cost $1?',
    hint: 'The impulse check-out registers, dollar section bins, or party favor section.',
    verificationCriteria: 'Partner must confirm this is genuinely bewildering value or plastic nonsense.'
  },
  {
    id: 'comically-oversized-box',
    title: 'Oversized Box / 90% Air',
    icon: '📦',
    category: 'Packaging',
    badge: 'Air In A Box',
    points: 120,
    description: 'Find a product where the outer packaging is comically, unnecessarily gigantic compared to the tiny item inside.',
    hint: 'Electronics adapters, micro memory cards, cosmetics blister packs, or huge gift sets.',
    verificationCriteria: 'Photo must clearly capture the scale of box vs item.'
  },
  {
    id: 'partner-lookalike',
    title: 'Partner\'s Store Spirit Animal',
    icon: '🪞',
    category: 'Couples Special',
    badge: 'Love & Laughter',
    points: 200,
    description: 'Find an item, mascot, cartoon character, or product that playfully reminds you of your partner (their vibe, a running joke, or their exact mood right now).',
    hint: 'Plush toys, pet outfits, humorous greeting cards, or grumpy vegetable characters.',
    verificationCriteria: 'You must explain in your photo note why this is their spirit animal. Partner can approve or laugh-reject!'
  },
  {
    id: 'cursed-pillow-or-blanket',
    title: 'The Most Cursed Pillow or Blanket',
    icon: '🛋️',
    category: 'Home & Decor',
    badge: 'Nightmare Fuel',
    points: 130,
    description: 'Find a throw pillow, blanket, or rug with an unsettling texture, horrifying photorealistic animal face, or bizarre quote.',
    hint: 'Bedding aisle or seasonal home decor (e.g. sequin Nicholas Cage, giant burrito blanket, creepy pug pillow).',
    verificationCriteria: 'Must be an item you would definitely NOT want on your bed.'
  },
  {
    id: 'ridiculous-as-seen-on-tv',
    title: 'Ridiculous "As Seen On TV" Gadget',
    icon: '📺',
    category: 'Gadgets',
    badge: 'Infomercial Gold',
    points: 120,
    description: 'Find a product solving a problem that literally nobody has ever experienced in human history.',
    hint: 'Check the As Seen On TV endcap, kitchen gadget wall, or automotive accessories.',
    verificationCriteria: 'Photo must show the ridiculous promise on the box.'
  },
  {
    id: 'unfortunate-placement',
    title: 'Unfortunate Neighboring Products',
    icon: '👀',
    category: 'Store Curiosities',
    badge: 'Awkward Display',
    points: 140,
    description: 'Find two products placed side-by-side on the shelf that create a hilarious or questionable accidental message.',
    hint: 'Produce next to pharmacy, energy drinks next to sleeping pills, hot sauce next to antacids.',
    verificationCriteria: 'Both products and their accidental juxtaposition must be clearly visible in one frame.'
  },
  {
    id: 'ugliest-mug-in-store',
    title: 'Ugliest Coffee Mug',
    icon: '☕',
    category: 'Kitchen & Dining',
    badge: 'Morning Eye Sore',
    points: 110,
    description: 'Find the absolute ugliest, most unhinged, or poorly shaped coffee mug in the housewares section.',
    hint: 'Kitchen dishware aisle or novelty gifts (toilet mugs, giant paws, cringey slogans).',
    verificationCriteria: 'Partner must confirm they would be embarrassed to drink coffee out of this.'
  },
  {
    id: 'most-expensive-item',
    title: 'Flexing the High Roller Item',
    icon: '💎',
    category: 'Price Check',
    badge: 'Big Spender',
    points: 130,
    description: 'Find the single most expensive item in your vicinity and pose with it like you just bought it with your trust fund.',
    hint: 'Electronics locked cases (giant OLED TVs, high-end cameras), jewelry counter, or locked power tools.',
    verificationCriteria: 'Price tag or lockup case must be visible with your regal pose.'
  },
  {
    id: 'suspicious-meat-or-produce',
    title: 'Suspiciously Shaped Food',
    icon: '🥔',
    category: 'Food & Snacks',
    badge: 'Nature Did That',
    points: 150,
    description: 'Find a potato, carrot, fruit, or packaged meat that looks strangely like a person, animal, or something questionable.',
    hint: 'Produce bins (potatoes and carrots are notorious) or bakery shaped cookies.',
    verificationCriteria: 'Partner must agree on the uncanny resemblance.'
  },
  {
    id: 'pet-costume-dignity-loss',
    title: 'Pet Costume That Destroys Dignity',
    icon: '🐶',
    category: 'Pets & Animals',
    badge: 'Dog Shame',
    points: 120,
    description: 'Find a pet outfit or costume so humiliating that any self-respecting dog or cat would immediately disown their owner.',
    hint: 'Pet section seasonal costumes, hot dog outfits, pet tutus, or dinosaur hoodies.',
    verificationCriteria: 'Must be visibly embarrassing for any animal.'
  },
  {
    id: 'retro-time-capsule',
    title: 'The 2004 Time Capsule Item',
    icon: '📼',
    category: 'Vintage Vibes',
    badge: 'How Is This Still Here?',
    points: 140,
    description: 'Find an item that looks like it traveled in a time machine from the 1990s or 2000s and never left the shelf.',
    hint: 'Electronics DVD discount bin, hair accessories, CD jewel cases, or disposable cameras.',
    verificationCriteria: 'Item must exude pure nostalgia or forgotten tech vibes.'
  },
  {
    id: 'aggressive-hot-sauce',
    title: 'Aggressively Threatening Hot Sauce',
    icon: '🌶️',
    category: 'Food & Snacks',
    badge: 'Hospital Visit',
    points: 120,
    description: 'Find a hot sauce with a label that explicitly threatens your organs, soul, or afterlife (e.g., "Satan\'s Blood", "Ass Blaster 9000", "Widowmaker").',
    hint: 'Condiments and hot sauce section.',
    verificationCriteria: 'Threatening label and skull/fire artwork must be readable.'
  },
  {
    id: 'the-monstrous-snack',
    title: 'The Comically Huge Snack',
    icon: '🍿',
    category: 'Food & Snacks',
    badge: 'Bulk Life',
    points: 110,
    description: 'Find a bag of chips, tub of cheese balls, or jug of sauce that is so monstrously huge it could feed a small medieval village.',
    hint: 'Bulk chip displays, pickle gallons, or giant party size snack barrels.',
    verificationCriteria: 'Hold it up or pose next to it to prove the ridiculous scale.'
  },
  {
    id: 'most-cringe-greeting-card',
    title: 'Most Cringe Greeting Card',
    icon: '💌',
    category: 'Words & Wisdom',
    badge: 'Hallmark Regret',
    points: 110,
    description: 'Find a greeting card with a message, drawing, or audio song so painfully awkward nobody should ever receive it.',
    hint: 'The greeting cards aisle (anniversary, romantic, or humor sections).',
    verificationCriteria: 'Inside or front message must be legible in photo.'
  },
  {
    id: 'worst-baby-toy',
    title: 'Toy That Will Haunt Your Dreams',
    icon: '🤡',
    category: 'Toys & Games',
    badge: 'Nightmare Fuel',
    points: 130,
    description: 'Find a baby doll or toy that looks possessed, has dead staring eyes, or makes a creepy robotic sound.',
    hint: 'Doll aisle, clearance toy bin, or animatronic display toys.',
    verificationCriteria: 'Eyes and uncanny expression must be captured up close.'
  },
  {
    id: 'mystery-foreign-snack',
    title: 'The Exotic International Mystery Snack',
    icon: '🌏',
    category: 'Food & Snacks',
    badge: 'World Explorer',
    points: 120,
    description: 'Find an imported or international snack that neither of you has ever seen or tasted before.',
    hint: 'International / Hispanic / Asian food aisle or special seasonal import shelves.',
    verificationCriteria: 'Must be an item both partners agree is brand new to them.'
  },
  {
    id: 'overly-enthusiastic-mannequin',
    title: 'Mannequin Striking a Wild Pose',
    icon: '🕺',
    category: 'Fashion & Apparel',
    badge: 'Vogue Aisle',
    points: 130,
    description: 'Find a mannequin in the apparel section that is posing with way too much drama, weird posture, or creepy energy.',
    hint: 'Clothing department display platforms and athletic wear racks.',
    verificationCriteria: 'Take a photo mimicking the mannequin\'s exact pose!'
  },
  {
    id: 'inappropriate-kid-shirt',
    title: 'Questionable Kids Graphic Tee',
    icon: '👶',
    category: 'Fashion & Apparel',
    badge: 'Parenting Choice',
    points: 130,
    description: 'Find a children\'s or toddler\'s shirt with a slogan that sounds weirdly mature, sassy, or completely out of touch for a 5-year-old.',
    hint: 'Toddler and youth boys/girls clothing racks ("Ladies Man", "I do my own stunts").',
    verificationCriteria: 'Shirt text must be readable in photo.'
  },
  {
    id: 'giant-stuffed-animal',
    title: 'Absurdly Huge Stuffed Animal',
    icon: '🧸',
    category: 'Toys & Games',
    badge: 'Giant Friend',
    points: 120,
    description: 'Find a plushie or stuffed creature that is at least half your body size and give it a dramatic hug.',
    hint: 'Seasonal holiday section, Valentine\'s/Easter aisle, or top shelf of toy department.',
    verificationCriteria: 'Photo must show you hugging or wrestling the giant creature.'
  },
  {
    id: 'fake-food-decor',
    title: 'Deceptive Fake Food Decor',
    icon: '🍇',
    category: 'Home & Decor',
    badge: 'Forbidden Snack',
    points: 110,
    description: 'Find artificial fruit, fake plants, or kitchen decor that looks just realistic enough that an unsuspecting toddler might take a bite.',
    hint: 'Craft section, home decor, or artificial floral department.',
    verificationCriteria: 'Must be realistic plastic or wax fake food.'
  },
  {
    id: 'who-buys-this-tool',
    title: 'Hyper-Niche Tool or Hardware Gadget',
    icon: '🔧',
    category: 'Hardware & Auto',
    badge: 'Bob the Builder',
    points: 130,
    description: 'Find a tool or automotive accessory so specific or bizarre that you have no idea what it could possibly be used for.',
    hint: 'Hardware aisle, plumbing fittings, or automotive repair tools.',
    verificationCriteria: 'Partner must attempt to guess what it does based on your photo!'
  },
  {
    id: 'budget-date-night-special',
    title: 'The $3 Date Night Meal',
    icon: '🍜',
    category: 'Couples Special',
    badge: 'Culinary Masterpiece',
    points: 150,
    description: 'Assemble two items together on a shelf that would make the most chaotic, depressing, or hilarious $3 date night dinner.',
    hint: 'Canned fish, instant noodles, budget dessert pies, energy drinks.',
    verificationCriteria: 'Photo must show the two items side-by-side with your menu pitch in the caption!'
  },
  {
    id: 'energy-drink-heart-stopper',
    title: 'The Heart-Attack Energy Drink',
    icon: '⚡',
    category: 'Food & Snacks',
    badge: 'Liquid Voltage',
    points: 120,
    description: 'Find an energy drink with 300mg+ caffeine or named like a chemical weapon (e.g., "Bang", "C4 Nuclear Bomb", "Reign Inferno").',
    hint: 'Refrigerated drinks or energy supplement coolers near checkouts.',
    verificationCriteria: 'Can name and aggressive warning label must be legible.'
  },
  {
    id: 'unfortunate-typo',
    title: 'Packaging Typo or Translation Glitch',
    icon: '🔤',
    category: 'Store Curiosities',
    badge: 'Proofreader Needed',
    points: 160,
    description: 'Find an item or store sign with an obvious grammatical mistake, hilarious typo, or mangled translation.',
    hint: 'Cheap imported goods, budget phone cases, or clearance shelf hand-written tags.',
    verificationCriteria: 'The typo or translation fail must be clearly visible.'
  },
  {
    id: 'apocalyptic-survival-gear',
    title: 'Impending Apocalypse Gear',
    icon: '🏕️',
    category: 'Outdoors & Sporting',
    badge: 'Prepper Mode',
    points: 130,
    description: 'Find an item in camping, hunting, or hardware that looks like it belongs in The Walking Dead or a zombie bunker.',
    hint: 'Machetes, freeze-dried ration buckets, solar radios, or tactical shovels.',
    verificationCriteria: 'Photo must show the survival tool with you looking grim.'
  },
  {
    id: 'spark-walmart-pride',
    title: 'Unapologetic Walmart Swag',
    icon: '✨',
    category: 'Store Curiosities',
    badge: 'Rollback Royalty',
    points: 140,
    description: 'Find an item featuring the official Walmart Spark logo or blue store branding meant for super-fans.',
    hint: 'Walmart branded cooler bags, employee style vests, novelty keychains, or apparel.',
    verificationCriteria: 'Must have the Walmart spark or store logo clearly in frame.'
  }
];

module.exports = {
  HUNT_PROMPTS
};
