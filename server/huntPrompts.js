// Curated Scavenger Hunt Decks for Couples
// Multiple themed adventures designed to spark laughter, friendly rivalry, and unforgettable dates

const THEMES = {
  supermarket: {
    id: 'supermarket',
    name: 'Supermarket & Grocery',
    shortName: 'Grocery Run',
    subtitle: 'Walmart, Target & Supermarket Shenanigans',
    icon: '🛒',
    accentColor: 'from-blue-600 to-indigo-600',
    badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    description: 'Unholy flavor combinations, cursed clearance items, bizarre knock-offs, and accidental aisle renaissance.',
    prompts: [
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
    ]
  },

  city: {
    id: 'city',
    name: 'City & Downtown Stroll',
    shortName: 'City Stroll',
    subtitle: 'Urban Date, Main Street & Hidden Corners',
    icon: '🏙️',
    accentColor: 'from-amber-500 to-orange-600',
    badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    description: 'Chalkboard coffee puns, street performers, historic plaques, weird statues, optical illusions, and hidden alley art.',
    prompts: [
      {
        id: 'chalkboard-pun',
        title: 'Chalkboard Cafe Pun or Dad Joke',
        icon: '☕',
        category: 'Urban Sights',
        badge: 'Caffeine Comedy',
        points: 120,
        description: 'Find a sidewalk chalkboard outside a cafe, bar, or boutique boasting a groan-worthy pun or witty quote.',
        hint: 'Coffee shops ("Espresso yourself"), bakeries ("Donut give up"), or cocktail bars.',
        verificationCriteria: 'Chalkboard must be handwritten and legible in photo.'
      },
      {
        id: 'weird-public-statue',
        title: 'Perplexing Public Art / Statue',
        icon: '🗿',
        category: 'Culture & Art',
        badge: 'What Is It?',
        points: 130,
        description: 'Find a public statue, bronze sculpture, or modern art installation that makes you say: "Who authorized this?"',
        hint: 'City plazas, municipal buildings, park fountains, or university corners.',
        verificationCriteria: 'Must be an outdoor sculpture with an undeniably eccentric vibe.'
      },
      {
        id: 'historic-plaque-drama',
        title: 'Historical Plaque That Escalated Quickly',
        icon: '📜',
        category: 'History & Lore',
        badge: 'Town Drama',
        points: 140,
        description: 'Find an official bronze historical plaque or building marker describing an absurd, intense, or strangely specific 1800s event.',
        hint: 'Attached to brick walls of historic buildings, cornerstones, or cemetery markers.',
        verificationCriteria: 'Plaque text must be readable in photo.'
      },
      {
        id: 'most-dramatic-doggo',
        title: 'Most Dramatic Dog on a Leash',
        icon: '🐕',
        category: 'Local Wildlife',
        badge: 'Urban Pupper',
        points: 150,
        description: 'Snap a respectful photo of a dog strutting downtown with maximum attitude, a stylish coat, booties, or a tiny stroller.',
        hint: 'Outdoor cafes, pedestrian walks, or sidewalk crosswalks.',
        verificationCriteria: 'Dog must look iconic or hilarious (no faces of owners necessary).'
      },
      {
        id: 'punny-storefront-name',
        title: 'Shameless Business Name Pun',
        icon: '💈',
        category: 'Urban Sights',
        badge: 'Branding Genius',
        points: 130,
        description: 'Find a local business whose name is an aggressive pun.',
        hint: 'Hair salons ("Curl Up & Dye"), dog groomers ("Barking Lot"), flower shops ("Florist Gump"), or food trucks.',
        verificationCriteria: 'Storefront signage must be clear.'
      },
      {
        id: 'street-mural-pose',
        title: 'Street Art Model Shoot',
        icon: '🎨',
        category: 'Aesthetic',
        badge: 'Vogue Street',
        points: 160,
        description: 'Find a vibrant outdoor painted mural or graffiti wall and pose like an album cover artist.',
        hint: 'Side alleys, brick building flanks, or arts district streets.',
        verificationCriteria: 'Photo must show partner striking a dramatic pose integrated with the art.'
      },
      {
        id: 'architectural-glitch',
        title: 'Architectural Glitch / Door to Nowhere',
        icon: '🚪',
        category: 'Curiosities',
        badge: 'Matrix Malfunction',
        points: 140,
        description: 'Find a staircase leading directly into a brick wall, a door on the second floor with no balcony, or an absurdly misplaced window.',
        hint: 'Older brick buildings, alleyways, or renovated downtown facades.',
        verificationCriteria: 'Must be a genuine architectural mystery.'
      },
      {
        id: 'street-musician-moment',
        title: 'Live Street Performer Vibe',
        icon: '🎷',
        category: 'Entertainment',
        badge: 'City Rhythm',
        points: 150,
        description: 'Find a busker or street performer bringing live music or performance art to the sidewalk.',
        hint: 'Near transit stops, busy pedestrian squares, or market pavilions.',
        verificationCriteria: 'Photo must capture the performer with instrument or performance setup.'
      },
      {
        id: 'overly-specific-city-sign',
        title: 'Overly Specific Warning Sign',
        icon: '⚠️',
        category: 'Signs & Laws',
        badge: 'A Law Was Written',
        points: 120,
        description: 'Find a municipal or business sign forbidding something so specific that somebody must have caused chaos here in the past.',
        hint: 'Parks, parking garages, alley dumpsters ("No juggling flaming torches", "No sleeping on the fountain lion").',
        verificationCriteria: 'Sign warning must be clearly readable.'
      },
      {
        id: 'secret-alley-gem',
        title: 'The Hidden Alley Oasis',
        icon: '🌿',
        category: 'Hidden Spots',
        badge: 'Urban Explorer',
        points: 140,
        description: 'Discover a charming, narrow cobblestone alley or courtyard featuring string lights, cafe tables, or hanging flower baskets.',
        hint: 'Tucked between historic retail blocks or behind main boulevard restaurants.',
        verificationCriteria: 'Partner must confirm it looks like a European romantic movie scene.'
      },
      {
        id: 'ridiculous-luxury-window',
        title: 'Boutique Price Tag Shock',
        icon: '👠',
        category: 'High Society',
        badge: 'One Percenter',
        points: 130,
        description: 'Find a window display featuring an item with a price tag so wildly high it breaks your brain (e.g. $600 linen bag, $400 umbrella).',
        hint: 'High-end downtown designer boutiques, art galleries, or jewelry stores.',
        verificationCriteria: 'Price tag or luxury display item clearly showcased.'
      },
      {
        id: 'cursed-bumper-sticker',
        title: 'Unhinged Bumper Sticker / Vanity Plate',
        icon: '🚗',
        category: 'Urban Sights',
        badge: 'Road Rage Poet',
        points: 120,
        description: 'Find a parked car with a bumper sticker or vanity plate featuring a completely baffling, philosophical, or aggressive message.',
        hint: 'Street parking along main street or public lots.',
        verificationCriteria: 'Text must be readable and approved by partner as properly unhinged.'
      },
      {
        id: 'pigeon-council-meeting',
        title: 'Suspicious Pigeon / Crow Gathering',
        icon: '🕊️',
        category: 'Local Wildlife',
        badge: 'Bird Mafia',
        points: 110,
        description: 'Photograph a group of birds gathered together looking like they are plotting a heist or city takeover.',
        hint: 'Roof ledges, outdoor park benches, statue heads, or around crumb-heavy bakery patios.',
        verificationCriteria: 'Birds must look organized and suspicious.'
      },
      {
        id: 'fairy-door-or-mini-art',
        title: 'Micro Street Art / Fairy Door',
        icon: '🧚',
        category: 'Hidden Spots',
        badge: 'Tiny Magic',
        points: 160,
        description: 'Find a miniature painted door at the base of a brick wall, miniature street art, or tiny figurine hidden in plain sight.',
        hint: 'Baseboards of old lampposts, tree roots, or brick joints.',
        verificationCriteria: 'Must be a tiny hidden easter egg in the streetscape.'
      },
      {
        id: 'vintage-neon-sign',
        title: 'Retro Glowing Neon Sign',
        icon: '💡',
        category: 'Vintage Vibes',
        badge: 'Midnight Glow',
        points: 110,
        description: 'Find an old-school real neon gas tube sign buzzing over a theater, diner, bowling alley, or cocktail lounge.',
        hint: 'Look up along old downtown building marquees.',
        verificationCriteria: 'Neon glow and vintage lettering clearly visible.'
      },
      {
        id: 'bookstore-window-gem',
        title: 'Funniest Book Title in Shop Window',
        icon: '📚',
        category: 'Words & Wisdom',
        badge: 'Literary Wit',
        points: 120,
        description: 'Find a bookstore or library window displaying a book with a bizarre, hilariously morbid, or spicy title.',
        hint: 'Independent bookstores, comic shops, or antique book peddlers.',
        verificationCriteria: 'Book cover and title legible in photo.'
      },
      {
        id: 'iconic-crosswalk-strut',
        title: 'The Abbey Road Strut',
        icon: '🚶',
        category: 'Couples Special',
        badge: 'Beatles Energy',
        points: 170,
        description: 'Take a cinematic photo of your partner safely crossing a distinctive brick or painted pedestrian crosswalk like a rockstar.',
        hint: 'Safe, pedestrian-only plazas or quiet mid-block crosswalks (always yield to traffic!).',
        verificationCriteria: 'Partner mid-stride with movie-poster energy.'
      },
      {
        id: 'food-truck-pun-dish',
        title: 'Food Truck Menu Wordplay',
        icon: '🌮',
        category: 'Food & Drinks',
        badge: 'Culinary Pun',
        points: 120,
        description: 'Find a food truck with a funny pun on its truck wrap or a dish named after a celebrity/movie.',
        hint: 'Food truck plazas, brewery parking lots, or downtown park perimeters.',
        verificationCriteria: 'Truck name or menu item photo clearly showing the joke.'
      },
      {
        id: 'quirky-bicycle-setup',
        title: 'Extremely Quirky Bicycle',
        icon: '🚲',
        category: 'Curiosities',
        badge: 'Two-Wheeled Character',
        points: 130,
        description: 'Find a bicycle locked up that has a wicker basket with flowers, a coffee cup holder, animal horn, banana seat, or neon paint job.',
        hint: 'Bike racks near cafes, campuses, or transit stations.',
        verificationCriteria: 'Bicycle uniqueness must be evident.'
      },
      {
        id: 'mimic-city-mascot',
        title: 'Mimic the City Landmark Pose',
        icon: '🎭',
        category: 'Couples Special',
        badge: 'Living Statue',
        points: 180,
        description: 'Find a notable town monument, carved animal, or gargoyle, and take a photo matching its facial expression and body angle perfectly.',
        hint: 'Historic courthouse, fountain lion, or bronze founder statue.',
        verificationCriteria: 'Partner must rate the impersonation accuracy at least 8/10.'
      },
      {
        id: 'gargoyle-rooftop-scout',
        title: 'Roofline Gargoyle / Stone Creature',
        icon: '🦇',
        category: 'Culture & Art',
        badge: 'Gothic Guardian',
        points: 140,
        description: 'Look high above the street to spot a stone gargoyle, carved eagle, or decorative beast watching over the street.',
        hint: 'Rooflines of old churches, banks, or Victorian brick buildings.',
        verificationCriteria: 'Carved creature must be clearly focused in frame.'
      },
      {
        id: 'vintage-phone-booth-mailbox',
        title: 'Vintage Relic Still Standing',
        icon: '📮',
        category: 'History & Lore',
        badge: 'Living Fossil',
        points: 130,
        description: 'Find an old blue USPS cast-iron drop box, a rotary payphone enclosure, or a historic cast iron fire alarm pull station.',
        hint: 'Outside post offices, train stations, or historic corners.',
        verificationCriteria: 'Must be an authentic mechanical street fixture from pre-smartphone days.'
      },
      {
        id: 'cast-iron-manhole-art',
        title: 'Intricate Street Medallion / Manhole Cover',
        icon: '🪙',
        category: 'Urban Sights',
        badge: 'Ground Art',
        points: 120,
        description: 'Find a cast-iron manhole cover, water meter cover, or brass survey marker with elaborate vintage scrollwork, city crest, or year.',
        hint: 'Crosswalks, historic brick alleys, or sidewalk corners.',
        verificationCriteria: 'Intricate metal patterns or historic city inscription visible.'
      },
      {
        id: 'bakery-window-drool',
        title: 'The Irresistible Bakery Window Showstopper',
        icon: '🥐',
        category: 'Food & Drinks',
        badge: 'Sweet Tooth Trap',
        points: 130,
        description: 'Find the single most decadent, towering, powdered-sugar-dusted pastry or cake displayed in a shop window.',
        hint: 'Artisan bakeries, French pastry cafes, or donut shops.',
        verificationCriteria: 'Photo looking through glass at the pastry with partner looking longingly.'
      },
      {
        id: 'bistro-string-light-romance',
        title: 'Bistro String Lights Romance',
        icon: '✨',
        category: 'Aesthetic',
        badge: 'Date Night Glow',
        points: 150,
        description: 'Snap a romantic photo under hanging Edison bulbs or glowing bistro patio lights.',
        hint: 'Outdoor dining parklets, brewery courtyards, or town square awnings.',
        verificationCriteria: 'Glowing fairy lights and couple charm captured.'
      },
      {
        id: 'hydrant-dog-monument',
        title: 'Fire Hydrant with Personality',
        icon: '🚒',
        category: 'Curiosities',
        badge: 'Painted Iron',
        points: 120,
        description: 'Find a vintage fire hydrant painted in custom colors, with funny eyes, or looking like a squat little robot.',
        hint: 'Neighborhood street corners or historic main street curb cuts.',
        verificationCriteria: 'Hydrant details and character clear in photo.'
      },
      {
        id: 'rooftop-weather-vane',
        title: 'Rooftop Silhouette / Weather Vane',
        icon: '🧭',
        category: 'Culture & Art',
        badge: 'Sky Watch',
        points: 140,
        description: 'Look toward the sky to spot a rooster, ship, or arrow weather vane spinning above a rooftop cupola.',
        hint: 'Victorian houses, church steeples, or historic town halls.',
        verificationCriteria: 'Weather vane silhouette clearly focused against the sky.'
      },
      {
        id: 'coffee-cup-graveyard',
        title: 'Accidental Coffee Cup Pyramid',
        icon: '🥤',
        category: 'Curiosities',
        badge: 'Caffeine Overdose',
        points: 120,
        description: 'Find a display or trash-can rim where multiple people carefully stacked empty iced coffee cups into a precarious tower.',
        hint: 'Outside busy independent cafes or park bench bins.',
        verificationCriteria: 'Tower must be precariously balanced.'
      }
    ]
  },

  nature: {
    id: 'nature',
    name: 'Nature & Park Trail',
    shortName: 'Nature Trail',
    subtitle: 'Hiking, Parks, Creeks & Outdoor Escapes',
    icon: '🌲',
    accentColor: 'from-emerald-600 to-teal-700',
    badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    description: 'Heart-shaped rocks, suspicious mushrooms, majestic trees, wildlife encounters, scenic vistas, and trail treasures.',
    prompts: [
      {
        id: 'heart-shaped-rock-or-leaf',
        title: 'Nature\'s Love Token',
        icon: '💚',
        category: 'Couples Special',
        badge: 'Romance in the Wild',
        points: 170,
        description: 'Find a natural rock, fallen leaf, or patch of moss that is unmistakably shaped like a heart.',
        hint: 'River gravel beds, trail soil, or deciduous trees with heart-shaped foliage (redbud, ivy).',
        verificationCriteria: 'Heart shape must be natural and not carved by a pocket knife!'
      },
      {
        id: 'suspicious-mushroom',
        title: 'The Most Suspicious Mushroom',
        icon: '🍄',
        category: 'Flora & Fungi',
        badge: 'Potion Ingredient',
        points: 140,
        description: 'Find a wild mushroom or shelf fungus that looks like it will either grant you magic powers or send you straight to the underworld.',
        hint: 'Fallen damp logs, tree stumps, and shady moss patches. (Look, don\'t touch/eat!).',
        verificationCriteria: 'Mushroom texture and cap must be crisp in photo.'
      },
      {
        id: 'tree-with-face-or-arms',
        title: 'The "Ent" Tree / Nature Has Eyes',
        icon: '🪵',
        category: 'Trees & Timber',
        badge: 'Living Wood',
        points: 130,
        description: 'Find a tree with knots, burls, or branches that look like a human face, reaching arms, or a mythical forest creature.',
        hint: 'Old growth oak, cedar, or willow trees along bends in the trail.',
        verificationCriteria: 'Partner must immediately recognize the facial features or pose.'
      },
      {
        id: 'perfect-hiking-stick',
        title: 'The Legendary Wizard Walking Staff',
        icon: '🪄',
        category: 'Trail Gear',
        badge: 'Gandalf Approved',
        points: 120,
        description: 'Find a fallen branch that is the ideal height, weight, and ergonomic grip for a legendary hiking staff. Pose majestically with it.',
        hint: 'Fallen hardwood branches along the trail edges. Leave it on the trail when finished.',
        verificationCriteria: 'Partner evaluates your staff based on height, balance, and wizardly presence.'
      },
      {
        id: 'wildlife-in-action',
        title: 'Live Wildlife Sighting',
        icon: '🐿️',
        category: 'Fauna',
        badge: 'National Geographic',
        points: 160,
        description: 'Photograph a wild creature going about its day: squirrel, bird, chipmunk, deer, turtle, frog, or dragonfly.',
        hint: 'Near water edges, tree branches, or sun-drenched rocks. Keep a respectful distance.',
        verificationCriteria: 'The creature must be clearly visible and wild (no domestic dogs/cats!).'
      },
      {
        id: 'animal-footprint-clue',
        title: 'Mystery Animal Tracks in Mud',
        icon: '🐾',
        category: 'Tracking',
        badge: 'Wildlife Detective',
        points: 130,
        description: 'Find clear animal paw prints, hoof prints, or bird tracks pressed into damp mud or sand.',
        hint: 'Creek crossings, muddy puddles along trail paths, or sandy banks.',
        verificationCriteria: 'Print must have visible claw/toe/hoof indentations.'
      },
      {
        id: 'mini-waterfall-or-rapids',
        title: 'Miniature Waterfall or Babbling Brook',
        icon: '💧',
        category: 'Waterscapes',
        badge: 'Zen Flow',
        points: 130,
        description: 'Find a flowing creek cascade, natural pebble dam, or scenic waterfall ledge.',
        hint: 'Follow the sound of trickling water along low valley paths.',
        verificationCriteria: 'Photo must capture flowing water with natural drama.'
      },
      {
        id: 'emerald-moss-blanket',
        title: 'The Most Luxurious Velvet Moss',
        icon: '🪨',
        category: 'Flora & Fungi',
        badge: 'Forest Carpet',
        points: 110,
        description: 'Find an old boulder or log completely covered in vibrant, thick, neon-green moss that looks like a plush couch cushion.',
        hint: 'North-facing rocks in damp ravines or beside shaded streams.',
        verificationCriteria: 'Close-up photo capturing the fluffy texture.'
      },
      {
        id: 'giant-pinecone-or-seedpod',
        title: 'Comically Oversized Pinecone / Acorn',
        icon: '🌰',
        category: 'Trail Curiosities',
        badge: 'Forest Bounty',
        points: 110,
        description: 'Find a pinecone, seedpod, or acorn that looks abnormally huge compared to your hand.',
        hint: 'Beneath pine or spruce groves, or under mature oak trees.',
        verificationCriteria: 'Hold it in palm of hand to show honest scale.'
      },
      {
        id: 'scenic-couple-vista',
        title: 'The Cinematic Nature Romance Shot',
        icon: '📸',
        category: 'Couples Special',
        badge: 'Vibe Level 100',
        points: 190,
        description: 'Take a stunning couple selfie or scenic portrait with trees, lake, hills, or sunlight filtering through the canopy.',
        hint: 'Scenic overlook, clearing with golden hour light, or footbridge.',
        verificationCriteria: 'Both partners must look fabulous or genuinely adventurous.'
      },
      {
        id: 'nature-reclaims-civilization',
        title: 'Nature Reclaiming Civilization',
        icon: '🏚️',
        category: 'Wild & Free',
        badge: 'Post-Apocalypse Garden',
        points: 140,
        description: 'Find a rusted fence, forgotten stone wall, or old sign that trees and vines have completely swallowed or grown through.',
        hint: 'Perimeter borders of older parks or abandoned homestead foundations.',
        verificationCriteria: 'Tree or vine visibly fused around manmade metal or stone.'
      },
      {
        id: 'cloud-formation-shape',
        title: 'The Cloud With An Identity',
        icon: '☁️',
        category: 'Skywatch',
        badge: 'Cloud Whisperer',
        points: 120,
        description: 'Find a cloud in the open sky that unmistakably resembles an animal, food, face, or object.',
        hint: 'Look up during clearings or trail openings.',
        verificationCriteria: 'Partner must confirm they see what you claimed it looks like.'
      },
      {
        id: 'dew-covered-spiderweb',
        title: 'Spiderweb Architectural Marvel',
        icon: '🕸️',
        category: 'Creepy Crawlies',
        badge: 'Master Weaver',
        points: 130,
        description: 'Find an intact geometric spiderweb glistening with droplets, dust, or caught in sunlight.',
        hint: 'Between tree branches, under wooden handrails, or between tall trail grasses.',
        verificationCriteria: 'Spiral web pattern clearly visible without destroying it.'
      },
      {
        id: 'ancient-monolithic-boulder',
        title: 'Monolithic Boulder Climb',
        icon: '🧗',
        category: 'Geology',
        badge: 'King of the Rock',
        points: 140,
        description: 'Find a giant boulder dropped by an ancient glacier or cliff, and stand next to or atop it like the ruler of the forest.',
        hint: 'Rocky slopes, moraines, or creek beds.',
        verificationCriteria: 'Photo must show partner relative to the massive stone.'
      },
      {
        id: 'rare-wildflower-splash',
        title: 'Burst of Wildflower Color',
        icon: '🌸',
        category: 'Flora & Fungi',
        badge: 'Nature Bloom',
        points: 120,
        description: 'Find a bright, delicate wild flower growing on the forest floor or protruding from a rock crevice.',
        hint: 'Sunlit patches along the trail. Do not pick it!',
        verificationCriteria: 'Vibrant petals and natural setting in focus.'
      },
      {
        id: 'rustic-wooden-footbridge',
        title: 'The Fairy Tale Wooden Footbridge',
        icon: '🌉',
        category: 'Trail Sights',
        badge: 'Troll Bridge',
        points: 120,
        description: 'Cross a rustic wooden footbridge over a creek or marsh and snap a photo looking down the path.',
        hint: 'Trail wet crossings, boardwalks over swamps, or scenic ravines.',
        verificationCriteria: 'Bridge architecture and peaceful trail visible.'
      },
      {
        id: 'bird-feather-treasure',
        title: 'Fallen Bird Feather Treasure',
        icon: '🪶',
        category: 'Tracking',
        badge: 'Sky Gift',
        points: 130,
        description: 'Find a shed feather resting along the path (jay, hawk, turkey, woodpecker, or waterfowl).',
        hint: 'Near brush thickets, pond edges, or tree bases. Snap a photo without disturbing it.',
        verificationCriteria: 'Feather markings and natural resting spot clearly shown.'
      },
      {
        id: 'geometric-fractal-plant',
        title: 'Nature\'s Sacred Geometry',
        icon: '🌀',
        category: 'Aesthetic',
        badge: 'Math In The Wild',
        points: 140,
        description: 'Find a fern frond unfolding, spiral pinecone bracts, or a plant with hypnotically perfect symmetry.',
        hint: 'Unfurling fiddlehead ferns, succulent leaves, or concentric tree rings.',
        verificationCriteria: 'Close up must display clear mathematical rhythm.'
      },
      {
        id: 'tree-hugging-embrace',
        title: 'Unapologetic Tree Hugger',
        icon: '🫂',
        category: 'Couples Special',
        badge: 'Bark Lover',
        points: 150,
        description: 'Wrap your arms around the widest trunk you can find and press your ear to the bark to "listen to its ancient wisdom".',
        hint: 'Oldest, tallest oak, pine, or cottonwood in the grove.',
        verificationCriteria: 'Photo must show full dramatic embrace and peaceful expression.'
      },
      {
        id: 'natural-tree-archway',
        title: 'The Enchanted Portal Arch',
        icon: '⛩️',
        category: 'Trail Sights',
        badge: 'Narnia Gateway',
        points: 150,
        description: 'Find two trees bent toward each other or a fallen trunk that forms a natural arched doorway over the trail.',
        hint: 'Older trails where saplings grew together or trees bent under past winter snow.',
        verificationCriteria: 'Must look like a magical doorway into another realm.'
      },
      {
        id: 'sunbeam-god-rays',
        title: 'Canopy Sunbeams / God Rays',
        icon: '☀️',
        category: 'Aesthetic',
        badge: 'Divine Light',
        points: 150,
        description: 'Capture beams of sunlight breaking through mist, dust, or tree leaves like a heavenly painting.',
        hint: 'Look toward the sun through thick evergreen or deciduous branches in morning or late afternoon.',
        verificationCriteria: 'Sunbeams or light rays clearly visible streaming through leaves.'
      },
      {
        id: 'twisted-vine-swing',
        title: 'Tarzan Vine or Wisteria Ropes',
        icon: '🌿',
        category: 'Trees & Timber',
        badge: 'Jungle Explorer',
        points: 130,
        description: 'Find a thick wild vine hanging down from a high canopy branch that looks like a natural jungle swing.',
        hint: 'River valleys or dense forest edges with mature wild grapevines.',
        verificationCriteria: 'Hold onto vine like a wilderness adventurer.'
      },
      {
        id: 'flat-skipping-stone',
        title: 'The World-Champion Skipping Stone',
        icon: '🪨',
        category: 'Waterscapes',
        badge: 'Hydrodynamics',
        points: 120,
        description: 'Find the absolute flattest, smoothest, most aerodynamic river pebble possible and balance it on your finger.',
        hint: 'Creek gravel banks, lake shores, or dry riverbeds.',
        verificationCriteria: 'Partner tests pebble flatness and disc shape.'
      },
      {
        id: 'woodpecker-timber-holes',
        title: 'Woodpecker Construction Site',
        icon: '🪵',
        category: 'Fauna',
        badge: 'Jackhammer Bird',
        points: 130,
        description: 'Find a dead tree trunk decorated with fresh, geometric chisel holes made by a busy woodpecker.',
        hint: 'Standing dead timber or tall barkless trunks.',
        verificationCriteria: 'Distinct bird-drilled hollows clearly in frame.'
      },
      {
        id: 'hollow-tree-stump-hideout',
        title: 'The Gnome Hollow Tree Trunk',
        icon: '🌳',
        category: 'Trees & Timber',
        badge: 'Secret Hollow',
        points: 140,
        description: 'Find a hollowed-out tree stump or trunk base large enough for a forest creature or your hand/foot.',
        hint: 'Old burnt stumps or decaying ancient cedar/oak trunks.',
        verificationCriteria: 'Hollow depth and mysterious dark interior visible.'
      },
      {
        id: 'concentric-tree-rings',
        title: 'Tree Ring Time Machine',
        icon: '🕰️',
        category: 'Trail Curiosities',
        badge: 'Dendrochronology',
        points: 130,
        description: 'Find a cut log or stump where you can clearly see the circular annual growth rings.',
        hint: 'Trail maintenance log cuts or forestry clearing stumps.',
        verificationCriteria: 'Count at least 15 visible rings in your photo caption.'
      },
      {
        id: 'reassuring-trail-blaze',
        title: 'The Reassuring Trail Blaze Marker',
        icon: '🪧',
        category: 'Trail Sights',
        badge: 'Not Lost Today',
        points: 110,
        description: 'Find an official painted trail blaze on a tree (blue, red, yellow, or white) proving you are still on the right path.',
        hint: 'Eye-level on tree trunks at trail junctions or turns.',
        verificationCriteria: 'Painted blaze or metal trail medallion in frame.'
      },
      {
        id: 'nature-camouflage-find',
        title: 'Nature\'s Master of Camouflage',
        icon: '🦎',
        category: 'Tracking',
        badge: 'Stealth Mode',
        points: 160,
        description: 'Find an insect, lizard, toad, or butterfly that blends almost completely into tree bark, dry leaves, or rock.',
        hint: 'Tree trunks, leaf litter, or lichen-covered stones.',
        verificationCriteria: 'Partner must have to look twice to spot the creature in the photo!'
      }
    ]
  },

  thrift: {
    id: 'thrift',
    name: 'Thrift & Antique Safari',
    shortName: 'Thrift Safari',
    subtitle: 'Goodwill, Flea Markets & Vintage Curiosities',
    icon: '🏺',
    accentColor: 'from-purple-600 to-pink-600',
    badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    description: 'Haunted Victorian dolls, unhinged 80s fashion, forgotten family portraits, weird gadgets, and retro nostalgia.',
    prompts: [
      {
        id: 'doll-100-percent-haunted',
        title: 'The Doll That Is 100% Haunted',
        icon: '🎎',
        category: 'Cursed Curiosities',
        badge: 'Conjuring Vibes',
        points: 160,
        description: 'Find a porcelain doll, marionette, or ventriloquist puppet with eyes that follow you around the antique booth.',
        hint: 'Glass display cases in antique malls or bottom shelves of thrift toy sections.',
        verificationCriteria: 'Partner must confirm this doll would definitely come alive after midnight.'
      },
      {
        id: 'unforgivable-80s-fashion',
        title: 'The 1986 Neon Windbreaker Disaster',
        icon: '🧥',
        category: 'Vintage Threads',
        badge: 'Shoulder Pad Glory',
        points: 150,
        description: 'Find a jacket, shirt, or dress from the 1980s or 90s with blinding colors, absurd shoulder pads, or geometric madness.',
        hint: 'Clothing racks in vintage shops or Goodwill coat sections.',
        verificationCriteria: 'You must hold it up against your body or try it on for maximum glory.'
      },
      {
        id: 'grandmas-cross-stitch-advice',
        title: 'Somebody\'s Grandma\'s Framed Needlepoint',
        icon: '🧵',
        category: 'Home & Craft',
        badge: 'Stitched Wisdom',
        points: 130,
        description: 'Find a framed cross-stitch or embroidery with either wholesome vintage advice ("Bless This Mess") or surprisingly sassy energy.',
        hint: 'Art and picture frame bins or wall decor stalls.',
        verificationCriteria: 'Stitched wording and embroidery must be legible.'
      },
      {
        id: 'dead-format-tech',
        title: 'Obsolete Technology from Another Era',
        icon: '📼',
        category: 'Forgotten Tech',
        badge: 'Analog Fossil',
        points: 130,
        description: 'Find a piece of tech equipment nobody uses anymore: 8-track tape, LaserDisc, floppy disk drive, cassette rewinder, or rotary phone.',
        hint: 'Electronics shelves, audio gear stacks, or retro display cases.',
        verificationCriteria: 'Must be an obsolete physical media format or gadget.'
      },
      {
        id: 'why-ceramic-figurine',
        title: 'The "Why Was This Manufactured?" Figurine',
        icon: '🗿',
        category: 'Cursed Curiosities',
        badge: 'Ceramic Madness',
        points: 140,
        description: 'Find a ceramic animal, clown, or garden gnome with an unsettling expression, awkward anatomy, or confusing purpose.',
        hint: 'Knick-knack shelves, glass vitrines, or dollar knick-knack tables.',
        verificationCriteria: 'Partner agrees this should never have left the kiln.'
      },
      {
        id: 'stranger-family-portrait',
        title: 'The Forgotten 1910 Stranger Portrait',
        icon: '🖼️',
        category: 'History & Lore',
        badge: 'Ancestral Mystery',
        points: 140,
        description: 'Find a framed black-and-white or sepia portrait of unknown people looking intensely serious and unsmiling.',
        hint: 'Antique photo boxes or framed vintage wall art.',
        verificationCriteria: 'Give them a fictional name and tragic backstory in your photo caption!'
      },
      {
        id: 'unhinged-vintage-cookbook',
        title: 'Terrifying 1960s Jell-O Cookbook Recipe',
        icon: '📖',
        category: 'Culinary Horrors',
        badge: 'Gelatin Nightmare',
        points: 150,
        description: 'Find a vintage mid-century cookbook featuring an abhorrent recipe (e.g. tuna in lime gelatin, bologna cake, mayonnaise bananas).',
        hint: 'Old cookbook stacks or vintage kitchenware booths.',
        verificationCriteria: 'Photo must show the recipe title and stomach-churning photo.'
      },
      {
        id: 'absurdly-expensive-antique',
        title: 'The "$450 Rusty Can" Outrageous Price',
        icon: '🏷️',
        category: 'Price Check',
        badge: 'Antique Math',
        points: 130,
        description: 'Find an antique with a handwritten price tag so wildly exorbitant for what is essentially rusted scrap metal or old wood.',
        hint: 'Industrial antique stalls, rusted oil cans, or weathered barn tools.',
        verificationCriteria: 'Price tag and dusty relic both clearly in frame.'
      },
      {
        id: 'velvet-painting-wonder',
        title: 'The Black Velvet Painting Masterpiece',
        icon: '🎨',
        category: 'High Art',
        badge: 'Velvet Legend',
        points: 160,
        description: 'Find a painting done on black velvet: Elvis, howling wolves, crying clowns, or galloping stallions.',
        hint: 'Flea market wall stalls or retro 70s booths.',
        verificationCriteria: 'Velvet texture and dramatic colors captured in photo.'
      },
      {
        id: 'bizarre-vinyl-album-cover',
        title: 'Unhinged Vinyl Album Cover Art',
        icon: '🎵',
        category: 'Music & Audio',
        badge: 'Crate Digger',
        points: 120,
        description: 'Flip through record crates to find an album cover with bizarre costumes, horrifying typography, or hilarious facial hair.',
        hint: 'Vinyl dollar bins, gospel quartet records, or 70s disco imports.',
        verificationCriteria: 'Album cover artwork and musician pose in focus.'
      },
      {
        id: 'vintage-hat-fashion-show',
        title: 'Vintage Millinery Fashion Shoot',
        icon: '🎩',
        category: 'Couples Special',
        badge: 'Runway Antique',
        points: 170,
        description: 'Find an over-the-top vintage hat (pillbox hat with veil, 10-gallon cowboy hat, bowler, or feathered derby) and model it.',
        hint: 'Costume racks or accessory display shelves.',
        verificationCriteria: 'Model pose with serious high-fashion facial expression.'
      },
      {
        id: 'partner-antique-twin',
        title: 'Partner\'s 19th Century Doppelgänger',
        icon: '🪞',
        category: 'Couples Special',
        badge: 'Past Life Confirmed',
        points: 190,
        description: 'Find a painting, statue, or old photograph that bears a hilarious or uncanny resemblance to your partner.',
        hint: 'Antique portraits, painted plates, or vintage bust sculptures.',
        verificationCriteria: 'Partner must admit the resemblance or laugh until crying!'
      },
      {
        id: 'questionable-taxidermy',
        title: 'Questionable Taxidermy / Faux Fur',
        icon: '🦌',
        category: 'Curiosities',
        badge: 'Stuffed Wonder',
        points: 140,
        description: 'Find a mounted deer head, stuffed pheasant, fish on a plaque, or bizarre fur piece that looks slightly startled.',
        hint: 'Rustic cabin booths, flea market corners, or sportsman displays.',
        verificationCriteria: 'Animal expression must be clearly documented.'
      },
      {
        id: 'mystery-brass-gadget',
        title: 'The Unidentifiable Brass Device',
        icon: '⚙️',
        category: 'Forgotten Tech',
        badge: 'Steampunk Mystery',
        points: 130,
        description: 'Find a heavy brass, copper, or iron mechanical tool that neither of you can identify with 100% certainty.',
        hint: 'Tool tables, maritime displays, or medical antique cases.',
        verificationCriteria: 'Partner must try to invent a ridiculous fake use for it.'
      },
      {
        id: 'cursed-antique-mirror-selfie',
        title: 'The Haunted Ornate Mirror Selfie',
        icon: '🪞',
        category: 'Aesthetic',
        badge: 'Ghost Hunter',
        points: 140,
        description: 'Take a moody couples selfie in a tarnished, gold-leaf gilded Victorian mirror without summoning any Victorian spirits.',
        hint: 'Large wall mirrors leaning against antique booth partitions.',
        verificationCriteria: 'Intricate frame and reflection clearly framed.'
      },
      {
        id: 'vintage-board-game-time-machine',
        title: 'Vintage Forgotten Board Game',
        icon: '🎲',
        category: 'Games & Toys',
        badge: 'Family Game Night 1974',
        points: 120,
        description: 'Find a board game manufactured before 1990 with a theme that sounds either mind-numbingly boring or wildly outdated.',
        hint: 'Stacked game boxes in vintage toy areas.',
        verificationCriteria: 'Box cover art and copyright date clearly shown.'
      },
      {
        id: 'heavy-glass-ashtray',
        title: 'The 10-Pound Mid-Century Ashtray',
        icon: '🚬',
        category: 'Home & Craft',
        badge: 'Mad Men Decor',
        points: 110,
        description: 'Find an amber, emerald, or orange heavy glass ashtray so massive it could double as a home defense weapon.',
        hint: 'Retro glassware shelves or 1960s coffee table setups.',
        verificationCriteria: 'Hold it up to show off its chunky glass majesty.'
      },
      {
        id: 'forgotten-souvenir-spoon',
        title: 'Hyper-Specific Tourist Souvenir Spoon',
        icon: '🥄',
        category: 'Curiosities',
        badge: 'World Traveler',
        points: 110,
        description: 'Find a tiny silver souvenir spoon from a town, dam, or roadside reptile farm you have never heard of.',
        hint: 'Hanging spoon racks or small trinket trays.',
        verificationCriteria: 'Enamel emblem and obscure town name readable.'
      },
      {
        id: 'tacky-holiday-sweater',
        title: 'The Champion Tacky Holiday Sweater',
        icon: '🧶',
        category: 'Vintage Threads',
        badge: 'Festive Eyesore',
        points: 140,
        description: 'Find a vintage knit sweater featuring 3D jingle bells, pompoms, or aggressive holiday patterns.',
        hint: 'Thrift sweater racks or seasonal clothing bins.',
        verificationCriteria: 'Hold it up or wear it with pride.'
      },
      {
        id: 'retro-salon-hairdryer',
        title: 'Vintage 1970s Salon Hair Helmet',
        icon: '💇',
        category: 'Forgotten Tech',
        badge: 'Space Helmet',
        points: 130,
        description: 'Find a vintage hooded hairdryer, electric hot rollers, or bizarre retro personal grooming contraption.',
        hint: 'Retro appliance shelves or beauty antique booths.',
        verificationCriteria: 'Pose like you are getting a perm in 1977.'
      },
      {
        id: 'creepy-ventriloquist-dummy',
        title: 'Uncanny Ventriloquist Dummy / Marionette',
        icon: '🎭',
        category: 'Cursed Curiosities',
        badge: 'Goosebumps Night',
        points: 150,
        description: 'Find a string marionette or wooden dummy with a hinged jaw looking ready to deliver roast comedy.',
        hint: 'Toy display cases or hanging vintage displays.',
        verificationCriteria: 'Partner must confirm this object is genuinely unsettling.'
      },
      {
        id: 'vintage-tin-lunchbox',
        title: 'Metal 1980s Retro Lunchbox',
        icon: '🍱',
        category: 'Forgotten Tech',
        badge: 'Recess Nostalgia',
        points: 120,
        description: 'Find an embossed metal lunchbox featuring cartoon characters, retro sci-fi heroes, or forgotten TV shows.',
        hint: 'Collectible cases or vintage pop culture booths.',
        verificationCriteria: 'Embossed metal front and handle clearly visible.'
      },
      {
        id: 'stained-glass-tiffany-lamp',
        title: 'Faux Tiffany Stained Glass Lamp',
        icon: '🪔',
        category: 'Home & Craft',
        badge: 'Stained Glass Wonder',
        points: 130,
        description: 'Find an elaborate lamp shade made of colorful faux stained glass depicting flowers, dragonflies, or fruit.',
        hint: 'Antique lighting corners or lamp display tables.',
        verificationCriteria: 'Lamp colors and illuminated or ambient glass pattern in frame.'
      },
      {
        id: 'elaborate-porcelain-teapot',
        title: 'Overly Elaborate Ceramic Teapot',
        icon: '🫖',
        category: 'Home & Craft',
        badge: 'Fancy High Tea',
        points: 120,
        description: 'Find a teapot shaped like a cottage, an animal, a fruit basket, or bursting with heavy gold leaf.',
        hint: 'Antique dishware and china cabinets.',
        verificationCriteria: 'Pose pinky-out like high society royalty.'
      }
    ]
  },

  mall: {
    id: 'mall',
    name: 'Mall & Shopping Center',
    shortName: 'Mall Adventure',
    subtitle: 'Indoor Malls, Department Stores & Outlets',
    icon: '🛍️',
    accentColor: 'from-rose-500 to-pink-600',
    badgeColor: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
    description: 'Cinnamon pretzel smells, high-end perfume testing, mall massage chairs, absurd high-fashion mannequins, and food court treasures.',
    prompts: [
      {
        id: 'mall-massage-chair-test',
        title: 'The Massage Chair Royalty Pose',
        icon: '💺',
        category: 'Mall Comforts',
        badge: 'Executive Relaxation',
        points: 160,
        description: 'Sit in one of the public robotic massage chairs in the mall concourse and pose looking like a pampered billionaire.',
        hint: 'Mall center court or near department store entrances.',
        verificationCriteria: 'Partner must capture your look of pure robotic bliss.'
      },
      {
        id: 'perfume-spritz-sommelier',
        title: 'Dramatic Perfume/Cologne Sniff Test',
        icon: '✨',
        category: 'Sensory Check',
        badge: 'Eau de Mall',
        points: 130,
        description: 'Take a paper fragrance test strip from a department store cosmetic counter and review it like an obnoxious sommelier.',
        hint: 'Sephora, Macy\'s, or department store fragrance bar.',
        verificationCriteria: 'Hold strip to nose with pinky out, captioning your pretend fragrance notes.'
      },
      {
        id: 'cinematic-food-court-sample',
        title: 'The Glorious Food Court Toothpick Sample',
        icon: '🍗',
        category: 'Culinary Delights',
        badge: 'Free Food Score',
        points: 150,
        description: 'Find a food court vendor offering free chicken or snack samples on a toothpick, and celebrate the victory.',
        hint: 'Bourbon Chicken, teriyaki stands, or pretzel kiosk.',
        verificationCriteria: 'Photo must show the toothpick sample being savored.'
      },
      {
        id: 'mannequin-high-fashion-clone',
        title: 'High-Fashion Mannequin Duplicate',
        icon: '💃',
        category: 'Fashion & Apparel',
        badge: 'Runway Stance',
        points: 170,
        description: 'Find an upscale store mannequin striking a contorted, hyper-dramatic runway pose and mimic it with precision.',
        hint: 'Zara, H&M, or department store front windows.',
        verificationCriteria: 'Side-by-side or match pose in front of the mannequin.'
      },
      {
        id: 'ridiculous-sunglasses-tryon',
        title: 'The Largest Sunglasses in the Store',
        icon: '🕶️',
        category: 'Accessories',
        badge: 'Celebrity Incognito',
        points: 140,
        description: 'Try on the most gigantic, insect-like, or neon sunglasses you can locate on the rack and look dramatically at the camera.',
        hint: 'Sunglass Hut, fashion boutiques, or department store accessory kiosks.',
        verificationCriteria: 'Sunglasses must cover at least 50% of your facial real estate.'
      },
      {
        id: 'novelty-socks-wall',
        title: 'Most Unhinged Novelty Sock Print',
        icon: '🧦',
        category: 'Accessories',
        badge: 'Toasty Wit',
        points: 120,
        description: 'Find a pair of socks featuring tacos, famous paintings, screaming cats, or sassy quotes.',
        hint: 'Accessory stores, gift shops, or novelty racks.',
        verificationCriteria: 'Sock pattern and punchline clear in frame.'
      },
      {
        id: 'wishing-fountain-coin-toss',
        title: 'Mall Fountain Romantic Coin Toss',
        icon: '🪙',
        category: 'Couples Special',
        badge: 'Make A Wish',
        points: 150,
        description: 'Find a mall water fountain and toss in a penny while making a secret date night wish for you two.',
        hint: 'Center atrium, under escalators, or indoor gardens.',
        verificationCriteria: 'Photo capturing the coin toss mid-air or fountain rippling.'
      },
      {
        id: 'unfortunate-phone-case',
        title: 'The Cringiest Phone Case Kiosk Find',
        icon: '📱',
        category: 'Gadgets & Bling',
        badge: 'Kiosk Couture',
        points: 120,
        description: 'Find a phone case dripping with fake diamonds, liquid glitter, 3D bunny ears, or aggressive motivational quotes.',
        hint: 'Center walkway phone accessory kiosks.',
        verificationCriteria: 'Case must be undeniably flashy and gaudy.'
      },
      {
        id: 'claw-machine-tragedy',
        title: 'The Impossible Arcade Claw Machine',
        icon: '🕹️',
        category: 'Games & Play',
        badge: 'Heartbreak Machine',
        points: 130,
        description: 'Find a mall arcade or hallway claw machine containing a prize in a completely impossible position.',
        hint: 'Arcades, movie theater lobbies, or entrance corridors.',
        verificationCriteria: 'Claw and dangling plushie clearly shown.'
      },
      {
        id: 'luxury-price-tag-faint',
        title: 'The $3,000 Handbag Faint',
        icon: '👜',
        category: 'High Society',
        badge: 'Broke Couple Alert',
        points: 140,
        description: 'Find an item at a designer boutique with a four-figure price tag and take a photo looking like you are fainting into your partner\'s arms.',
        hint: 'Coach, Michael Kors, high-end department store display cases.',
        verificationCriteria: 'Price tag or luxury branding framed with dramatic shock.'
      },
      {
        id: 'giant-mall-pretzel-flex',
        title: 'The Sacred Cinnamon Pretzel Flex',
        icon: '🥨',
        category: 'Culinary Delights',
        badge: 'Auntie Anne Devotee',
        points: 150,
        description: 'Pose proudly in front of the warm pretzel case as the intoxicating scent of buttery cinnamon fills the air.',
        hint: 'Auntie Anne\'s, Wetzel\'s Pretzels, or Cinnabon bakery glass.',
        verificationCriteria: 'Golden pretzels glistening under heat lamps in photo.'
      },
      {
        id: 'dressing-room-runway-check',
        title: 'Fitting Room Runway Mirror Check',
        icon: '🪞',
        category: 'Couples Special',
        badge: 'Mirror Check',
        points: 140,
        description: 'Take a mirror selfie together in department store lighting looking sharp, goofy, or striking a dynamic team pose.',
        hint: 'Mirror columns throughout clothing sections or shoe departments.',
        verificationCriteria: 'Both partners visible with coordinated energy.'
      },
      {
        id: 'absurd-as-seen-on-tiktok',
        title: 'The "TikTok Made Me Buy It" Mall Gimmick',
        icon: '📺',
        category: 'Gadgets & Bling',
        badge: 'Viral Wonder',
        points: 130,
        description: 'Find a gadget or toy popularized on social media (galaxy projector, dancing cactus, lip plumping gadget).',
        hint: 'Gift stores like Spencer\'s, BoxLunch, or As Seen on TV shops.',
        verificationCriteria: 'Must be an undeniable viral gimmick product.'
      },
      {
        id: 'pillow-plump-tester',
        title: 'The Mattress / Pillow Squish Inspector',
        icon: '🛏️',
        category: 'Mall Comforts',
        badge: 'Sleep Quality Control',
        points: 120,
        description: 'Give a tester pillow or bed in a department store home section a scientific squish test with intense concentration.',
        hint: 'Bedding department or mattress store showroom.',
        verificationCriteria: 'Hand compressing pillow with facial expression of a forensic scientist.'
      },
      {
        id: 'candy-wall-color-rainbow',
        title: 'The Great Wall of Bulk Candy',
        icon: '🍬',
        category: 'Culinary Delights',
        badge: 'Sugar Rush',
        points: 120,
        description: 'Find a vibrant wall of clear candy dispensers organized in a dazzling rainbow of colors.',
        hint: 'Candy store (Lolli & Pops, Sweet Factory) or bulk sweet kiosk.',
        verificationCriteria: 'Rainbow gradients and sugary barrels prominent in photo.'
      },
      {
        id: 'escalator-supermodel-strut',
        title: 'Escalator Supermodel Glide',
        icon: '🪜',
        category: 'Mall Comforts',
        badge: 'Runway Descent',
        points: 150,
        description: 'Take a glamorous, slow-motion-style photo gliding down the escalator like a celebrity entering fashion week.',
        hint: 'Atrium central escalators (hold handrail safely!).',
        verificationCriteria: 'Partner looking effortlessly chic on the moving stairs.'
      },
      {
        id: 'sneakerhead-holy-grail',
        title: 'Sneakerhead Wall Holy Grail',
        icon: '👟',
        category: 'Fashion & Apparel',
        badge: 'Shoe Flex',
        points: 130,
        description: 'Find the most ridiculously priced or hyper-hyped sneakers on display behind glass.',
        hint: 'Sneaker consignment shops, Foot Locker, or skate stores.',
        verificationCriteria: 'High-top shoes and price tag framed.'
      },
      {
        id: 'hat-store-extravaganza',
        title: 'The 10-Gallon Cowboy / Fedora Flex',
        icon: '🤠',
        category: 'Accessories',
        badge: 'Yeehaw Mall',
        points: 140,
        description: 'Try on the widest-brimmed cowboy hat, felt fedora, or beret and tip it solemnly at the lens.',
        hint: 'Western apparel shops or hat specialty stores (Lids).',
        verificationCriteria: 'Tip of hat and swagger pose.'
      },
      {
        id: 'bath-and-body-lotion-swatch',
        title: '3-Lotion Arm Swatch Showdown',
        icon: '🧴',
        category: 'Sensory Check',
        badge: 'Fragrance Overdose',
        points: 130,
        description: 'Swatch three different lotions on your forearm and photograph the scent experiment.',
        hint: 'Bath & Body Works or cosmetic counter test bottles.',
        verificationCriteria: 'Photo shows three scented swatches with partner reviewing them.'
      },
      {
        id: 'mall-map-you-are-here',
        title: 'Dramatic "You Are Here" Lost Face',
        icon: '🗺️',
        category: 'Curiosities',
        badge: 'Lost In The Mall',
        points: 120,
        description: 'Stand in front of the illuminated mall directory directory map pointing at the red "You Are Here" dot with mock panic.',
        hint: 'Directory kiosks near restrooms or corridor crossings.',
        verificationCriteria: 'Finger pointing at dot with funny bewildered face.'
      },
      {
        id: 'gumball-capsule-nostalgia',
        title: 'Capsule Vending Machine Wonder',
        icon: '🔮',
        category: 'Games & Play',
        badge: 'Quarter Fortune',
        points: 110,
        description: 'Find a row of mechanical 50-cent vending machines dispensing sticky hands, ninja figurines, or temporary tattoos.',
        hint: 'Outside store exits or near arcade entries.',
        verificationCriteria: 'Clear capsule globes and nostalgic prizes shown.'
      }
    ]
  },

  datenight: {
    id: 'datenight',
    name: 'Cozy Date Night at Home',
    shortName: 'Home Date Night',
    subtitle: 'Pajama Quests, Kitchen Shenanigans & Living Room Mystery',
    icon: '🛋️',
    accentColor: 'from-pink-500 to-rose-600',
    badgeColor: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
    description: 'Pantry archaeology, goofy couple challenges, blanket fort architecture, secret comfort snacks, and home mysteries.',
    prompts: [
      {
        id: 'oldest-spice-in-cabinet',
        title: 'Pantry Archaeology: Oldest Spice',
        icon: '🧂',
        category: 'Kitchen Quests',
        badge: 'Ancient Flavor',
        points: 150,
        description: 'Search your kitchen cabinets to find the seasoning, sauce, or canned item with the most shockingly expired best-by date.',
        hint: 'Check the back corners of the spice rack (allspice, bay leaves, or obscure barbecue rubs).',
        verificationCriteria: 'Expiration date or dust-coated label must be visible.'
      },
      {
        id: 'the-cozy-burrito',
        title: 'The Human Blanket Burrito',
        icon: '🌯',
        category: 'Cozy Living',
        badge: 'Sushi Roll Love',
        points: 170,
        description: 'Roll your partner up tightly in a cozy blanket like a warm burrito so only their smiling face pokes out.',
        hint: 'Use the fluffiest throw blanket in the house.',
        verificationCriteria: 'Photo must show the burrito victim looking snug and helpless.'
      },
      {
        id: 'recreate-famous-art-household',
        title: 'Recreate a Famous Painting with Props',
        icon: '🎨',
        category: 'Aesthetic',
        badge: 'Living Room Masterpiece',
        points: 190,
        description: 'Recreate The Girl with a Pearl Earring, American Gothic, or The Scream using kitchen towels, brooms, or household items.',
        hint: 'Towels as head wraps, a wooden spoon as a pitchfork, dramatic living room lighting.',
        verificationCriteria: 'Partner must instantly recognize which historic artwork you are mimicking.'
      },
      {
        id: 'the-comfort-snack-stash',
        title: 'The Secret Emergency Snack Stash',
        icon: '🍫',
        category: 'Kitchen Quests',
        badge: 'Sugar Vault',
        points: 130,
        description: 'Reveal your personal comfort food or treat that you keep hidden away for stressful days or late-night movie binges.',
        hint: 'Pantry top shelf, freezer corner, or bedside drawer.',
        verificationCriteria: 'Present the snack like a culinary prize.'
      },
      {
        id: 'sock-puppet-drama',
        title: 'The 5-Second Sock Puppet Drama',
        icon: '🧦',
        category: 'Goofy Games',
        badge: 'Broadway Living Room',
        points: 140,
        description: 'Put a sock on your hand, give it buttons or a rubber-band mouth, and photograph it expressing intense theatrical heartbreak.',
        hint: 'Use your hand to give it a personality and caption its tragic monologue.',
        verificationCriteria: 'Sock puppet must have genuine emotional depth.'
      },
      {
        id: 'thirty-second-portrait',
        title: '30-Second Speed Portrait of Partner',
        icon: '✏️',
        category: 'Couples Special',
        badge: 'Picasso In 30 Seconds',
        points: 180,
        description: 'Grab a scrap of paper and a pen. You have exactly 30 seconds to draw your partner from memory. No erasing!',
        hint: 'Focus on their hair, their favorite smile, or signature glasses.',
        verificationCriteria: 'Hold the finished drawing next to your partner\'s real face for comparison!'
      },
      {
        id: 'junk-drawer-mystery-key',
        title: 'The Junk Drawer Mystery Key/Cable',
        icon: '🔑',
        category: 'Home Mysteries',
        badge: 'What Does It Open?',
        points: 130,
        description: 'Find a random key, mystery charging cable, or bizarre plastic piece from the junk drawer that neither of you remembers owning.',
        hint: 'The legendary kitchen or entryway junk drawer.',
        verificationCriteria: 'Both partners must confess they have zero idea what it belongs to.'
      },
      {
        id: 'five-star-junk-food-plating',
        title: 'Michelin Star Junk Food Plating',
        icon: '🍽️',
        category: 'Kitchen Quests',
        badge: 'Haute Cuisine',
        points: 160,
        description: 'Take cheap snack food (Doritos, Pop-Tarts, string cheese, gummy worms) and plate it like a $200 tasting-menu dessert with sauce squiggles.',
        hint: 'Use ketchup/sriracha or chocolate syrup droplets, crumbled crisps, and a garnish leaf.',
        verificationCriteria: 'Photo must look hilarious yet surprisingly high-end.'
      },
      {
        id: 'sentimental-mug-showcase',
        title: 'The Mug With The Best Story',
        icon: '☕',
        category: 'Warm Memories',
        badge: 'Caffeine Memories',
        points: 120,
        description: 'Find the coffee mug in your cupboard that holds the most sentimental memories, inside jokes, or vacation nostalgia.',
        hint: 'Show the graphic and explain in your caption why this mug is royalty in your house.',
        verificationCriteria: 'Must be an authentic story behind this ceramic treasure.'
      },
      {
        id: 'book-page-42-prophecy',
        title: 'The Book Page 42 Destiny Prophecy',
        icon: '📖',
        category: 'Home Mysteries',
        badge: 'Book Oracle',
        points: 130,
        description: 'Grab the nearest book from your shelf. Open to page 42, line 5. That sentence is the official prophecy of your date night.',
        hint: 'Fiction, non-fiction, or even a cookbook works wonders.',
        verificationCriteria: 'Snap a photo of the sentence and caption how it applies to you two tonight.'
      },
      {
        id: 'crown-your-partner',
        title: 'Paper / Foil Crown Coronation',
        icon: '👑',
        category: 'Couples Special',
        badge: 'Living Room Royalty',
        points: 170,
        description: 'Fashion a quick crown out of aluminum foil, notebook paper, or post-it notes and officially crown your partner king/queen of the couch.',
        hint: 'Silver foil shines bright under living room lamps.',
        verificationCriteria: 'Partner wearing crown with dignified, royal expression.'
      },
      {
        id: 'nostalgic-tshirt-reveal',
        title: 'The Most Nostalgic / Ratty T-Shirt',
        icon: '👕',
        category: 'Warm Memories',
        badge: 'Threadbare Glory',
        points: 120,
        description: 'Pull out the softest, most worn-out, threadbare band or sports t-shirt you refuse to throw away.',
        hint: 'A relic from high school, a concert in 2014, or summer camp.',
        verificationCriteria: 'Show the vintage faded graphic with pride.'
      },
      {
        id: 'goofy-mirror-faces',
        title: 'The Unsynchronized Synchronized Face',
        icon: '🤪',
        category: 'Couples Special',
        badge: 'Bathroom Funhouse',
        points: 160,
        description: 'Stand in front of the bathroom or hallway mirror together and pull the most deranged, goofy faces you can muster simultaneously.',
        hint: 'Double chin flex, flared nostrils, or cross-eyed wonder.',
        verificationCriteria: 'Both faces captured in reflection with total lack of shame.'
      },
      {
        id: 'candle-sniff-battle',
        title: 'Living Room Candle Scent Showdown',
        icon: '🕯️',
        category: 'Sensory Check',
        badge: 'Aroma Master',
        points: 120,
        description: 'Find two scented candles in your home and pit them against each other in an intense couple blind-sniff battle.',
        hint: 'Vanilla vs teakwood, pumpkin spice vs clean linen.',
        verificationCriteria: 'Photo shows the reigning candle champion in front of its fallen rival.'
      },
      {
        id: 'pet-or-plushie-judge',
        title: 'The Unimpressed Pet / Plushie Judge',
        icon: '🐾',
        category: 'Cozy Living',
        badge: 'Supreme Judge',
        points: 150,
        description: 'Photograph your pet (cat, dog, hamster) or favorite plushie looking at you with total disappointment or supreme judgement.',
        hint: 'Capture that side-eye glare while you play your scavenger hunt.',
        verificationCriteria: 'Partner must confirm the animal or plushie looks visibly judging.'
      },
      {
        id: 'mini-blanket-fort',
        title: 'Couch Cushion Fortress Architect',
        icon: '🏰',
        category: 'Cozy Living',
        badge: 'Civil Engineering',
        points: 170,
        description: 'Construct a mini fortress using couch cushions, throw pillows, and blankets and take a selfie inside.',
        hint: 'Living room couch cushions and dining chair supports.',
        verificationCriteria: 'Both partners peeking out from the fortress.'
      },
      {
        id: 'sync-secret-handshake',
        title: 'Invented 4-Step Secret Handshake',
        icon: '🤝',
        category: 'Couples Special',
        badge: 'Secret Club',
        points: 150,
        description: 'Invent a goofy 4-step couple handshake (e.g. fist bump, elbow tap, finger guns, hip bump) and capture the finale pose.',
        hint: 'Practice once, then snap the dynamic freeze-frame.',
        verificationCriteria: 'Finger guns or synced freeze frame in photo.'
      },
      {
        id: 'fridge-door-magnet-poetry',
        title: 'Refrigerator Magnet Love Note / Joke',
        icon: '🧲',
        category: 'Home Mysteries',
        badge: 'Fridge Poet',
        points: 130,
        description: 'Use word magnets or letters on your fridge door to compose a sweet or hilarious 5-word sentence for your partner.',
        hint: 'Alphabet letters or word tile poetry.',
        verificationCriteria: 'Magnet sentence must be readable in photo.'
      },
      {
        id: 'dramatic-slowmo-toss',
        title: 'Action Movie Pillow Catch',
        icon: '🛋️',
        category: 'Goofy Games',
        badge: 'Matrix Couch',
        points: 140,
        description: 'Snap a photo mid-flight as one partner tosses a throw pillow to the other who catches it with heroic drama.',
        hint: 'Toss gently across the rug and capture the mid-air catch.',
        verificationCriteria: 'Pillow suspended in air or dramatic catch pose.'
      },
      {
        id: 'sock-slide-risky-business',
        title: 'The Hardwood Floor Sock Slide',
        icon: '🧦',
        category: 'Goofy Games',
        badge: 'Risky Business',
        points: 150,
        description: 'Slide across a smooth wood or tile floor in wool socks like Tom Cruise.',
        hint: 'Hallway or kitchen floor (safety first!).',
        verificationCriteria: 'Partner sliding into frame with sunglasses or shades.'
      },
      {
        id: 'kitchen-towel-superhero-cape',
        title: 'Dish Towel Superhero Cape Pose',
        icon: '🦸',
        category: 'Goofy Games',
        badge: 'Pantry Protector',
        points: 140,
        description: 'Tuck a clean kitchen dish towel into the back collar of your shirt like a superhero cape and strike a courageous kitchen pose.',
        hint: 'Stand next to the stove or refrigerator with hands on hips.',
        verificationCriteria: 'Cape flapping in nonexistent wind with proud hero grin.'
      }
    ]
  },

  roadtrip: {
    id: 'roadtrip',
    name: 'Road Trip & Highway Quest',
    shortName: 'Road Trip',
    subtitle: 'Highways, Billboards & Roadside Wonders',
    icon: '🚗',
    accentColor: 'from-cyan-600 to-blue-700',
    badgeColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    description: 'Weird roadside billboards, giant fiberglass statues, out-of-state plates, and wild gas station snacks. Passenger snaps — safety first!',
    coopOnly: true,
    prompts: [
      {
        id: 'weird-injury-billboard',
        title: 'Aggressive Injury Lawyer Billboard',
        icon: '⚖️',
        category: 'Highway Sights',
        badge: 'Legal Sledgehammer',
        points: 130,
        description: 'Spot a massive roadside billboard for a lawyer featuring a fierce nickname, an eyepatch, boxing gloves, or sledgehammer.',
        hint: 'Interstate highways near city bypasses. Passenger duty only — driver keeps eyes on the road!',
        verificationCriteria: 'Passenger captures photo while driver keeps both hands on the wheel.'
      },
      {
        id: 'giant-roadside-attraction',
        title: 'Giant Fiberglass Titan / Roadside Monster',
        icon: '🦕',
        category: 'Roadside Wonders',
        badge: 'Fiberglass Giant',
        points: 170,
        description: 'Spot a comically gigantic roadside statue: Muffler Man, Paul Bunyan, giant dinosaur, giant peach, mammoth strawberry, or massive bull.',
        hint: 'Outside souvenir shops, roadside diners, golf courses, or theme parks along secondary highways.',
        verificationCriteria: 'Statue must be delightfully oversized.'
      },
      {
        id: 'out-of-state-plate',
        title: '1,000-Mile Out-of-State License Plate',
        icon: '🚙',
        category: 'License Plate Bingo',
        badge: 'Long Hauler',
        points: 140,
        description: 'Spot a license plate from a state, province, or territory located at least 1,000 miles (or across the country) from where you are right now.',
        hint: 'Look at passing minivans, RVs, and campers on major interstates.',
        verificationCriteria: 'Plate state name must be clearly readable.'
      },
      {
        id: 'hilarious-bumper-sticker',
        title: 'Unhinged Highway Bumper Sticker',
        icon: '🪧',
        category: 'Highway Sights',
        badge: 'Asphalt Philosopher',
        points: 120,
        description: 'Spot a car ahead of you with a bumper sticker featuring an absurd philosophical take, funny warning, or chaotic stick-figure family.',
        hint: 'Rear bumpers of cars in slow lanes or rest stop parking.',
        verificationCriteria: 'Bumper sticker text must be legible in frame.'
      },
      {
        id: 'bizarre-truck-cargo',
        title: 'Bizarre Flatbed Truck Cargo',
        icon: '🚛',
        category: 'Heavy Haulers',
        badge: 'Oversized Load',
        points: 150,
        description: 'Pass a semi-truck carrying mind-boggling cargo: giant airplane wing, prefabricated house, giant pipe, military vehicle, or mysterious crate.',
        hint: 'Right lane of freight shipping corridors.',
        verificationCriteria: 'Photo must show the scale of the unusual cargo.'
      },
      {
        id: 'oddly-named-town-exit',
        title: '"Blink-and-You-Miss-It" Town Exit Sign',
        icon: '🛣️',
        category: 'Highway Sights',
        badge: 'Geography Chuckle',
        points: 130,
        description: 'Find a green highway exit sign for a town with a funny, baffling, or delightful name (e.g. Peculiar, Boring, Hell, Climax, Intercourse, Normal).',
        hint: 'Highway overhead exit signs or rural state route markers.',
        verificationCriteria: 'Green exit sign name legible in photo.'
      },
      {
        id: 'exotic-gas-station-jerky',
        title: 'Exotic Gas Station Meat Stick / Jerky',
        icon: '🥩',
        category: 'Pit Stop Fuel',
        badge: 'Carnivore Roulette',
        points: 140,
        description: 'Find a jerky stick or dried meat at a travel stop made from an animal you wouldn\'t normally expect (alligator, buffalo, elk, ostrich, rattlesnake).',
        hint: 'Countertop spinner racks at highway truck stops.',
        verificationCriteria: 'Photo of the jerky label showing the exotic animal name.'
      },
      {
        id: 'mega-truck-stop-spectacle',
        title: 'The Mega Travel Center / 100-Pump Oasis',
        icon: '⛽',
        category: 'Pit Stop Fuel',
        badge: 'Highway Megalith',
        points: 150,
        description: 'Pull into a legendary travel center (Buc-ee\'s, Love\'s, Pilot Flying J) and capture the sea of gas pumps or mascot madness.',
        hint: 'Major highway junction rest areas.',
        verificationCriteria: 'Photo of the massive pump canopy or store front.'
      },
      {
        id: 'scenic-bridge-or-tunnel',
        title: 'Dramatic Bridge or Mountain Tunnel Crossing',
        icon: '🌉',
        category: 'Scenic Cruising',
        badge: 'Engineering Feat',
        points: 130,
        description: 'Passenger captures a photo while crossing a high suspension bridge, river gorge, or heading into a dark mountain tunnel.',
        hint: 'Passenger perspective through windshield as you approach the structure.',
        verificationCriteria: 'Bridge architecture or tunnel entrance in focus.'
      },
      {
        id: 'highway-car-karaoke',
        title: 'Passenger Car Karaoke Duet',
        icon: '🎤',
        category: 'Couple Vibes',
        badge: 'Dashboard Popstar',
        points: 160,
        description: 'Turn up your favorite road trip anthem and capture a short video or spirited photo of you two belting out the chorus together.',
        hint: 'Passenger records selfie angle while driver keeps eyes forward and sings along.',
        verificationCriteria: 'Energy and passionate car singing on full display.'
      },
      {
        id: 'derelict-rusty-car-field',
        title: 'Forgotten Classic Rust Car in Field',
        icon: '🚜',
        category: 'Roadside Wonders',
        badge: 'Barn Find Legend',
        points: 130,
        description: 'Spot an old 1950s/60s car or tractor rusting away gracefully in a farmer\'s grassy pasture or behind a barn.',
        hint: 'Rural country highways alongside open fields.',
        verificationCriteria: 'Vintage patina car visible from the passenger window.'
      },
      {
        id: 'wind-turbine-giants',
        title: 'Giant Wind Turbine Blades Spinning',
        icon: '💨',
        category: 'Scenic Cruising',
        badge: 'Wind Horizon',
        points: 120,
        description: 'Spot a field of towering modern white wind turbines slowly revolving across the distant hills.',
        hint: 'Plains, ridges, or wide open valleys.',
        verificationCriteria: 'Wind turbine blades clearly silhouetted against the sky.'
      },
      {
        id: 'state-welcome-sign',
        title: 'State or County "Welcome To" Sign',
        icon: '🗺️',
        category: 'Milestones',
        badge: 'Border Crossing',
        points: 160,
        description: 'Snap the official landmark sign welcoming travelers to a new state or scenic county.',
        hint: 'Right at the state line or river border.',
        verificationCriteria: '"Welcome to [State]" lettering readable in photo.'
      },
      {
        id: 'roadside-fruit-firework-shack',
        title: 'Hand-Painted Produce / Fireworks Shack',
        icon: '🍉',
        category: 'Roadside Wonders',
        badge: 'Rustic Capitalism',
        points: 120,
        description: 'Spot a rural roadside stand with hand-painted wooden signs advertising "FRESH PEACHES", "BOILED PEANUTS", or "MEGA FIREWORKS".',
        hint: 'State highways and two-lane rural corridors.',
        verificationCriteria: 'Handmade wooden signage visible.'
      },
      {
        id: 'cursed-travel-pillow-gear',
        title: 'Cursed Travel Pillow / Road Trip Gear',
        icon: '😴',
        category: 'Couple Vibes',
        badge: 'Highway Slumber',
        points: 140,
        description: 'Photograph partner wearing a goofy neck pillow in an awkward position, wrapped in 3 travel blankets, or using a makeshift sunglasses sun-blocker.',
        hint: 'Front passenger or back seat comfort setup.',
        verificationCriteria: 'Partner looking hilarious and cozy.'
      },
      {
        id: 'highway-cows-audience',
        title: 'Highway Grazing Audience',
        icon: '🐄',
        category: 'Roadside Wonders',
        badge: 'Moo Patrol',
        points: 120,
        description: 'Spot a group of cows, horses, or sheep standing right by the fence staring intently at passing highway traffic.',
        hint: 'Pasture fences along rural highways.',
        verificationCriteria: 'Animals looking directly toward the roadway.'
      },
      {
        id: 'tourist-trap-countdown',
        title: 'Countdown to Mystery Tourist Trap',
        icon: '🏜️',
        category: 'Highway Sights',
        badge: 'Exit In 50 Miles',
        points: 130,
        description: 'Spot a series of billboards aggressively hyping a bizarre tourist trap (e.g. "SEE ROCK CITY", "THE MYSTERY HOLE", "LIVE ALLIGATORS NEXT EXIT").',
        hint: 'Major tourist corridor interstates.',
        verificationCriteria: 'Billboard promoting an eccentric destination.'
      },
      {
        id: 'punny-semi-truck-fleet',
        title: 'Funny Slogan on 18-Wheeler Mudflaps',
        icon: '🚚',
        category: 'Heavy Haulers',
        badge: 'Trucker Wit',
        points: 120,
        description: 'Spot a funny slogan, character (Yosemite Sam "BACK OFF!"), or company pun printed on the back doors or mudflaps of a big rig.',
        hint: 'Rear of tractor-trailers in traffic flow.',
        verificationCriteria: 'Text or character on the truck rear clearly shown.'
      },
      {
        id: 'front-seat-snack-cache',
        title: 'The Holy Road Trip Snack Vault',
        icon: '🍿',
        category: 'Pit Stop Fuel',
        badge: 'Sugar & Salt Fuel',
        points: 130,
        description: 'Photograph the front console or cup holders stuffed with road fuel: sunflower seeds, sour gummies, iced drinks, chips, and trail mix.',
        hint: 'Center console between the seats.',
        verificationCriteria: 'Impressive spread of road trip snacks displayed.'
      },
      {
        id: 'asphalt-sunset-silhouette',
        title: 'Asphalt Horizon Sunset Silhouette',
        icon: '🌅',
        category: 'Scenic Cruising',
        badge: 'Golden Hour Highway',
        points: 150,
        description: 'Capture the golden hour sun setting directly ahead over the long, straight highway pavement with tail lights glowing.',
        hint: 'Heading West during twilight.',
        verificationCriteria: 'Sunset glow melting over the distant road.'
      },
      {
        id: 'historic-highway-shield',
        title: 'Historic Route Shield / Scenic Byway Marker',
        icon: '🛡️',
        category: 'Milestones',
        badge: 'Classic Highway',
        points: 130,
        description: 'Spot a classic route shield sign (e.g. Historic Route 66, US Route 1, Blue Ridge Parkway, Lincoln Highway).',
        hint: 'Shoulder posts along designated historic highway corridors.',
        verificationCriteria: 'Historic shield emblem readable in photo.'
      },
      {
        id: 'chaotic-roof-rack-tetris',
        title: 'Chaotic Roof-Rack Packing Job',
        icon: '🧳',
        category: 'Highway Sights',
        badge: 'Bungee Cord Faith',
        points: 140,
        description: 'Spot a car traveling with bicycles, kayaks, mattresses, or luggage strapped to the roof with suspicious amounts of duct tape or bungee cords.',
        hint: 'Vehicles traveling ahead during holiday or weekend travel.',
        verificationCriteria: 'Roof load arrangement clearly captured.'
      },
      {
        id: 'quirky-diner-rooftop-icon',
        title: 'Diner with Giant Object on the Roof',
        icon: '🍔',
        category: 'Roadside Wonders',
        badge: 'Highway Architecture',
        points: 140,
        description: 'Spot a classic roadside diner or shop sporting a giant fiberglass hot dog, ice cream cone, donut, or bowling pin on its roof.',
        hint: 'Off-highway main streets or older bypasses.',
        verificationCriteria: 'Rooftop icon clearly visible.'
      },
      {
        id: 'small-town-water-tower',
        title: 'Small Town Water Tower with Name',
        icon: '🗼',
        category: 'Milestones',
        badge: 'Civic Pride',
        points: 120,
        description: 'Spot a spherical or tank water tower standing tall over the highway proudly painted with the local town name.',
        hint: 'Rising above tree lines near municipal centers.',
        verificationCriteria: 'Water tower structure and town name legible.'
      },
      {
        id: 'copilot-navigator-flex',
        title: 'Co-Pilot GPS / Maps Mileage Flex',
        icon: '📱',
        category: 'Milestones',
        badge: 'Miles To Go',
        points: 130,
        description: 'Passenger takes a photo of the phone navigation screen showing an epic journey (hundreds of miles or hours remaining on the route).',
        hint: 'GPS route overview showing destination path.',
        verificationCriteria: 'Passenger screen showing road journey stats.'
      },
      {
        id: 'retro-neon-motel-sign',
        title: 'Retro 1950s "VACANCY" Neon Sign',
        icon: '🏨',
        category: 'Roadside Wonders',
        badge: 'Route 66 Motel',
        points: 140,
        description: 'Spot an old roadside motor inn or motel featuring a classic arrow neon sign or glowing "VACANCY" letters.',
        hint: 'Along older highway strips and town entrance boulevards.',
        verificationCriteria: 'Vintage motel sign artwork captured.'
      }
    ]
  }
};

// Backwards compatibility for single-deck imports
const HUNT_PROMPTS = THEMES.supermarket.prompts;

function getTheme(themeId) {
  return THEMES[themeId] || THEMES.supermarket;
}

function getAllThemes() {
  return Object.values(THEMES).map((t) => ({
    id: t.id,
    name: t.name,
    shortName: t.shortName,
    subtitle: t.subtitle,
    icon: t.icon,
    accentColor: t.accentColor,
    badgeColor: t.badgeColor,
    description: t.description,
    coopOnly: !!t.coopOnly,
    promptCount: t.prompts.length
  }));
}

function getPromptsByTheme(themeId) {
  const theme = THEMES[themeId] || THEMES.supermarket;
  return theme.prompts || THEMES.supermarket.prompts;
}

module.exports = {
  THEMES,
  HUNT_PROMPTS,
  getTheme,
  getAllThemes,
  getPromptsByTheme
};
