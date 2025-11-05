import type { Block } from 'payload'

export const FeatureGridCardsBlock: Block = {
  slug: 'feature-grid-cards',
  labels: {
    singular: 'Feature Grid Cards',
    plural: 'Feature Grid Cards Blocks',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Section Title',
      defaultValue: 'Features',
    },
    {
      name: 'items',
      type: 'array',
      label: 'Items',
      minRows: 0,
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
        },
        {
          name: 'cta',
          type: 'group',
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
            },
            {
              name: 'link',
              type: 'text',
              required: true,
            },
          ],
        },
        {
          name: 'image',
          type: 'relationship',
          relationTo: 'media',
          required: true,
        },
      ],
    },
  ],
}

