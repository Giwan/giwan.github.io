import type { Plugin } from 'unified';
import type { Root, Text, Parent } from 'mdast';
import { visit } from 'unist-util-visit';
import { acronyms, getAcronymDefinition } from '../data/acronyms';

interface AcronymValidationOptions {
  mode?: 'warn' | 'error';
  allowedPatterns?: RegExp[];
}

const DEFAULT_ALLOWED_PATTERNS = [
  /^[A-Z]{1,2}$/,
  /^[A-Z]+[0-9]+$/,
  /^[0-9]+[A-Z]+$/,
];

function isAcronym(text: string): boolean {
  const lower = text.toLowerCase();
  return acronyms.some(a => a.acronym.toLowerCase() === lower);
}

function isInLinkOrFootnote(ancestors: Parent[]): boolean {
  return ancestors.some(ancestor => 
    ancestor.type === 'link' || ancestor.type === 'footnoteReference' || ancestor.type === 'footnote'
  );
}

function isInCodeBlock(ancestors: Parent[]): boolean {
  return ancestors.some(ancestor => ancestor.type === 'code');
}

function isInInlineCode(ancestors: Parent[]): boolean {
  return ancestors.some(ancestor => ancestor.type === 'inlineCode');
}

function isInHeading(ancestors: Parent[]): boolean {
  return ancestors.some(ancestor => ancestor.type === 'heading');
}

function isAllowedAcronym(text: string, allowedPatterns: RegExp[]): boolean {
  return allowedPatterns.some(pattern => pattern.test(text));
}

export function remarkAcronymValidator(options: AcronymValidationOptions = {}): Plugin<[AcronymValidationOptions?], Root, Root> {
  const { mode = 'warn', allowedPatterns = DEFAULT_ALLOWED_PATTERNS } = options;

  return (tree: Root, file) => {
    const messages: Array<{ line: number; column: number; message: string }> = [];

    visit(tree, 'text', (node: Text, index: number | null, parent: Parent | undefined) => {
      if (!parent || index === null) return;

      const ancestors = [] as Parent[];
      let current: Parent | null = parent;
      while (current) {
        ancestors.push(current);
        current = current.parent || null;
      }

      if (isInCodeBlock(ancestors) || isInInlineCode(ancestors) || isInLinkOrFootnote(ancestors) || isInHeading(ancestors)) {
        return;
      }

      const words = node.value.split(/\s+/);
      
      for (const word of words) {
        const cleanWord = word.replace(/[.,;:!?()[\]{}"']/g, '');
        
        if (cleanWord.length < 2) continue;
        if (isAllowedAcronym(cleanWord, allowedPatterns)) continue;
        
        if (isAcronym(cleanWord)) {
          const definition = getAcronymDefinition(cleanWord);
          const suggestion = definition 
            ? ` Consider linking to [${definition.fullForm}](${definition.url}) or adding a footnote.`
            : ' Consider adding a link or footnote reference.';
          
          const message = `Acronym "${cleanWord}" should have a link or footnote reference.${suggestion}`;
          
          const position = node.position;
          if (position) {
            messages.push({
              line: position.start.line,
              column: position.start.column,
              message
            });
          }
        }
      }
    });

    for (const msg of messages) {
      if (mode === 'error') {
        file.message(msg.message, { line: msg.line, column: msg.column });
        throw new Error(msg.message);
      } else {
        file.message(msg.message, { line: msg.line, column: msg.column }, 'acronym-validator');
      }
    }
  };
}