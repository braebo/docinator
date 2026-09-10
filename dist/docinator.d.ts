import { BundledLanguage } from 'shiki';

interface Block {
    type: 'code' | 'other' | (string & {});
    content: string;
}
interface HighlightedBlock extends Block {
    type: 'code';
    content: string;
    lang: BundledLanguage;
    raw: string;
    title?: string;
}
type Blocks = (Block | HighlightedBlock)[];

export type { Block, Blocks, HighlightedBlock };
