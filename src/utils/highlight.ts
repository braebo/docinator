// todo - update this to use the new shiki API

import type { LanguageInput, ThemeInput } from 'shiki'
import type { HighlighterCore } from 'shiki/core'
import type { CodeToHastOptions } from 'shiki'

// import { transformerTwoSlash } from 'shikiji-twoslash'
import { serendipity } from './highlight.serendipity'
import { createHighlighterCore } from 'shiki/core'
import {
	transformerNotationHighlight,
	transformerNotationFocus,
	transformerNotationDiff,
} from '@shikijs/transformers'

// import { getWasmInlined, bundledLanguages } from 'shiki'
import { getWasmInlined } from 'shiki'
// import { logger } from './logger'
import { fmtTime } from './fmtTime'
// import { dim, o } from './l'
import { dim } from './l'

// const log = logger('highlight', { fg: '#94b8ff', deferred: false, browser: DEBUG, server: DEBUG })
const log = console.log

export type HighlightOptions = CodeToHastOptions<string, string> & {
	/**
	 * The language to highlight.
	 * @defaultValue 'svelte'
	 */
	lang: LanguageInput | string
	/**
	 * The language to highlight.
	 * @defaultValue 'javascript'
	 */
	theme: ThemeInput | 'serendipity'
}

export const HIGHLIGHT_DEFAULTS: HighlightOptions = {
	lang: 'svelte',
	theme: 'serendipity',
	// transformers: [
	// 	transformerNotationHighlight(),
	// 	transformerNotationFocus(),
	// 	transformerNotationDiff(),
	// ],
} as const

const themes = new Set<ThemeInput>()

// The default theme.
themes.add('serendipity' as ThemeInput)

/**
 * Converts text to HTML with syntax highlighting using shikiji.
 */
export async function highlight(text: string, options?: Partial<HighlightOptions>) {
	const opts = { ...HIGHLIGHT_DEFAULTS, ...options } as HighlightOptions

	const lang = opts.lang === 'ts' ? 'typescript' : opts.lang
	const theme = opts.theme as ThemeInput

	log('highlighting', { lang, theme })
	const start = performance.now()

	const highlighter = await getHighlighterInstance()

	if (!highlighter) throw new Error('Unable to load highlighter')

	// await loadLanguage(highlighter, lang)

	// const all = highlighter.getLoadedLanguages()

	// if (!all.includes(lang)) {
	// 	log(o('Language not loaded:'), lang, all)

	// 	await highlighter.loadLanguage(bundledLanguages[lang as keyof typeof bundledLanguages])

	// 	log('loaded', lang)

	// 	// if (!all.includes(lang)) {
	// 	// 	throw new Error(`Unable to load language "${lang}"`)
	// 	// }
	// }

	// if (!themes.has(theme)) {
	// 	log('theme | missing |', theme)

	// 	const { bundledThemes } = await import('shiki')

	// 	await highlighter.loadTheme(bundledThemes[theme])
	// 	themes.add(theme)

	// 	log('theme | loaded |', theme)
	// }

	try {
		const highlighted = highlighter.codeToHtml(text, {
			...opts,
			transformers: [
				transformerNotationHighlight(),
				transformerNotationFocus(),
				transformerNotationDiff(),
				// transformerTwoSlash(),
			],
		})
		const time = fmtTime(performance.now() - start)
		log('complete', dim(time), { lang, theme, text, highlighted })
		return highlighted
	} catch (error) {
		console.error(error)
		return text
	}
}

let highlighterInstance: HighlighterCore
/**
 * Highlighter instance singleton used internally.
 */
export async function getHighlighterInstance() {
	if (!highlighterInstance) {
		highlighterInstance = await createHighlighterCore({
			loadWasm: getWasmInlined,
			themes: [serendipity],
			langs: [
				import('shiki/langs/svelte.mjs'),
				import('shiki/langs/typescript.mjs'),
				import('shiki/langs/javascript.mjs'),
			],
			// langs: [],
		})
	}
	return highlighterInstance
}

// const langs = new Set<string>()
// /**
//  * Load a language into the highlighter.
//  * @internal
//  */
// export async function loadLanguage(highlighter: HighlighterCore, lang: string) {
// 	if (langs.has(lang)) return

// 	log('pending | ' + lang)
// 	await highlighter.loadLanguage(bundledLanguages[lang])
// 	log('loaded | ' + lang)

// 	langs.add(lang)

// 	return lang
// }
