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
    fs.readdirSync("cache");
} catch ({ }) {
    fs.mkdirSync("cache");
}

fs.writeFileSync("cache/searchData.js", fileContents, function (err) {
    if (err) return console.error(err);
    console.log("Posts cached");
}); 