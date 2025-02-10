import { createRoot } from 'react-dom/client'
import './styles.css'
import { App } from './App'

const radius = 2.5; // Rayon du cercle (ajuste selon ton besoin)
const center = [0, 0, 1.5]; // Point central de la scène
const angleOffset = Math.PI / 9; // Angle supplémentaire pour ajuster la courbure

const images = [

  // Arrière légèrement tourné vers le centre
  { position: [-radius * 0.3, 0, center[2] - 0.5], rotation: [0, 0, 0], url: '/images/common-ph.png', name: "(1) CHASSIS" },
  { position: [radius * 0.3, 0, center[2] - 0.5], rotation: [0, 0, 0], url: '/images/common-ph.png', name: "(2) PC GAMER" },

  // Côtés gauches
  { position: [-radius * 0.9, 0, center[2] + 0.2], rotation: [0, Math.PI / 4, 0], url: '/images/common-ph.png', name: "(3) PEDALIER" },
  { position: [-radius * 1.3, 0, center[2] + 0.8], rotation: [0, Math.PI / 3.5, 0], url: '/images/common-ph.png', name: "(4) ECRANS" },
  { position: [-radius * 1.6, 0, center[2] + 2.1], rotation: [0, Math.PI / 2.5, 0], url: '/images/common-ph.png', name: "(5) VOLANTS" },

  // Côtés droits
  { position: [radius * 0.9, 0, center[2] + 0.2], rotation: [0, -Math.PI / 4, 0], url: '/images/common-ph.png', name: "(6) BASE DE VOLANT" },
  { position: [radius * 1.3, 0, center[2] + 0.8], rotation: [0, -Math.PI / 3.5, 0], url: '/images/common-ph.png', name: "(7) ACCESSOIRES GAMING" },
  { position: [radius * 1.6, 0, center[2] + 2.1], rotation: [0, -Math.PI / 2.5, 0], url: '/images/common-ph.png', name: "(8) BUNDLE" }
];


createRoot(document.getElementById('root')).render(<App images={images} />)
