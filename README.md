# crockerjadam.com — personal portfolio

Static portfolio site for Adam Crocker.

**Stack:** Plain HTML + CSS + JS. No build step. Deploys directly to AWS Amplify.

## Structure

```
.
├── index.html              single-page portfolio
├── assets/
│   ├── styles.css
│   ├── main.js
│   ├── favicon.svg
│   ├── portrait.{jpg,webp}        720px headshot
│   ├── portrait@2x.{jpg,webp}     1440px retina headshot
│   └── Adam_Crocker_Resume.pdf    linked from nav + hero + contact
├── amplify.yml             Amplify build spec (static, no build step)
└── README.md
```

## Local preview

```bash
python3 -m http.server 5173
# open http://localhost:5173
```

## Deploy

Connected to AWS Amplify via GitHub (`captcrock/Portfolio`). Every push to `main` triggers a build.
Custom domain `crockerjadam.com` is served via Route 53 + Amplify.

## Notes

- Fonts: Space Grotesk + Instrument Serif + JetBrains Mono (Google Fonts)
- Theme: midnight + electric cyan/violet gradient
- No tracking, no analytics, no cookies
