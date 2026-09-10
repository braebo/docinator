import { defineConfig } from 'tsup'

export default defineConfig([
	{
		entry: {
			'docinator.ts.min': 'src/docinator.ts',
		},
		minify: !0,
		name: 'standard',
		format: ['esm'],
		clean: true,
		dts: !!0,
	},
	{
		entry: ['src/docinator.ts'],
		name: 'standard',
		format: ['esm'],
		clean: true,
		dts: true,
	},
])
