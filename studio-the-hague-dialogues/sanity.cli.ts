import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'b2khcj7v',
    dataset: 'production'
  },
  deployment: {
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: true,
  },
  /**
   * TypeGen: read GROQ queries from the Next app (one level up) and emit the
   * generated types into the app root so `@/sanity.types` resolves there.
   */
  typegen: {
    enabled: true,
    path: '../src/**/*.{ts,tsx}',
    schema: 'schema.json',
    generates: '../src/sanity.types.ts',
    overloadClientMethods: true,
  },
})
