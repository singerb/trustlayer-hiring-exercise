import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
	overwrite: true,
	schema: "../schemas/schema.graphql",
	generates: {
		"src/generated/graphql.ts": {
			plugins: ["typescript", "typescript-resolvers"],
		},
		"scripts/generated/graphql.ts": {
			documents: ["scripts/**/*.ts"],
			plugins: ["typescript", "typescript-operations", "typed-document-node"],
			config: {
				useTypeImports: true,
				defaultScalarType: "unknown",
				skipTypeNameForRoot: true,
			},
		},
	},
};

export default config;
