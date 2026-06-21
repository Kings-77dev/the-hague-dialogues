import imageUrlBuilder from '@sanity/image-url'
import type {SanityImageSource} from '@sanity/image-url'
import {client} from './client'

const builder = imageUrlBuilder(client)

// usage: urlFor(coverImage).width(1600).height(1000).fit('crop').auto('format').url()
export const urlFor = (src: SanityImageSource) => builder.image(src)
