import {person} from './person'
import {topic} from './topic'
import {venue} from './venue'
import {partner} from './partner'
import {event} from './event'
import {article} from './article'
import {mediaItem} from './mediaItem'
import {siteSettings} from './siteSettings'
import {homeContent} from './homeContent'
import {aboutContent} from './aboutContent'

export const schemaTypes = [
  person,
  topic,
  venue,
  partner, // reference/taxonomy
  event,
  article,
  mediaItem, // core content
  siteSettings,
  homeContent,
  aboutContent, // singletons
]
