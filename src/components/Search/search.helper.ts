
type Post = {
    id: string;
    date: string;
    title: string;
}

const regAND = ".*";
const regOR = "|";
const MAX_KEYWORD_LENGTH = 120;

const escapeRegExp = (value: string) =>
    value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const buildRegExp = (keyword: string, operator = regAND): RegExp | null => {
    const normalized = keyword?.trim();

    if (!normalized || normalized.length > MAX_KEYWORD_LENGTH) {
        return null;
    }

    const tokens = normalized.split(/\s+/).map(escapeRegExp).filter(Boolean);

    if (!tokens.length) {
        return null;
    }

    try {
        return new RegExp(tokens.join(operator), "i");
    } catch {
        return null;
    }
};

export const getReg = (keyword: string) => (operator = regAND) =>
    buildRegExp(keyword, operator);

export const filterMatchingPosts =
    (posts: Post[]) =>
        (keyword: string): Post[] => {
            const sanitizedKeyword = keyword?.trim() ?? "";
            if (!sanitizedKeyword || sanitizedKeyword.length > MAX_KEYWORD_LENGTH) {
                return [];
            }

            const regexFactory = getReg(sanitizedKeyword);
            const matchWith = (regExp: RegExp | null) =>
                regExp ? posts.filter((p) => regExp.test(p.title)) : [];

            let results = matchWith(regexFactory());

            if (!results.length) {
                results = matchWith(regexFactory(regOR));
            }

            return results;
        };