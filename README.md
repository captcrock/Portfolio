# crockeradam.com — personal portfolio

Static portfolio site for Adam Crocker.

**Stack:** Plain HTML + CSS + JS. No build step. Deploys directly to AWS Amplify.

## Structure

```
.
├── index.html         single-page portfolio
├── assets/
│   ├── styles.css
│   ├── main.js
│   └── favicon.svg
├── amplify.yml        Amplify build spec
└── README.md
```

## Local preview

```bash
python3 -m http.server 5173
# open http://localhost:5173
```

## Deploy

Connected to AWS Amplify via GitHub. Every push to `main` triggers a build.
Custom domain `crockeradam.com` is served via Route 53 + Amplify.

## Notes

- Fonts: Fraunces + JetBrains Mono (Google Fonts)
- Theme color: warm dark editorial (#0c0a09 / #d4a574)
- No tracking, no analytics, no cookies
