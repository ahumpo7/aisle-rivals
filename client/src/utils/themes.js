// Client Theme Definitions for Couples Scavenger Hunt

export const THEME_LIST = [
  {
    id: 'supermarket',
    name: 'Supermarket & Grocery',
    shortName: 'Supermarket',
    subtitle: 'Walmart, Target & Grocery Run',
    icon: '🛒',
    badge: 'Classic Retail',
    accentColor: 'from-blue-600 to-indigo-600',
    borderActive: 'border-blue-400 ring-1 ring-blue-400 bg-blue-500/15',
    badgeStyle: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    description: 'Unholy flavor combinations, cursed clearance items, bizarre knock-offs, and accidental aisle renaissance.'
  },
  {
    id: 'roadtrip',
    name: 'Road Trip & Highway Quest',
    shortName: 'Road Trip',
    subtitle: 'Highways, Billboards & Roadside Wonders',
    icon: '🚗',
    badge: 'Team Safety Only',
    accentColor: 'from-cyan-600 to-blue-700',
    borderActive: 'border-cyan-400 ring-1 ring-cyan-400 bg-cyan-500/15',
    badgeStyle: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    description: 'Weird roadside billboards, giant fiberglass statues, out-of-state plates, and wild gas station snacks. Passenger snaps — safety first!',
    coopOnly: true
  },
  {
    id: 'city',
    name: 'City & Downtown Stroll',
    shortName: 'City Stroll',
    subtitle: 'Urban Date & Main Street Quests',
    icon: '🏙️',
    badge: 'Outdoor Urban',
    accentColor: 'from-amber-500 to-orange-600',
    borderActive: 'border-amber-400 ring-1 ring-amber-400 bg-amber-500/15',
    badgeStyle: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    description: 'Chalkboard coffee puns, street performers, historic plaques, weird statues, and secret alley art.'
  },
  {
    id: 'nature',
    name: 'Nature & Park Trail',
    shortName: 'Nature Trail',
    subtitle: 'Hiking, Creeks & Outdoor Escapes',
    icon: '🌲',
    badge: 'Outdoor Wild',
    accentColor: 'from-emerald-600 to-teal-700',
    borderActive: 'border-emerald-400 ring-1 ring-emerald-400 bg-emerald-500/15',
    badgeStyle: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    description: 'Heart-shaped rocks, suspicious mushrooms, majestic trees, wildlife sightings, and trail vista treasures.'
  },
  {
    id: 'thrift',
    name: 'Thrift & Antique Safari',
    shortName: 'Thrift Safari',
    subtitle: 'Goodwill, Flea Markets & Curiosities',
    icon: '🏺',
    badge: 'Vintage Hunting',
    accentColor: 'from-purple-600 to-pink-600',
    borderActive: 'border-purple-400 ring-1 ring-purple-400 bg-purple-500/15',
    badgeStyle: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    description: 'Haunted Victorian dolls, unhinged 80s fashion, forgotten family portraits, weird gadgets, and retro nostalgia.'
  },
  {
    id: 'mall',
    name: 'Mall & Shopping Center',
    shortName: 'Mall Adventure',
    subtitle: 'Malls, Outlets & Department Stores',
    icon: '🛍️',
    badge: 'Indoor Adventure',
    accentColor: 'from-rose-500 to-pink-600',
    borderActive: 'border-rose-400 ring-1 ring-rose-400 bg-rose-500/15',
    badgeStyle: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    description: 'Cinnamon pretzel aroma, luxury perfume testing, massage chair bliss, high-fashion mannequins, and food court gems.'
  },
  {
    id: 'datenight',
    name: 'Cozy Date Night at Home',
    shortName: 'Home Date Night',
    subtitle: 'Pajama Quests & Living Room Fun',
    icon: '🛋️',
    badge: 'Stay-At-Home',
    accentColor: 'from-pink-500 to-rose-600',
    borderActive: 'border-pink-400 ring-1 ring-pink-400 bg-pink-500/15',
    badgeStyle: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
    description: 'Pantry archaeology, blanket burrito wrapping, speed partner portraits, Michelin junk food plating, and funny quests.'
  }
];

export function getThemeById(themeId) {
  return THEME_LIST.find((t) => t.id === themeId) || THEME_LIST[0];
}
