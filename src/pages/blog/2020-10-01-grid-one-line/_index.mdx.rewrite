---
path: "/css-grid-one-line"
date: "2020-10-01"
title: "CSS grid one liners"
summary: "CSS layouts achieved in a single line"
image: ""
author: "Giwan Persaud"
published: true
---

Create interesting layouts quickly.

---

This post is based on talk and demo from https://1linelayouts.glitch.me

<style>
:root {
    --grid-demo-bg-color: #37374661; 
    --code-background: #3e4654;
    --font-family: "Roboto", "sans-serif"; 
}
</style>

## Quickly center items

```css
div {
    display: grid;
    place-items: center;
}
```

<style>
.demo-center-item {
    display: grid;
    place-items: center;
    padding: var(--unit);
    margin: var(--unit) 0;
    background-color: var(--code-background);
    border:1px solid var(--grid-demo-bg-color);
    font-family: var(--font-family);
    color: white;
}
</style>
<div class="demo-center-item">
    Centered with grid
</div>

## Three tall cards next to each other

```css
main {
    display: flex;
    flex-wrap: wrap;
}

section {
    /* flex: none | [] */
    flex: 0 1 100px; /* grow = 0 so it doesn't strech */
    flex: 1 0 100px; /* allow grow but not shrink */
}
```

<style>

#demo-cells-1 {
    margin-bottom: var(--unit);
}

#demo-cells-1-main {
    display: flex;
    flex-wrap: wrap;
}

#demo-cells-1-main > section {
flex: 1 0 250px;
background-color: mintcream;
min-height: 100px;
border: 1px solid white;
border-radius: 8px;
/* color: var(--grid-demo-bg-color); */
display: grid;
place-items: center;
font-family: var(--font-family);
font-size: 1em;
line-height: 1em;
padding: var(--unit) calc(var(--unit) / 2);
background-color: var(--code-background);
margin-top: var(--unit);
}

#demo-cells-1-main > section + section {
    border-left-width: 0px;
    color: white;
}

#demo-cells-1-main > section:first-child {
    color: #f92672; 
}

#demo-cells-1-main > section:nth-child(2) {
    color:#a6e22e;
    /* color: #3e4654; */
}

</style>
<article id="demo-cells-1">

<main id="demo-cells-1-main">
    <section>The section items are wrapped in a HTML element which is given the grid display property.</section>
    <section>Each section item is also a grid to use the "place-items: center" tip mentioned above.</section>
    <section>It achieves responsiveness without media queries. The end-result is cleaner code</section>
</main>
</article>

## Main and aside

```css
main {
    display: grid;
    grid-template-columns: minmax(200px, 1fr), 3fr;
}
```
