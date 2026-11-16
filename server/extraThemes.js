// Unique Scavenger Hunt Themes: Riddles, Date-Building Picnic, and 5 Senses Adventure
// Plus lightning frenzy flash challenges and sabo-powerups

const RIDDLE_PROMPTS = [
  {
    id: 'riddle-avocado',
    title: 'The Stone-Hearted Green Coat',
    icon: '🥑',
    category: 'Produce Riddle',
    badge: 'Riddle Hunt',
    points: 160,
    isRiddle: true,
    riddleClue: 'I wear a bumpy coat of green, the creamiest flesh you have ever seen.\nA heavy stone rests in my heart, squeeze me gently before you start.',
    riddleHint: 'Famous on morning toast and in fresh Mexican dips.',
    riddleAnswer: 'Avocado',
    description: 'Solve the riddle poem, locate the target item, and photograph it to prove your wit!',
    verificationCriteria: 'Photo must show an avocado (bonus if showing the pebbled skin).'
  },
  {
    id: 'riddle-banana',
    title: 'Yellow Pajama Bunch',
    icon: '🍌',
    category: 'Produce Riddle',
    badge: 'Riddle Hunt',
    points: 140,
    isRiddle: true,
    riddleClue: 'I hang in bunches green and tall, but turn bright gold in time for all.\nUnzip my jacket from the top, monkeys love me without stop.',
    riddleHint: 'Rich in potassium and peels from either end.',
    riddleAnswer: 'Banana',
    description: 'Solve the riddle poem, locate the target item, and photograph it!',
    verificationCriteria: 'Must be a bunch or single yellow banana.'
  },
  {
    id: 'riddle-shopping-cart',
    title: 'The Four-Wheeled Wire Cage',
    icon: '🛒',
    category: 'Store Riddle',
    badge: 'Riddle Hunt',
    points: 120,
    isRiddle: true,
    riddleClue: 'I have four wheels and a body of steel, pushed through aisles for every meal.\nOne of my wheels might rattle or squeak, filling my belly is what you seek.',
    riddleHint: 'You put your groceries in it while strolling the store.',
    riddleAnswer: 'Shopping Cart',
    description: 'Solve the riddle poem, locate the target item, and photograph it!',
    verificationCriteria: 'A store shopping cart (bonus points if one wheel looks wonky).'
  },
  {
    id: 'riddle-ice-cream',
    title: 'The Sub-Zero Sweet Scoop',
    icon: '🍨',
    category: 'Frozen Riddle',
    badge: 'Riddle Hunt',
    points: 150,
    isRiddle: true,
    riddleClue: 'I shiver behind glass frosty and cold, in waffle cones my scoops unfold.\nLeave me too long under the summer sun, into a sweet sticky puddle I will run.',
    riddleHint: 'Find me in the sub-zero frozen dessert aisle.',
    riddleAnswer: 'Ice Cream Tub or Pint',
    description: 'Solve the riddle poem, locate the target item, and photograph it!',
    verificationCriteria: 'A tub, pint, or bar of ice cream in the freezer section.'
  },
  {
    id: 'riddle-coffee',
    title: 'The Morning Dark Elixir',
    icon: '☕',
    category: 'Aisle Riddle',
    badge: 'Riddle Hunt',
    points: 150,
    isRiddle: true,
    riddleClue: 'Roast me dark or grind me fine, sleepy morning souls call me divine.\nI wake the world with an earthy steam, best with sugar or a splash of cream.',
    riddleHint: 'Coffee beans, grounds, or brew pods in the hot beverage aisle.',
    riddleAnswer: 'Coffee Beans or Ground Coffee',
    description: 'Solve the riddle poem, locate the target item, and photograph it!',
    verificationCriteria: 'A bag of whole bean, ground coffee, or espresso.'
  },
  {
    id: 'riddle-pineapple',
    title: 'The Crowned Prickly Sovereign',
    icon: '🍍',
    category: 'Produce Riddle',
    badge: 'Riddle Hunt',
    points: 160,
    isRiddle: true,
    riddleClue: 'I wear a spiky crown of green leaves proud, with armor like diamonds in a crowd.\nInside my yellow fruit shines bright and sweet, tropical slices for a sunny treat.',
    riddleHint: 'Tropical fruit that some dare put on pizza.',
    riddleAnswer: 'Pineapple',
    description: 'Solve the riddle poem, locate the target item, and photograph it!',
    verificationCriteria: 'Fresh whole or sliced pineapple.'
  },
  {
    id: 'riddle-onion',
    title: 'The Tearful Paper Layer',
    icon: '🧅',
    category: 'Produce Riddle',
    badge: 'Riddle Hunt',
    points: 140,
    isRiddle: true,
    riddleClue: 'Take off my papery coat of brown or red, and tears from your eyes will surely shed.\nYet I did no harm, no malice or spite, just aromatic flavor in every bite.',
    riddleHint: 'Peel back its layers and cry happy tears.',
    riddleAnswer: 'Onion',
    description: 'Solve the riddle poem, locate the target item, and photograph it!',
    verificationCriteria: 'An onion of any variety (yellow, red, or sweet).'
  },
  {
    id: 'riddle-mirror',
    title: 'The Silent Truth Teller',
    icon: '🪞',
    category: 'Home Goods Riddle',
    badge: 'Riddle Hunt',
    points: 130,
    isRiddle: true,
    riddleClue: 'I have no voice yet speak with grace, whenever you look me in the face.\nI duplicate all that stands before me, reflecting your smile for you to see.',
    riddleHint: 'Found in home decor, bathroom accessories, or cosmetic aisles.',
    riddleAnswer: 'Mirror',
    description: 'Solve the riddle poem, locate the target item, and take a selfie reflection!',
    verificationCriteria: 'A mirror reflecting you or your partner.'
  },
  {
    id: 'riddle-battery',
    title: 'The Charged Cylinder Duo',
    icon: '🔋',
    category: 'Electronics Riddle',
    badge: 'Riddle Hunt',
    points: 140,
    isRiddle: true,
    riddleClue: 'I have a positive and negative pole, giving dormant gadgets life and soul.\nDouble-A or Triple-A in a pack of four, without my spark your remote works no more.',
    riddleHint: 'Found at front checkout or electronics racks.',
    riddleAnswer: 'Pack of Batteries',
    description: 'Solve the riddle poem, locate the target item, and photograph it!',
    verificationCriteria: 'Pack of AA, AAA, or 9V batteries.'
  },
  {
    id: 'riddle-candle',
    title: 'The Scented Burning Wick',
    icon: '🕯️',
    category: 'Home Goods Riddle',
    badge: 'Riddle Hunt',
    points: 130,
    isRiddle: true,
    riddleClue: 'A pool of wax with a cotton thread, sweet aromatic scents are gently shed.\nI burn with a flame that flickers bright, setting the mood for our date tonight.',
    riddleHint: 'Candle section or home fragrance aisle.',
    riddleAnswer: 'Scented Candle in a Jar',
    description: 'Solve the riddle poem, locate the target item, and photograph it!',
    verificationCriteria: 'A scented candle jar with visible wick.'
  },
  {
    id: 'riddle-popcorn',
    title: 'The Explosive Kernel Treat',
    icon: '🍿',
    category: 'Snack Riddle',
    badge: 'Riddle Hunt',
    points: 130,
    isRiddle: true,
    riddleClue: 'Hard tiny gold teeth locked tight in a bag, until microwave heat begins to brag.\nPOP-POP-POP goes the loud delight, fluffy white clouds for movie night.',
    riddleHint: 'Buttery movie theater snack in the popcorn aisle.',
    riddleAnswer: 'Microwave Popcorn Box',
    description: 'Solve the riddle poem, locate the target item, and photograph it!',
    verificationCriteria: 'A box or bag of popcorn.'
  },
  {
    id: 'riddle-toothbrush',
    title: 'The Bristled Smile Polish',
    icon: '🪥',
    category: 'Personal Care Riddle',
    badge: 'Riddle Hunt',
    points: 120,
    isRiddle: true,
    riddleClue: 'A plastic handle with a thousand tiny hairs, guarding your smile from dental scares.\nPair me with mint paste twice every day, to sweep all morning coffee away.',
    riddleHint: 'Dental hygiene aisle.',
    riddleAnswer: 'Toothbrush',
    description: 'Solve the riddle poem, locate the target item, and photograph it!',
    verificationCriteria: 'Toothbrush package or display.'
  },
  {
    id: 'riddle-pizza',
    title: 'The Pepperoni Wheel of Frost',
    icon: '🍕',
    category: 'Frozen Riddle',
    badge: 'Riddle Hunt',
    points: 140,
    isRiddle: true,
    riddleClue: 'A cardboard disc tucked in freezing frost, with red sauce and mozzarella embossed.\nBake me hot at four-twenty-five, to bring the cheese and toppings alive.',
    riddleHint: 'Frozen pizza box in the freezer aisle.',
    riddleAnswer: 'Frozen Pizza',
    description: 'Solve the riddle poem, locate the target item, and photograph it!',
    verificationCriteria: 'A frozen pizza box (DiGiorno, Red Baron, Tombstone, etc.).'
  },
  {
    id: 'riddle-honey',
    title: 'The Golden Hive Treasure',
    icon: '🍯',
    category: 'Condiment Riddle',
    badge: 'Riddle Hunt',
    points: 150,
    isRiddle: true,
    riddleClue: 'Often shaped like a friendly little bear, with liquid gold beyond compare.\nCrafted by a thousand buzzing wings, the sweetest syrup nature brings.',
    riddleHint: 'Baking or tea aisle, often in a plastic bear bottle.',
    riddleAnswer: 'Honey Jar or Honey Bear',
    description: 'Solve the riddle poem, locate the target item, and photograph it!',
    verificationCriteria: 'A bottle of honey (extra points if bear-shaped).'
  },
  {
    id: 'riddle-fuzzy-socks',
    title: 'The Heel and Toe That Cannot Walk',
    icon: '🧦',
    category: 'Apparel Riddle',
    badge: 'Riddle Hunt',
    points: 130,
    isRiddle: true,
    riddleClue: 'I have a heel and toe but take no strides, hugging your cold feet where warmth abides.\nFuzzy or striped in pairs we stand, the coziest soft footwear in the land.',
    riddleHint: 'Clothing or seasonal novelty sock rack.',
    riddleAnswer: 'Pair of Fuzzy or Fun Socks',
    description: 'Solve the riddle poem, locate the target item, and photograph it!',
    verificationCriteria: 'A pair of fuzzy or printed novelty socks.'
  },
  {
    id: 'riddle-potato',
    title: 'The Multi-Eyed Earth Treasure',
    icon: '🥔',
    category: 'Produce Riddle',
    badge: 'Riddle Hunt',
    points: 140,
    isRiddle: true,
    riddleClue: 'I have many eyes but cannot see, pulled from dark dirt as humble as can be.\nMash me with butter, bake me or fry, the ultimate carb under the sky.',
    riddleHint: 'Produce bin sack of Russet, Yukon, or Idaho spuds.',
    riddleAnswer: 'Potato',
    description: 'Solve the riddle poem, locate the target item, and photograph it!',
    verificationCriteria: 'A single potato or bag of potatoes.'
  },
  {
    id: 'riddle-paper-towels',
    title: 'The Perforated Spill Savior',
    icon: '🧻',
    category: 'Household Riddle',
    badge: 'Riddle Hunt',
    points: 110,
    isRiddle: true,
    riddleClue: 'Spun around cardboard in rolls so white, tearing by the sheet for kitchen plight.\nWhen juice or coffee topples over fast, I drink the puddle so the stain won’t last.',
    riddleHint: 'Paper goods aisle.',
    riddleAnswer: 'Paper Towel Roll',
    description: 'Solve the riddle poem, locate the target item, and photograph it!',
    verificationCriteria: 'Roll or multi-pack of paper towels.'
  },
  {
    id: 'riddle-tacos',
    title: 'The Yellow Crunchy Smiles',
    icon: '🌮',
    category: 'Food Riddle',
    badge: 'Riddle Hunt',
    points: 130,
    isRiddle: true,
    riddleClue: 'Crisp golden U-shapes folded tight, waiting for Tuesday fiesta night.\nFill my belly with beef, salsa, and cheese, crunch me in two with eager please.',
    riddleHint: 'Mexican food aisle taco shells.',
    riddleAnswer: 'Hard Taco Shells',
    description: 'Solve the riddle poem, locate the target item, and photograph it!',
    verificationCriteria: 'Box of crunchy taco shells.'
  },
  {
    id: 'riddle-cereal',
    title: 'The Cartoon Mascot Breakfast Box',
    icon: '🥣',
    category: 'Breakfast Riddle',
    badge: 'Riddle Hunt',
    points: 120,
    isRiddle: true,
    riddleClue: 'Tigers, toucans, and leprechauns grin, welcoming morning spoon clatters in.\nPour the cold milk over crunchy sweet rings, the nostalgic joy that breakfast brings.',
    riddleHint: 'Cereal aisle looking for animated mascots.',
    riddleAnswer: 'Box of Breakfast Cereal with Mascot',
    description: 'Solve the riddle poem, locate the target item, and photograph it!',
    verificationCriteria: 'Cereal box clearly featuring an illustrated mascot.'
  },
  {
    id: 'riddle-sponge',
    title: 'The Porous Dish Washer',
    icon: '🧽',
    category: 'Cleaning Riddle',
    badge: 'Riddle Hunt',
    points: 120,
    isRiddle: true,
    riddleClue: 'I am full of holes yet hold soapy suds, scrubbing greasy plates through dinner floods.\nYellow and green or smiley and blue, I wipe your greasy cookware through and through.',
    riddleHint: 'Cleaning aisle or dish soap endcap.',
    riddleAnswer: 'Kitchen Sponge (e.g. Scrub Daddy or Scotch-Brite)',
    description: 'Solve the riddle poem, locate the target item, and photograph it!',
    verificationCriteria: 'Kitchen cleaning sponge.'
  }
];

const PICNIC_PROMPTS = [
  {
    id: 'picnic-bread-foundation',
    title: 'The Crusty Bread or Cracker Vehicle',
    icon: '🥖',
    category: 'Picnic Foundation',
    badge: 'Date Feast',
    points: 130,
    description: 'Find the ultimate carb base for your date feast: a warm French baguette, artisan sourdough loaf, or fancy seeded sea-salt flatbread crackers.',
    hint: 'Bakery counter or deli cracker shelves.',
    verificationCriteria: 'Fresh bread loaf or box of artisanal crackers.'
  },
  {
    id: 'picnic-artisan-cheese',
    title: 'The Specialty Artisan Cheese Wedge',
    icon: '🧀',
    category: 'Charcuterie',
    badge: 'Date Feast',
    points: 160,
    description: 'Select a fancy cheese wedge neither of you has tried before — smoked Gouda, creamy Brie, truffle goat cheese, or sharp aged Manchego.',
    hint: 'Gourmet deli cheese case or specialty cheese island.',
    verificationCriteria: 'Wedge of specialty or gourmet cheese.'
  },
  {
    id: 'picnic-sweet-spread',
    title: 'The Sweet & Savory Jam or Honey Dip',
    icon: '🍯',
    category: 'Charcuterie',
    badge: 'Date Feast',
    points: 140,
    description: 'Find a gourmet condiment to spread across cheese and crackers: fig jam, chili hot honey, red pepper jelly, or gourmet Dijon mustard.',
    hint: 'Check near the cheese case or specialty jams.',
    verificationCriteria: 'Jar of specialty jam, preserves, or hot honey.'
  },
  {
    id: 'picnic-charcuterie-meat',
    title: 'The Savory Charcuterie Ribbon',
    icon: '🥓',
    category: 'Charcuterie',
    badge: 'Date Feast',
    points: 140,
    description: 'Find pre-sliced prosciutto ribbons, hard peppered salami, or gourmet marinated olives to accompany the cheese.',
    hint: 'Deli meats or gourmet antipasto bar.',
    verificationCriteria: 'Package of cured meats or gourmet olives.'
  },
  {
    id: 'picnic-fresh-fruit',
    title: 'The Crisp Vineyard Fruit Garnish',
    icon: '🍇',
    category: 'Fresh Produce',
    badge: 'Date Feast',
    points: 130,
    description: 'Find a cluster of sweet grapes (cotton candy or red seedless), fresh strawberries, or dark blackberries to crown your platter.',
    hint: 'Produce refrigerated fruit displays.',
    verificationCriteria: 'Fresh berries, grapes, or sliced fruit.'
  },
  {
    id: 'picnic-effervescent-drink',
    title: 'The Sparkling Effervescent Toast Drink',
    icon: '🥂',
    category: 'Beverage',
    badge: 'Date Feast',
    points: 150,
    description: 'Select a celebratory beverage for a picnic toast: sparkling apple cider, craft ginger beer, elderflower soda, or glass-bottle lemonade.',
    hint: 'Beverage aisle or international drink cooler.',
    verificationCriteria: 'Fancy or sparkling bottled non-alcoholic or celebratory beverage.'
  },
  {
    id: 'picnic-gourmet-dessert',
    title: 'The Decadent Bakery Sweet Finale',
    icon: '🧁',
    category: 'Sweet Finale',
    badge: 'Date Feast',
    points: 150,
    description: 'Find the sweet ending to your date picnic: freshly baked cannoli, colorful macarons, chocolate molten tarts, or gourmet cookies.',
    hint: 'Fresh bakery case or artisan pastry display.',
    verificationCriteria: 'Bakery dessert ready to eat.'
  },
  {
    id: 'picnic-quirky-cutlery',
    title: 'The Festive Napkins or Quirky Utensils',
    icon: '🍽️',
    category: 'Picnic Gear',
    badge: 'Date Feast',
    points: 110,
    description: 'Find a pack of colorful paper napkins, bamboo forks, or mini appetizer plates to keep your picnic civilized.',
    hint: 'Party supplies or kitchen accessories aisle.',
    verificationCriteria: 'Festive napkins or picnic cutlery pack.'
  },
  {
    id: 'picnic-secret-snack',
    title: '🤫 The Secret <$5 Mystery Treat for Partner',
    icon: '🎁',
    category: 'Secret Gift',
    badge: 'Mystery Reveal',
    points: 180,
    isSecretGift: true,
    description: 'SECRET ROUND: Pick a snack, candy, or miniature dessert under $5 that your partner loves (or has never tried!). Take a photo — it stays secret until game over!',
    hint: 'Keep it a secret! Photo is hidden from partner until post-game unboxing!',
    verificationCriteria: 'Item must be under $5 and kept confidential until the grand reveal.'
  },
  {
    id: 'picnic-assembled-platter',
    title: 'The 5-Star Platter Photo Masterpiece',
    icon: '📸',
    category: 'Couple Challenge',
    badge: 'Masterpiece',
    points: 200,
    isCouplePose: true,
    description: 'Arrange your acquired items onto a bench, car trunk, or basket and snap a styled magazine-worthy photo together before your first bite!',
    hint: 'Lay items out neatly and capture both of your smiling faces over the feast.',
    verificationCriteria: 'A styled photo of the assembled foods with both partners.'
  },
  {
    id: 'picnic-first-bite-cheers',
    title: 'The Romantic "First Bite" Cheers Selfie',
    icon: '🤳',
    category: 'Couple Challenge',
    badge: 'Romance',
    points: 150,
    isCouplePose: true,
    description: 'Clink your glasses or feed each other a strawberry/cracker in a playful, overly dramatic movie-scene toast!',
    hint: 'Look into the camera with exaggerated romantic expressions.',
    verificationCriteria: 'Selfie of both partners toasting or sharing a bite.'
  },
  {
    id: 'picnic-soundtrack-screenshot',
    title: 'The Date Night Picnic Playlist',
    icon: '🎵',
    category: 'Atmosphere',
    badge: 'Date Vibe',
    points: 100,
    description: 'Screenshot the Spotify, Apple Music, or YouTube playlist queued up on your phone to serenade your picnic feast.',
    hint: 'Lo-fi beats, romantic jazz, or nostalgic road-trip throwbacks.',
    verificationCriteria: 'Screenshot of music playing on phone.'
  }
];

const SENSES_PROMPTS = [
  {
    id: 'senses-strongest-scent',
    title: 'The Most Intensely Fragrant Scent',
    icon: '👃',
    category: 'Smell',
    badge: '5 Senses',
    points: 140,
    description: 'Find the most overwhelming scent in the store: fresh coffee grounds, a mega-cinnamon pinecone wreath, or an aggressive eucalyptus soap.',
    hint: 'Candle section, bakery counter, or seasonal decor.',
    verificationCriteria: 'Photo of the scent-source with visible scent label.'
  },
  {
    id: 'senses-scent-nostalgia',
    title: 'The Childhood Memory Scent',
    icon: '💭',
    category: 'Smell',
    badge: '5 Senses',
    points: 130,
    description: 'Find a scent that immediately transports you back to your childhood (e.g. bubblegum shampoo, Crayola crayons, playdough, or pine air freshener).',
    hint: 'Toy aisle, stationery, or bath section.',
    verificationCriteria: 'Partner must hear your story of what childhood memory it sparks.'
  },
  {
    id: 'senses-loudest-crinkle',
    title: 'The Obnoxiously Loud Crinkling Package',
    icon: '👂',
    category: 'Sound',
    badge: '5 Senses',
    points: 130,
    description: 'Find the loudest, most crinkly chip bag, cellophane wrap, or pet squeaker that sounds like lightning when you touch it.',
    hint: 'SunChips bags, crinkly gift wrap, or pet toy squeakers.',
    verificationCriteria: 'Photo of the loud item (partner must confirm the sound in person!).'
  },
  {
    id: 'senses-squeaky-toy-solo',
    title: 'The Pet Aisle Squeak Symphony',
    icon: '🐕',
    category: 'Sound',
    badge: '5 Senses',
    points: 120,
    description: 'Find the most absurd squeaking toy in the pet aisle and snap a photo holding it like a microphone or musical instrument.',
    hint: 'Rubber chickens, squeaky hot dogs, or noisy dog balls.',
    verificationCriteria: 'Photo of the hilarious squeak toy.'
  },
  {
    id: 'senses-softest-cloud',
    title: 'Softer Than a Baby Alpaca',
    icon: '✋',
    category: 'Touch',
    badge: '5 Senses',
    points: 130,
    description: 'Find an object with texture so silky, fluffy, or plush that your hand refuses to let go (ultra-plush Squishmallow, faux-fur throw, or velour hoodie).',
    hint: 'Plush toy bin or home blanket section.',
    verificationCriteria: 'A hand touching the ultra-soft surface.'
  },
  {
    id: 'senses-spikiest-texture',
    title: 'The Prickliest Touch Hazard',
    icon: '🌵',
    category: 'Touch',
    badge: '5 Senses',
    points: 140,
    description: 'Find an item with a surprisingly sharp, spiky, or ribbed texture (a pineapple, wire brush, loofah, or spiky massage roller).',
    hint: 'Bath care, garden center, or produce.',
    verificationCriteria: 'Photo highlighting the spiky or rough texture.'
  },
  {
    id: 'senses-ice-chill',
    title: 'The Sub-Zero Freezer Blast',
    icon: '❄️',
    category: 'Touch',
    badge: '5 Senses',
    points: 110,
    description: 'Open a grocery freezer door, feel the arctic blast, and photograph a frosty surface coated with glistening ice crystals.',
    hint: 'Frozen vegetable or ice cream door shelves.',
    verificationCriteria: 'Visible ice crystals or frosty glass.'
  },
  {
    id: 'senses-blinding-neon',
    title: 'The Blinding High-Vis Neon Item',
    icon: '👁️',
    category: 'Sight',
    badge: '5 Senses',
    points: 120,
    description: 'Find an item in a color so intensely neon highlighter-yellow, radioactive green, or hot pink that it almost hurts your eyes.',
    hint: 'Sporting goods, construction vests, energy drinks, or stationery.',
    verificationCriteria: 'Intense fluorescent or neon colored product.'
  },
  {
    id: 'senses-rainbow-symmetry',
    title: 'The Satisfying Color Symmetry Display',
    icon: '🌈',
    category: 'Sight',
    badge: '5 Senses',
    points: 140,
    description: 'Find a shelf display with impeccably organized color gradients or neat geometric symmetry that gives your brain instant satisfaction.',
    hint: 'Drink coolers, marker stands, or towel displays.',
    verificationCriteria: 'Satisfyingly arranged rows of colors.'
  },
  {
    id: 'senses-extreme-sour',
    title: 'The Mouth-Puckering Sour Candy',
    icon: '🍋',
    category: 'Taste',
    badge: '5 Senses',
    points: 150,
    description: 'Find a candy or snack that promises intense sour agony: Warheads, Toxic Waste, Sour Skittles, or sour pickles.',
    hint: 'Candy aisle or checkout lane racks.',
    verificationCriteria: 'Packaging boasting extreme sour flavors.'
  },
  {
    id: 'senses-flaming-spice',
    title: 'The Four-Alarm Fire Snack',
    icon: '🔥',
    category: 'Taste',
    badge: '5 Senses',
    points: 150,
    description: 'Find a bag of chips, hot sauce, or ramen sporting ghost peppers, Carolina reapers, or packaging with literal flames and skulls.',
    hint: 'Hot sauce rack, ramen aisle, or spicy chips.',
    verificationCriteria: 'Spicy rating or warning label visible.'
  },
  {
    id: 'senses-sweet-tooth-overload',
    title: 'The Sugar Coma Sweet Treat',
    icon: '🍩',
    category: 'Taste',
    badge: '5 Senses',
    points: 130,
    description: 'Find the most unapologetically sugary, frosting-drowned, marshmallow-stuffed dessert on the premises.',
    hint: 'Bakery case, mega-cereal, or frosted cookies.',
    verificationCriteria: 'Intensely sweet or frosted dessert.'
  }
];

const LIGHTNING_CHALLENGES = [
  {
    id: 'frenzy-neon',
    title: 'Find Anything Neon Highlighter Yellow or Pink!',
    icon: '⚡',
    multiplier: 2.5,
    hint: 'Check sports gear, stationery, or energy drink cans!'
  },
  {
    id: 'frenzy-price-three',
    title: 'Find an Item Priced Between $2.99 and $3.99!',
    icon: '🏷️',
    multiplier: 2.0,
    hint: 'Look at shelf tags in snacks, candy, or clearance!'
  },
  {
    id: 'frenzy-smiling-animal',
    title: 'Find a Package Featuring a Smiling Cartoon Animal Mascot!',
    icon: '🦊',
    multiplier: 2.0,
    hint: 'Check cereal, pet food, or kids snacks!'
  },
  {
    id: 'frenzy-exclamation',
    title: 'Find Packaging with 2 or More Exclamation Points (!!)!',
    icon: '❗',
    multiplier: 2.5,
    hint: 'Marketing copy screaming at you: "NEW!!", "EXTREME!!"'
  },
  {
    id: 'frenzy-foreign-import',
    title: 'Find a Product Imported from Over the Ocean!',
    icon: '🌍',
    multiplier: 2.0,
    hint: 'Check international foods, pasta, or exotic sodas!'
  },
  {
    id: 'frenzy-tiny-item',
    title: 'Find the Smallest Item For Sale in the Aisle!',
    icon: '🔍',
    multiplier: 2.0,
    hint: 'Pocket travel sizes, mint tins, or sample packets!'
  }
];

const SABOTAGE_POWERUPS = [
  {
    id: 'freeze',
    name: 'Aisle Freeze',
    icon: '🧊',
    durationSeconds: 20,
    description: 'Frosted screen! Partner must wait 20s or shiver before snapping!',
    color: 'from-cyan-500 to-blue-600'
  },
  {
    id: 'opposite_hand',
    name: 'Wrong Hand Only',
    icon: '🖐️',
    durationSeconds: 45,
    description: 'Partner must snap their next photo using only their non-dominant hand!',
    color: 'from-amber-500 to-yellow-600'
  },
  {
    id: 'slow_mo',
    name: 'Slow-Motion Walk',
    icon: '🐢',
    durationSeconds: 30,
    description: 'Partner must walk in dramatic slow-motion to their next item!',
    color: 'from-emerald-500 to-teal-600'
  }
];

module.exports = {
  RIDDLE_PROMPTS,
  PICNIC_PROMPTS,
  SENSES_PROMPTS,
  LIGHTNING_CHALLENGES,
  SABOTAGE_POWERUPS
};
