import { 
  Spa, 
  Favorite, 
  Landscape, 
  Lightbulb, 
  WaterDrop, 
  AutoAwesome, 
  Description, 
  Celebration, 
  NightlightRound, 
  NightsStay
} from '@mui/icons-material';

export const THEMES = [
  { name: "Default", color: "bg-white text-black", icon: <Description fontSize='small' /> },
  { name: "Mint", color: "bg-green-100 text-black", icon: <Spa fontSize='small' /> },
  { name: "Rose", color: "bg-red-100 text-black", icon: <Favorite fontSize='small' /> },
  { name: "Slate", color: "bg-slate-300 text-black", icon: <Landscape fontSize='small' /> },
  { name: "Lemon", color: "bg-yellow-100 text-black", icon: <Lightbulb fontSize='small' /> },
  { name: "Azure", color: "bg-blue-100 text-black", icon: <WaterDrop fontSize='small' /> },
  { name: "Lavender", color: "bg-purple-100 text-black", icon: <AutoAwesome fontSize='small' /> },
  { name: "Valentine", color: "bg-pink-200 text-pink-900", icon: <Favorite fontSize='small' /> },
  { name: "Christmas", color: "bg-red-600 text-white", icon: <Celebration fontSize='small' /> },
  { name: "Ramadan", color: "bg-emerald-800 text-white", icon: <NightlightRound fontSize='small' /> },
  { name: "Halloween", color: "bg-orange-500 text-black", icon: <NightsStay fontSize='small' /> },
];