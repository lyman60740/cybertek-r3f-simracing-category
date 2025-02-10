import { createRoot } from 'react-dom/client'
import './styles.css'
import { App } from './App'

const radius = 2.5; // Rayon du cercle (ajuste selon ton besoin)
const center = [0, 0, 1.5]; // Point central de la scène
const angleOffset = Math.PI / 9; // Angle supplémentaire pour ajuster la courbure

const images = [

  // Arrière légèrement tourné vers le centre
  { position: [-radius * 0.3, 0, center[2] - 0.5], rotation: [0, 0, 0], url: '/images/common-ph.png', name: "CATEGORIE 1" },
  { position: [radius * 0.3, 0, center[2] - 0.5], rotation: [0, 0, 0], url: '/images/common-ph.png', name: "CATEGORIE 2" },

  // Côtés gauches
  { position: [-radius * 0.9, 0, center[2] + 0.2], rotation: [0, Math.PI / 4, 0], url: '/images/common-ph.png', name: "CATEGORIE 3" },
  { position: [-radius * 1.3, 0, center[2] + 0.8], rotation: [0, Math.PI / 3.5, 0], url: '/images/common-ph.png', name: "CATEGORIE 4" },
  { position: [-radius * 1.6, 0, center[2] + 2.1], rotation: [0, Math.PI / 2.5, 0], url: '/images/common-ph.png', name: "CATEGORIE 5" },

  // Côtés droits
  { position: [radius * 0.9, 0, center[2] + 0.2], rotation: [0, -Math.PI / 4, 0], url: '/images/common-ph.png', name: "CATEGORIE 6" },
  { position: [radius * 1.3, 0, center[2] + 0.8], rotation: [0, -Math.PI / 3.5, 0], url: '/images/common-ph.png', name: "CATEGORIE 7" },
  { position: [radius * 1.6, 0, center[2] + 2.1], rotation: [0, -Math.PI / 2.5, 0], url: '/images/common-ph.png', name: "CATEGORIE 8" }
];


createRoot(document.getElementById('root')).render(<App images={images} />)
