---
title: "Global Giants and European Leaders Blocking OpenAI's Bot"
description: "A look at the major websites, including European and Dutch companies, that are blocking OpenAI's GPTBot and why they are doing it."
createdDate: "2025-10-29"
pubDate: "2025-10-29"
status: "published"
readTime: 6
layout: "../../../layouts/BlogArticle.astro"
lastChecked: "2025-10-29"
---

OpenAI's GPTBot, a web crawler used by OpenAI to collect web content for model development, has been blocked by a number of major websites. Site operators cite concerns such as content scraping, data privacy, and control over how their content is used. The situation is evolving quickly; this post summarises reported blocks and how they were verified. See the "Resources & evidence" section for links to robots.txt excerpts and coverage.

Note: Claims below are based on publicly available sources (robots.txt entries or news coverage). Where possible, verify the linked evidence yourself — robots.txt files can change, and statements may be updated.

### 1. The New York Times
The New York Times is widely reported to have restricted access to certain crawlers to protect premium content. [Evidence: robots.txt / news coverage — see Resources & evidence]

### 2. Amazon
Amazon has taken steps to limit automated scraping of product data and reviews; reports indicate they have rules preventing some crawlers. [Evidence: robots.txt / news coverage — see Resources & evidence]

### 3. Pinterest
Pinterest, which hosts large amounts of user-generated images, has implemented restrictions reported to affect some automated crawlers. [Evidence: robots.txt / news coverage — see Resources & evidence]

### 4. Indeed
Indeed, a major job search platform, has measures to protect listings and user data from automated harvesting. [Evidence: robots.txt / news coverage — see Resources & evidence]

### 5. USA Today
USA Today has been reported to take steps to prevent automated copying of its articles. [Evidence: robots.txt / news coverage — see Resources & evidence]

### 6. Wired
Wired has protections in place to limit automated access to its content, according to public records. [Evidence: robots.txt / news coverage — see Resources & evidence]

### 7. Stack Exchange
Stack Exchange has previously restricted some crawlers and changed policies around content reuse. Verify current status via their robots.txt or official posts. [Evidence: robots.txt / meta.stackoverflow posts — see Resources & evidence]

### 8. WebMD
WebMD has protections for its copyrighted health content; reports suggest restrictions on automated scraping. [Evidence: robots.txt / news coverage — see Resources & evidence]

### 9. Quora
Quora has taken measures to limit automated copying of user-generated content; check their robots.txt and policy pages for details. [Evidence: robots.txt / policy pages — see Resources & evidence]

### European outlets reported to restrict GPTBot
- The Guardian (UK) — reported to restrict some crawlers. [Evidence: robots.txt / coverage]
- MailOnline (UK) — reported restrictions. [Evidence: robots.txt / coverage]
- BBC (UK) — reported to have blocked specific OpenAI crawlers in robots.txt. [Evidence: https://www.bbc.co.uk/robots.txt and coverage]
- OK Diario (Spain) — reported restriction. [Evidence: robots.txt / coverage]
- BFM TV (France) — reported restriction. [Evidence: robots.txt / coverage]

### The Dutch perspective
At the time this article was last checked (2025-10-29), a review of popular Dutch sites such as Bol.com, ah.nl, and Buienradar did not show explicit blocks of OpenAI's GPTBot in their robots.txt files. These checks are time-sensitive; revisit the robots.txt files for the latest status.

### How to verify if a site blocks GPTBot
- Visit https://<site>/robots.txt and look for lines like:

  User-agent: GPTBot
  Disallow: /

- If you find an explicit User-agent: GPTBot entry that disallows access, that indicates the site requests the crawler not access the site. Note that robots.txt is a voluntary standard and not an enforcement mechanism.

### Conclusion
A number of high-profile websites have publicly indicated or been reported to restrict automated crawlers, including those associated with some AI developers. Because this is an active and changing situation, add "lastChecked" timestamps and link to primary evidence when making claims.

---

## Resources & evidence (examples to verify)
- BBC robots.txt: https://www.bbc.co.uk/robots.txt
- Example robots.txt (check individual sites): https://<site>/robots.txt
- Guidance on robots.txt: https://www.robotstxt.org/