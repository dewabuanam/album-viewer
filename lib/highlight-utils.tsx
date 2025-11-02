import type React from "react"
// Utility function to highlight matching text with yellow background
export function highlightText(text: string, highlightedText: string): React.ReactNode {
  if (!highlightedText || !text) return text

  const lowerText = text.toLowerCase()
  const lowerHighlight = highlightedText.toLowerCase()

  const index = lowerText.indexOf(lowerHighlight)
  if (index === -1) return text

  const before = text.substring(0, index)
  const match = text.substring(index, index + highlightedText.length)
  const after = text.substring(index + highlightedText.length)

  return (
    <>
      {before}
      <span className="bg-yellow-300 font-semibold">{match}</span>
      {after}
    </>
  )
}
