import * as THREE from 'three'
import { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import { useCursor, MeshReflectorMaterial, Image as DreiImage, Text, Environment } from '@react-three/drei'
import { useRoute, useLocation } from 'wouter'
import { easing } from 'maath'
import getUuid from 'uuid-by-string'
import { OrbitControls } from "@react-three/drei";

import { Ground } from "./Ground";


function CameraRig() {
  const { camera } = useThree();
  const [animationDone, setAnimationDone] = useState(false);

  // Position initiale (plus haut et plus loin)
  const initialPosition = [0, 10, 55];
  const targetPosition = [0, 0.5, 7.8];

  useEffect(() => {
    camera.position.set(...initialPosition);
  }, []);

  useFrame((state, dt) => {
    if (!animationDone) {
      // Animation fluide de la position
      easing.damp3(camera.position, targetPosition, 0.8, dt);

      // Vérification : si l'animation est proche de la fin, on stoppe l'update
      if (Math.abs(camera.position.z - targetPosition[2]) < 0.05) {
        setAnimationDone(true);
      }
    }
  });

  return null;
}

const GOLDENRATIO = 1.61803398875

export const App = ({ images }) => {
  const [, setLocation] = useLocation()
  const [hoveredObject, setHoveredObject] = useState(null) // Hover des `<li>`
  const [selectedObject, setSelectedObject] = useState(null) // Clic sur une frame

  useEffect(() => {
    const listItems = document.querySelectorAll('.hero-banner ul li');

    const handleMouseEnter = (index) => () => {
        setHoveredObject(index);
        setSelectedObject(null); // ✅ Réinitialiser la frame mise en avant
    };

    const handleMouseLeave = () => {
        setHoveredObject(null);
    };

    listItems.forEach((li, index) => {
        li.addEventListener('mouseenter', handleMouseEnter(index));
        li.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
        listItems.forEach((li, index) => {
            li.removeEventListener('mouseenter', handleMouseEnter(index));
            li.removeEventListener('mouseleave', handleMouseLeave);
        });
    };
}, [images]);

// ✅ Ajout de la classe `selected` dynamiquement pour les `<li>`
useEffect(() => {
    const listItems = document.querySelectorAll('.hero-banner ul li');

    listItems.forEach((li, index) => {
        li.classList.toggle(
            "selected",
            index === hoveredObject || index === selectedObject
        );
    });
}, [hoveredObject, selectedObject]);


  return (
    <Canvas dpr={[1, 1.5]} camera={{ fov: 70, position: [0, 0.5, 7.8] }}>
      <color attach="background" args={['black']} />
      <fog attach="fog" args={['black', 0, 20]} />

      <CameraRig />

      <ambientLight intensity={.5} />
  <directionalLight position={[-4, 5, 2]} intensity={.4} castShadow />
      <group position={[0, -0.5, 0]}>
      <Frames 
  images={images} 
  hoveredObject={hoveredObject} 
  selectedObject={selectedObject} 
  setSelectedObject={setSelectedObject} 
  setHoveredObject={setHoveredObject} // ✅ Passage de `setHoveredObject`
/>
        {/* <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[50, 50]} />
          <MeshReflectorMaterial
            blur={[300, 100]}
            resolution={2048}
            mixBlur={1}
            mixStrength={80}
            roughness={1}
            depthScale={1.2}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.4}
            color="#050505"
            metalness={0.5}
          />
        </mesh> */}
        <Ground />
      </group>
      {/* <Environment preset="city" /> */}
      {/* <OrbitControls enableZoom={true} /> */}
    </Canvas>
  )
}




function Frames({ images, hoveredObject, selectedObject, setSelectedObject, setHoveredObject  }) {
  const ref = useRef()

  return (
    <group ref={ref}>
      {images.map((props, index) => (
        <Frame 
          key={props.url} 
          {...props} 
          isSelected={selectedObject === index} 
          isHovered={hoveredObject === index} 
          onSelect={() => setSelectedObject(index)}
          onDeselect={() => setSelectedObject(null)}
          setHoveredObject={setHoveredObject} // ✅ Passage de la prop
          index={index} // ✅ Ajout de l'index pour lier chaque frame
        />
      ))}
    </group>
  )
}


function Frame({ url, position, rotation, isSelected, isHovered, onSelect, onDeselect,setHoveredObject, index, ...props }) {
  const ref = useRef()
  const image = useRef()
  const frame = useRef()
  const [hovered, hover] = useState(false)
  const [rnd] = useState(() => Math.random())

  const originalPosition = useRef(new THREE.Vector3(...position))
  const originalRotation = useRef(new THREE.Euler(...rotation))

  useCursor(hovered)

  // Un seul objet peut être actif (soit par hover, soit par clic)
  const isActive = isSelected || (isHovered && !isSelected)
 
  useFrame((state, dt) => {
    const targetPosition = isActive ? new THREE.Vector3(0, 0, 5.5) : originalPosition.current
    const targetRotation = isActive ? new THREE.Euler(0, 0, 0) : originalRotation.current

    // Animation fluide de la position
    easing.damp3(ref.current.position, targetPosition, 0.4, dt)

    // Animation fluide de la rotation
    easing.dampE(ref.current.rotation, targetRotation, 0.4, dt)

    // Effet de zoom sur l’image
    // image.current.material.zoom = 2 + Math.sin(rnd * 10000 + state.clock.elapsedTime / 3) / 2

    // Changement de couleur du cadre au hover
    easing.dampC(frame.current.material.color, hovered ? '#FFCF00' : 'white', 0.1, dt)
  })

  return (
    <group 
      ref={ref} 
      position={position} 
      rotation={rotation}
      onPointerOver={() => setHoveredObject && setHoveredObject(index)} // ✅ Vérifie que `setHoveredObject` existe
      onPointerOut={() => setHoveredObject && setHoveredObject(null)}
      onClick={() => (isSelected ? onDeselect() : onSelect())} // Garde le clic
    >
      <mesh
        onPointerOver={(e) => (e.stopPropagation(), hover(true))}
        onPointerOut={() => hover(false)}
        scale={[1, GOLDENRATIO, 0.05]}
        position={[0, 0.9, 0.2]}
      >
        <boxGeometry />
        <meshBasicMaterial color="black"  />

        <mesh ref={frame} raycast={() => null} scale={[0.9, 0.93, 0.9]} position={[0, 0, 0.2]}>
          <boxGeometry />
          <meshBasicMaterial toneMapped={false} fog={true} />
        </mesh>
        <mesh position={[0, 0, 0.7]}>
          <planeGeometry args={[0.8, 0.87]} /> {/* Respecte le ratio 380x235 */}
          <meshBasicMaterial map={useLoader(THREE.TextureLoader, url)} />
        </mesh>

      </mesh>
      <Text 
       maxWidth={0.5}
        anchorX="left"
         anchorY="top" 
         position={[0.55, GOLDENRATIO, 0.2]} 
         fontSize={0.05} 
         color={isSelected ? "#FFCF00" : isHovered ? "#FFCF00" : "white"}
         toneMapped={false}    
         onPointerOver={(e) => e.stopPropagation()} 
          onPointerOut={(e) => e.stopPropagation()}       
         >
        {props.name}
      </Text>
    </group>
  )
}
