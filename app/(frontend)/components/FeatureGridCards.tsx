import Image from 'next/image'

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

type FeatureGridCardsProps = {
  title?: string
  items?: FeatureGridCardsItem[]
}

export function FeatureGridCards({ title = "What's New", items = [] }: FeatureGridCardsProps) {
  return (
    <div className="w-full py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-8 sm:mb-12 text-gray-900 dark:text-white">
          {title}
        </h1>
        {items.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-12 text-lg">
            No items yet. Add some items to this component in the admin panel!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {items.map((item, index) => {
              const image = typeof item.image === 'object' && item.image !== null 
                ? item.image 
                : null
              // Handle Payload media URLs
              const imageUrl = image?.url || image?.sizes?.thumbnail?.url || '/file.svg'
              
              return (
                <div 
                  key={item.id || index} 
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col"
                >
                  {image && (
                    <div className="relative w-full h-48 sm:h-56 lg:h-64 overflow-hidden">
                      <Image
                        src={imageUrl}
                        alt={image.alt || item.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  )}
                  <div className="p-6 flex flex-col flex-grow">
                    <h2 className="text-xl sm:text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
                      {item.title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow">
                      {item.description}
                    </p>
                    {item.cta && typeof item.cta === 'object' && item.cta.label && item.cta.link && (
                      <a 
                        href={item.cta.link} 
                        className="inline-block mt-auto px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors duration-200 text-center"
                      >
                        {item.cta.label}
                      </a>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

