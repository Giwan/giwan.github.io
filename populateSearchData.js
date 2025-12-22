import path from "path";
import fs from "fs";

const filterOutTitle = (title) => {
    const newRegExp = /(\d{4}-\d{2}-\d{2})(.+)/;
    const [_, postDate, postTitle] = newRegExp.exec(title) || [];
    return {
        date: postDate,
        title: postTitle?.replaceAll("-", " ")?.trim() || title
    }

}

const getPostsDirectory = () => path.join(process.cwd(), 'src/pages/blog');
const filterOtherFiles = item => item !== ".DS_Store";
const formatPosts = fileName => ({
    id: fileName,
    ...filterOutTitle(fileName)
})


function getPosts() {
    const fileNames = fs.readdirSync(getPostsDirectory()).filter(filterOtherFiles);
    return JSON.stringify(fileNames.map(formatPosts));
}

const fileContents = `export const posts = ${getPosts()};`;

try {
    fs.readdirSync("src/cache");
} catch ({ }) {
    fs.mkdirSync("src/cache");
}

fs.writeFileSync("src/cache/searchData.js", fileContents);
console.log("Posts cached in src/cache/searchData.js");