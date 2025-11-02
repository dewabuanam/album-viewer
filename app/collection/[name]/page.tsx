import { CollectionPageClient } from "./collection-client"

export async function generateMetadata({ params }: { params: Promise<{ name: string }> }) {
  const resolvedParams = await params
  const collectionName = resolvedParams.name.charAt(0).toUpperCase() + resolvedParams.name.slice(1).toLowerCase()
  return {
    title: `${collectionName} - My Personal Life`,
    description: `Browse albums in the ${collectionName} collection`,
  }
}

export default async function CollectionPage({ params }: { params: Promise<{ name: string }> }) {
  const resolvedParams = await params
  return <CollectionPageClient name={resolvedParams.name} />
}
