import Image from 'next/image'
import Link from 'next/link'

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
    <div className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-pink-100">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 sm:mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-pink-700 tracking-tight relative inline-block">
            {title}
            <span className="absolute bottom-0 left-0 w-full h-1 bg-pink-600 rounded-full"></span>
          </h1>
        </div>
        {items.length === 0 ? (
          <p className="text-center text-gray-600 py-12 text-lg">
            No items yet. Add some items to this component in the admin panel!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {items.map((item, index) => {
              const image = typeof item.image === 'object' && item.image !== null 
                ? item.image 
                : null
              // Handle Payload media URLs
              const imageUrl = image?.url || image?.sizes?.thumbnail?.url || '/file.svg'
              
              // Modern color schemes using theme colors
              const colorSchemes = [
                { 
                  bg: 'bg-pink-600', 
                  bgLight: 'bg-pink-50', 
                  text: 'text-white', 
                  textSecondary: 'text-pink-50',
                  button: 'bg-white text-pink-600 hover:bg-pink-50 border-2 border-white',
                  accent: 'bg-pink-500'
                },
                { 
                  bg: 'bg-violet-600', 
                  bgLight: 'bg-violet-50', 
                  text: 'text-white', 
                  textSecondary: 'text-violet-50',
                  button: 'bg-white text-violet-600 hover:bg-violet-50 border-2 border-white',
                  accent: 'bg-violet-500'
                },
                { 
                  bg: 'bg-blue-600', 
                  bgLight: 'bg-blue-50', 
                  text: 'text-white', 
                  textSecondary: 'text-blue-50',
                  button: 'bg-white text-blue-600 hover:bg-blue-50 border-2 border-white',
                  accent: 'bg-blue-500'
                },
              ]
              const scheme = colorSchemes[index % colorSchemes.length]
              
              return (
                <div 
                  key={item.id || index} 
                  className={`group ${scheme.bg} rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col hover:-translate-y-2`}
                >
                  {image && (
                    <div className="relative w-full h-64 sm:h-72 lg:h-80 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10" />
                      <Image
                        src={imageUrl}
                        alt={image.alt || item.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className={`absolute top-6 left-6 w-1.5 h-20 ${scheme.accent} rounded-full shadow-lg z-20`} />
                    </div>
                  )}
                  <div className="p-8 lg:p-10 flex flex-col grow">
                    {!image && (
                      <div className={`w-16 h-1.5 ${scheme.accent} rounded-full mb-6`} />
                    )}
                    <h2 className={`text-2xl sm:text-3xl font-bold mb-4 ${scheme.text} tracking-tight leading-tight`}>
                      {item.title}
                    </h2>
                    <p className={`${scheme.textSecondary} mb-8 grow leading-relaxed text-base opacity-90`}>
                      {item.description}
                    </p>
                    {item.cta && typeof item.cta === 'object' && item.cta.label && item.cta.link && (
                      <Link 
                        href={item.cta.link} 
                        className={`inline-flex items-center justify-center mt-auto px-6 py-3 ${scheme.button} font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl`}
                      >
                        {item.cta.label}
                        <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
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

