import type { CollectionConfig } from 'payload'

const Author: CollectionConfig = {
  slug: 'author',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Author full name',
      },
    },
    {
      name: 'bio',
      type: 'textarea',
      required: false,
      admin: {
        description: 'Short biography',
      },
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
      required: false,
      admin: {
        description: 'Author profile picture',
      },
    },
    {
      name: 'email',
      type: 'email',
      required: false,
      admin: {
        description: 'Contact email',
      },
    },
  ],
}

export default Author

