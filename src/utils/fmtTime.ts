import { dim } from './l'

/**
 * Formats a number representing time.  Smaller numbers are formatted in
 * milliseconds, and larger numbers in seconds. In both cases, precision
 * is kept to a minimum (trailing zeroes are removed).
 * @param n - Time in milliseconds.
 * @returns Formatted time string.
 */
export function fmtTime(n: number, options?: { decimals?: number }): string {
	const { decimals = n > 1 ? 1 : 2 } = options ?? {}

	if (n < 10) {
		return removeTrailingZeroes(getBestPrecision(n)) + dim('ms')
	} else {
		return removeTrailingZeroes((n / 1000).toFixed(decimals)) + dim('s')
	}

	function removeTrailingZeroes(str: string): string {
		return str.replace(/\.?0+$/, '')
	}

	function getBestPrecision(ms: number) {
		for (let decimals = 1; decimals <= 10; decimals++) {
			const value = ms.toFixed(decimals)
			if (value.at(-1) !== '0') {
				return value
			}
		}
		return ms.toString() // Just in case...
	}
}
