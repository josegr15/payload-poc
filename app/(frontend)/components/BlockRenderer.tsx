import { FeatureGridCards } from "./FeatureGridCards"

type FeatureGridCardsItem = {
  id?: string
  title: string
  description: string
  cta?: {
    label: string
    link: string
  }
  image: string | {
    id: string
    url?: string
    alt?: string
    sizes?: {
      thumbnail?: {
        url?: string
      }
    }
  } | null
}

type Block = {
  blockType: string
  [key: string]: unknown
}

type BlockRendererProps = {
  blocks: Block[]
}

export async function BlockRenderer({ blocks }: BlockRendererProps) {
  return (
    <>
      {blocks.map((block, index) => {
        switch (block.blockType) {
          case 'feature-grid-cards':
            return (
              <FeatureGridCards
                key={index}
                title={typeof block.title === 'string' ? block.title : undefined}
                items={Array.isArray(block.items) ? (block.items as unknown as FeatureGridCardsItem[]) : undefined}
              />
            )
          default:
            return null
        }
      })}
    </>
  )
}

