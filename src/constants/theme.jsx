import { 
  Spa, LocalFlorist, Landscape, Lightbulb, WaterDrop, 
  AutoAwesome, Description, Favorite, Celebration, 
  NightlightRound, NightsStay, 
  Flare, Star, Diversity1 
} from '@mui/icons-material';

export const THEMES = [
  { name: "Default", color: "bg-white text-slate-700", icon: <Description fontSize='small' /> },
  { name: "Mint", color: "bg-emerald-50 text-emerald-900", icon: <Spa fontSize='small' /> },
  { name: "Rose", color: "bg-rose-50 text-rose-900", icon: <LocalFlorist fontSize='small' /> },
  { name: "Slate", color: "bg-slate-200 text-slate-800", icon: <Landscape fontSize='small' /> },
  { name: "Lemon", color: "bg-yellow-50 text-yellow-900", icon: <Lightbulb fontSize='small' /> },
  { name: "Azure", color: "bg-sky-50 text-sky-900", icon: <WaterDrop fontSize='small' /> },
  { name: "Lavender", color: "bg-indigo-50 text-indigo-900", icon: <AutoAwesome fontSize='small' /> },
  
  /* --- Holidays: Softer & Refined --- */
  { name: "Valentine", color: "bg-pink-50 text-pink-600", icon: <Favorite fontSize='small' /> },
  { name: "Ramadan", color: "bg-teal-50 text-teal-800", icon: <NightlightRound fontSize='small' /> }, // Soft Moonlight
  { name: "Halloween", color: "bg-orange-50 text-orange-900", icon: <NightsStay fontSize='small' /> },
  { name: "Christmas", color: "bg-red-50 text-red-900", icon: <Celebration fontSize='small' /> },
  
  /* --- New Additions --- */
  { name: "Diwali", color: "bg-amber-50 text-amber-900", icon: <Flare fontSize='small' /> }, // Festival of Lights
  { name: "Lunar New Year", color: "bg-red-100 text-red-700", icon: <Star fontSize='small' /> }, // Subtle Red & Gold feel
  { name: "Pride", color: "bg-gradient-to-r from-red-50 to-blue-50 text-slate-800", icon: <Diversity1 fontSize='small' /> },
];