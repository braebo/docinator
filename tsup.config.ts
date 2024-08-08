import { defineConfig } from 'tsup'

export default defineConfig([
	{
		entry: {
			'index.ts.min': 'src/index.ts.ts',
		},
		minify: !0,
		name: 'standard',
		format: ['esm'],
		clean: true,
		dts: !!0,
	},
	{
		entry: ['src/index.ts.ts'],
		name: 'standard',
		format: ['esm'],
		clean: true,
		dts: true,
	},
])
