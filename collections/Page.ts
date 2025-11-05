import type { CollectionConfig } from 'payload'
import { FeatureGridCardsBlock } from '../blocks/FeatureGridCardsBlock.ts'

const Page: CollectionConfig = {
  slug: 'page',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly identifier (e.g., "home", "about")',
      },
    },
    {
      name: 'components',
      type: 'blocks',
      blocks: [FeatureGridCardsBlock],
      label: 'Page Components',
    },
  ],
}

export default Page