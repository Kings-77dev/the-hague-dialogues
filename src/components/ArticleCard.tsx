import Link from 'next/link'
import type {SanityImageSource} from '@sanity/image-url'
import {SanityImage} from './SanityImage'
import {formatMonthYear} from '@/lib/date'

export type ArticleCardData = {
  _id: string
  title: string
  slug: {current?: string | null} | null
  publishedAt: string
  standfirst?: string | null
  format?: string | null
  coverImage?: SanityImageSource | null
}

type ArticleCardProps = {
  article: ArticleCardData
  sizes?: string
}

/** Faithful prototype `.article-card`. Whole card links to the article. */
export function ArticleCard({
  article,
  sizes = '(max-width: 640px) 100vw, (max-width: 1000px) 50vw, 33vw',
}: ArticleCardProps) {
  return (
    <Link href={`/news/${article.slug?.current ?? ''}`} className="article-card block">
      <div className="thumb">
        <SanityImage image={article.coverImage} alt={article.title} sizes={sizes} />
      </div>
      {article.format && <span className="tag">{article.format}</span>}
      <h3>{article.title}</h3>
      {article.standfirst && <p>{article.standfirst}</p>}
      <div className="date">{formatMonthYear(article.publishedAt)}</div>
    </Link>
  )
}
