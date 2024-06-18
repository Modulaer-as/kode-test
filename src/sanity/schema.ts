import { type SchemaTypeDefinition } from 'sanity'
import { frontPage } from './documents/frontpage'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [frontPage],
}
