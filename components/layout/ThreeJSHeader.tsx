"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

export function ThreeJSHeader() {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const animationRef = useRef<number | null>(null)

  useEffect(() => {
    if (!mountRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / 100, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })

    renderer.setSize(window.innerWidth, 100)
    renderer.setClearColor(0x000000, 0)
    mountRef.current.appendChild(renderer.domElement)

    // Create low-poly wave geometry
    const geometry = new THREE.PlaneGeometry(20, 2, 32, 4)
    const material = new THREE.MeshBasicMaterial({
      color: 0x3b82f6,
      wireframe: true,
      transparent: true,
      opacity: 0.3,
    })

    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    camera.position.z = 5
    camera.position.y = 1

    sceneRef.current = scene
    rendererRef.current = renderer

    // Animation
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate)

      const time = Date.now() * 0.001
      const positions = geometry.attributes.position

      for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i)
        const y = Math.sin(x * 0.5 + time) * 0.1
        positions.setY(i, y)
      }

      positions.needsUpdate = true
      mesh.rotation.y = time * 0.1

      renderer.render(scene, camera)
    }

    animate()

    // Handle resize
    const handleResize = () => {
      if (renderer && mountRef.current) {
        renderer.setSize(window.innerWidth, 100)
      }
    }

    window.addEventListener("resize", handleResize)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement)
      }
      window.removeEventListener("resize", handleResize)
      renderer.dispose()
    }
  }, [])

  return (
    <div
      ref={mountRef}
      className="fixed top-0 left-0 w-full h-[100px] z-50 pointer-events-none"
      style={{ height: "100px" }}
    />
  )
}
