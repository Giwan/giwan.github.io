import { filterMatchingPosts, getReg } from "../search.helper.ts";
import { describe, expect, it } from "@jest/globals";

const matchingPost = {
    id: "",
    date: "",
    title: "bla test"
}

const otherPost = {
    id: "",
    date: "",
    title: "react served by express running in docker"
}
const postsData = [matchingPost, otherPost];

describe(" filter matching posts ", () => {
    it("should find a list of articles or nothing", () => {
        expect(filterMatchingPosts(postsData)("bla")).toMatchObject([matchingPost]);
        expect(filterMatchingPosts(postsData)("random")).toMatchObject([]);
    })

    it("should find a list of articles with multiple keywords", () => {
        expect(filterMatchingPosts(postsData)("react")).toMatchObject([otherPost]);
        expect(filterMatchingPosts(postsData)("react docker")).toMatchObject([otherPost]);
        expect(filterMatchingPosts(postsData)("react docker jsp")).toMatchObject([otherPost]);
    })
})

describe("check the regular expression ", () => {
    it("should return a formatted regex", () => {
        expect(getReg("react docker")()).toStrictEqual(/react.*docker/i);
        expect(getReg("docker react")()).toStrictEqual(/docker.*react/i);
        expect(getReg("docker react")("|")).toStrictEqual(/docker|react/i);
    })
})
