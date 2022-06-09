/**
 * Default ESLint configuration used by Gatsby.
 */

const { store } = require("gatsby/dist/redux")
const { eslintConfig } = require("gatsby/dist/utils/eslint-config")
const {
  rules: customGatsbyRules,
} = require("gatsby/dist/utils/eslint/required")

// Load GraphQL schema
const { schema, config } = store.getState()

// Load default configuration
const { baseConfig } = eslintConfig(schema, config.jsxRuntime === "automatic")

module.exports = {
  configs: {
    recommended: {
      ...baseConfig,

      // Remove `gatsby/dist/utils/eslint/required` from `extends`
      // This module loads Gatsby's custom rules without prefixing with the plugin name
      extends: baseConfig.extends.filter(
        module => !module.includes("gatsby/dist/utils/eslint/required")
      ),

      rules: {
        ...baseConfig.rules,

        // Set defaults for Gatsby's custom rules
        ...Object.entries(customGatsbyRules).reduce(
          (ruleDefaults, [rule, settings]) => ({
            ...ruleDefaults,
            [`gatsby/${rule}`]: settings,
          }),
          {}
        ),

        // TODO #2
        // Disabled because it causes a Syntax Error
        "graphql/template-strings": "off",
      },
    },
  },

  // Provide definitions for Gatsby's custom rules
  rules: Object.keys(customGatsbyRules).reduce(
    (ruleDefinitions, rule) => ({
      ...ruleDefinitions,
      [rule]: require(`gatsby/dist/utils/eslint-rules/${rule}`),
    }),
    {}
  ),
}
