import { CulturalEvent, FomoStat, ValueProp } from "./types";

export const culturalEvents: CulturalEvent[] = [
  {
    id: "bhoota-kola",
    name: "Bhoota Kola",
    location: "Dakshina Kannada, Karnataka",
    tag: "LIVE this Winter",
    imageUrl: "https://images.unsplash.com/photo-1514539079130-25950c84af65?auto=format&fit=crop&q=80&w=800",
    description: "An ancient nocturnal spirit-worship ritual where oracles channel demigods amidst high-energy drums, bronze masks, and towering fire torches.",
    seasonMonth: "December - April"
  },
  {
    id: "theyyam",
    name: "Theyyam",
    location: "Malabar, Kerala",
    tag: "Ritual in Progress",
    imageUrl: "https://images.unsplash.com/photo-1601574901248-9c900ed31014?auto=format&fit=crop&q=80&w=800",
    description: "The line between the mortal and immortal dissolves as dancers don heavy scarlet gear, elaborate face paint, and ascend into a trance of active worship.",
    seasonMonth: "November - May"
  },
  {
    id: "kambala",
    name: "Kambala Buffalo Race",
    location: "Udupi & Mangaluru, Karnataka",
    tag: "This Season",
    imageUrl: "https://images.unsplash.com/photo-1544256718-3bcf237f3974?auto=format&fit=crop&q=80&w=800",
    description: "A jaw-dropping, high-stakes muddy sprint through waterlogged paddy fields, powered by high-speed buffalo pairs and heroic human runners.",
    seasonMonth: "November - March"
  }
];

export const fomoStats: FomoStat[] = [
  {
    id: "stat-1",
    boldText: "Last month, 300 gatherers witnessed a Bhoota Kola in Kateel.",
    subText: "Under direct torchlight, the oracle spoke in the voice of ancestral protectors.",
    punch: "The rest of the world never knew it happened."
  },
  {
    id: "stat-2",
    boldText: "Hundreds of sacred living traditions happen across India every week.",
    subText: "Passed down entirely by word of mouth through the bloodlines of forest clans.",
    punch: "Most disappear into the night without a trace."
  },
  {
    id: "stat-3",
    boldText: "Go search 'Bhoota Kola live' on YouTube.",
    subText: "You will find vertical shaky videos from 2018 with compressed audio and low fidelity.",
    punch: "That's the tragedy we are putting an end to."
  }
];

export const valueProps: ValueProp[] = [
  {
    id: "vp-discover",
    title: "Discover Local Legends",
    description: "A geo-tracked real-time feed that unlocks the exact schedules, sacred protocols, and historical folklore of regional rituals happening near you.",
    iconName: "Compass"
  },
  {
    id: "vp-experience",
    title: "Immersive Livestreaming",
    description: "Experience rare ritual chants, massive drum beat performances, and vibrant displays with ultra-high fidelity audio and 4K spatial feeds.",
    iconName: "Tv"
  },
  {
    id: "vp-preserve",
    title: "Guardianship of Heritage",
    description: "Your participation directly funds traditional guilds, supporting young practitioners of ancient arts and creating living digital records.",
    iconName: "Shield"
  }
];
