---
title: "Sentence Segmentation with JavaScript's Intl.Segmenter"
description: "Explore how the Intl.Segmenter API can be used to split text into sentences."
createdDate: "2025-08-20"
published: "2025-08-20"
pubDate: "2025-08-20"
status: "published"
readTime: 7
layout: "../../../layouts/BlogArticle.astro"
tags: ["javascript", "i18n", "webdev", "text-processing"]
---

Initially I was using the
<a href="https://www.npmjs.com/package/sbd" target="_blank">SBD</a> library to
split the text into sentences for
<a href="https://mytoori.com" target="_blank">Mytoori.com</a>. Upon uploading
the text, it would get split into sentences which would then be saved to the
MongoDB database.

## Some problems

While that worked, it had some issues. The SBD library would fail in some
peculiar cases. Take this story for example
https://mytoori.com/view/na-fronteira-68a3847bff7940ff1586a198/en It's raw form
looks something like this.

```txt
The afternoon shift at customs was always slow. Then she walked up to his desk.

She set her passport on the counter. The officer looked up from his paperwork.

"Purpose of visit?"

"Studies."

"What kind of studies?"

"Art history." She smiled. "Medieval cathedrals, mostly."
```

The quotes in this case cause the library to fail. The quoted text is not
treated as a sentence.

## Intl.Segmenter

The initial setup was deliberatly simple. Now with these issues though, I looked
for a better solution. I found the Intl.Segmenter. It come built into the
browser, is supported in modern browsers and also in Node.js.

```ts
function segmentBySentence(language: string) {
    return function (text: string) {
        return new Intl.Segmenter(language, { type: "sentence" })
            .segment(text);
    };
}
```

It's beautifully clean and simple. And it works like a charm. In the code above
I've deliberately chosen a functional approach, which might be slighly harder to
read, than a single function. It does have the advantage of being more flexible.
It allows a function to be created for the given langauge, that can be used
multiple times.

> The `Intl.Segmenter` API provides locale-sensitive text segmentation, making
> it possible to:

> 1. Split text into graphemes (user-perceived characters)
> 2. Identify word boundaries according to language rules
> 3. Segment text into sentences
> 4. Handle complex scripts and emoji sequences correctly

In my current implementation, I'm just scratching the surface of what it can do.
There's a lot more to it than just segmenting text into sentences.

I used this
<a href="https://www.stefanjudis.com/today-i-learned/how-to-split-javascript-strings-with-intl-segmenter/" target="_blank">blog
post from Stefan Judis</a> to get started. There's nice tool there to quickly
check if the sentences are split correctly.

## Reference

- [Stefan Judis on Intl.Segmenter](https://www.stefanjudis.com/today-i-learned/how-to-split-javascript-strings-with-intl-segmenter/)
- [MDN reference for Intl.Segmenter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter)
