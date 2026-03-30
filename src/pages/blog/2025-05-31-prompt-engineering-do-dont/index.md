---
title: "Prompt Engineering: Essential Do's and Don'ts for Beginners"
description: "Master the art of prompt engineering with these essential do's and don'ts to get the best results from AI language models."
createdDate: "2025-05-31"
published: "2025-05-31"
pubDate: "2025-05-31"
status: "published"
readTime: 5
layout: "../../../layouts/BlogArticle.astro"
---

Prompt engineering is the art and science of crafting effective prompts to get
the best possible results from AI language models. Whether you're using ChatGPT,
Claude, or other AI assistants, following these do's and don'ts will
significantly improve your interactions.

## Do's

### 1. Provide context

The largest models have lots of knowledge. Think of them as a confused
professor. They know a lot but you need to get them to focus on the issue you're
trying to solve.

Narrow the problem space by assigning them a role. For example:

- You are a web developer
- You are a data scientist
- You are a marketing expert

The tokens, i.e, words matter. In the first example, that should mean that it
would be less inclined to suggest something backend related. That will help you
get better results.

### 2. Use Step-by-Step Instructions

- **Do** break down complex tasks into smaller steps
- **Do** ask the model to think through its reasoning
- **Do** request the model to verify its own answers

### 3. Provide Examples

- **Do** include input-output examples
- **Do** show the format you expect
- **Do** demonstrate the style and tone you prefer

For example: Your answer should be in JSON with the following structure:

```json5
{
    "name": "John Doe", // The model should fill this field with an actual result
    "age": 30, // The model should fill this field with an actual result
    "city": "New York" // The model should fill this field with an actual result
}
```

### 4. Set Constraints

- **Do** specify word or character limits if applicable
- **Do** define the scope of the response
- **Do** set the appropriate level of technicality

Note that models don't repond well to negative instructions. Avoid using words
like "don't" or "should not". Instead, use positive instructions to tailor your
results.

Think about how models work. A good example of this is "Peanut butter and ..."
The model is likely to answer with "jelly". If you tell it to "avoid the world
jelly", you've not given it a clear alternative. The result therefore might be
erratic.

In this particular example, it might be better to tell the model to make sugar
free suggestions. In that case "Peanut butter and ..." might result in "Peanut
butter and banana".

### 5. Iterate and Refine

- **Do** build upon previous responses
- **Do** ask follow-up questions
- **Do** refine your prompts based on results

## Don'ts

### 1. Avoid Vague or Ambiguous Prompts

- **Don't** ask overly broad questions
- **Don't** use ambiguous language
- **Don't** expect the AI to read your mind

### 2. Don't Overload with Multiple Questions

- **Don't** ask too many things at once
- **Don't** change topics abruptly
- **Don't** combine unrelated requests

### 3. Avoid Leading or Biased Questions

- **Don't** phrase questions to get a specific answer
- **Don't** include your own biases in the question
- **Don't** assume the AI has opinions or feelings

### 4. Don't Skip Important Context

- **Don't** assume the AI knows your specific situation
- **Don't** forget to mention important constraints
- **Don't** omit key details that affect the response

### 5. Avoid Open-Ended Prompts Without Guidance

- **Don't** ask for unlimited creativity without boundaries
- **Don't** request extremely long responses without structure
- **Don't** expect perfect results without refinement

## Resources

1. [OpenAI's Prompt Engineering Guide](https://platform.openai.com/docs/guides/prompt-engineering)
2. [Anthropic's Claude Prompt Engineering](https://docs.anthropic.com/claude/docs/introduction-to-prompt-design)
3. [Prompt Engineering Institute](https://www.promptingguide.ai/)

Remember, prompt engineering is an iterative process. The more you practice and
refine your prompts, the better results you'll achieve. Start with clear,
specific instructions and don't be afraid to experiment with different
approaches!
