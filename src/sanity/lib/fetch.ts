import "server-only"

import { draftMode } from "next/headers"
import { createClient, type QueryOptions, type QueryParams } from "next-sanity"
import { projectId, dataset, apiVersion } from "../env"

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false
})

const clientWithCDN = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true
})

export const token = process.env.SANITY_API_READ_TOKEN

const isDev = process?.env.NODE_ENV === "development"

/**
 * Fetches data from Sanity.
 * Automatically handles dev, and preview mode.
 * The function also integrates with Next.js's incremental static regeneration (ISR) feature by specifying revalidation settings.
 *
 * @param {Object} params - The parameters object.
 * @param {string} params.query - The GROQ query string to fetch data from Sanity.
 * @param {QueryParams} [params.params={}] - Optional parameters to include in the query.
 * @param {string[]} params.tags - Tags associated with the query for cache revalidation with Next.js.
 * @param {keyof typeof cacheSettings} params.revalidateAs - The key to access specific cache settings from the app's configuration.
 * @param {boolean} params.useCdn - Flag to determine whether to use Sanity's CDN for fetching data. This is beneficial for client side, and read-heavy applications, but otherwise not needed in Next.js (https://github.com/sanity-io/next-sanity?tab=readme-ov-file#should-usecdn-be-true-or-false)
 * @returns {Promise<QueryResponse>} A promise that resolves with the query response. The type of the response is generic and should be specified by the caller.
 *
 * @example
 * // Fetching published posts
 * const posts = await sanityFetch<{ title: string; slug: string }>({
 *   query: `*[_type == "post" && publishedAt < now()]`,
 *   params: {},
 *   tags: ['post'],
 *   revalidateAs: 'default',
 *   useCdn: true
 * });
 *
 * @throws {Error} Throws an error if the `SANITY_API_READ_TOKEN` is required but not provided.
 */
export async function sanityFetch<QueryResponse>({
  query,
  params = {},
  tags,
  useCdn
}: {
  query: string
  params?: QueryParams
  tags?: string[]
  useCdn?: boolean
}) {
  const isDraftMode = draftMode().isEnabled
  if (isDraftMode && !token) {
    throw new Error("The `SANITY_API_READ_TOKEN` environment variable is required.")
  }

  const usedClient = useCdn ? clientWithCDN : client

  return usedClient.fetch<QueryResponse>(query, params, {
    perspective: "published",
    token: token,
    ...(isDraftMode &&
      ({
        token: token,
        perspective: "previewDrafts"
      } satisfies QueryOptions)),
    next: {
      tags
    }
  })
}