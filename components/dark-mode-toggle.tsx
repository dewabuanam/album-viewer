"use client"

import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { motion } from "framer-motion"

interface DarkModeToggleProps {
  position?: "top-right" | "header"
  headerPosition?: boolean
}

export function DarkModeToggle({ position = "top-right", headerPosition = false }: DarkModeToggleProps) {
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const isDarkMode = document.documentElement.classList.contains("dark")
    setIsDark(isDarkMode)
  }, [])

  const toggleDarkMode = () => {
    const html = document.documentElement
    const newIsDark = !isDark

    if (newIsDark) {
      html.classList.add("dark")
    } else {
      html.classList.remove("dark")
    }

    setIsDark(newIsDark)
    localStorage.setItem("theme", newIsDark ? "dark" : "light")
  }

  if (!mounted) return null

  const positionClasses = headerPosition ? "relative" : "fixed top-4 right-4 z-50"

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleDarkMode}
      className={`${positionClasses} p-2 rounded-lg bg-muted hover:bg-accent transition-colors border border-border`}
      aria-label="Toggle dark mode"
    >
      {isDark ? <Sun size={20} className="text-foreground" /> : <Moon size={20} className="text-foreground" />}
    </motion.button>
  )
}
