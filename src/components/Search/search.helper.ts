
type Post = {
    id: string;
    date: string;
    title: string;
}

const regAND = ".*",
    regOR = "|";

export const getReg = (keyword: string) => (operator = regAND) => {
    // split by space
    const _keywords = keyword?.split(/\s/);
    return new RegExp(_keywords.join(operator), "i");
}

export const filterMatchingPosts = (posts: Post[]) => (keyword: string) => {

    const _regKeyword = getReg(keyword);
    let _results = posts.filter((p) => _regKeyword().test(p.title));

    if (!_results.length) {
        _results = posts.filter((p) => _regKeyword(regOR).test(p.title));
    }

    return _results;

};