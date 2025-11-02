import type { Metadata } from "next"
import { SearchPageClient } from "./search-client"

export const metadata: Metadata = {
  title: "Search - My Personal Life",
  description: "Search albums in your personal photo collection",
}

export default function SearchPage() {
  return <SearchPageClient />
}
