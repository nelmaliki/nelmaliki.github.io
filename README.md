# nelmaliki.github.io

This is a static site hosted through github pages. The static artifacts are generated by next.js via npm run build. /app contains the source code for this project. Every route for the website is a folder, where the top level of /app is the index page. Page.tsx is how to render the route.

The build process puts the static artifacts into the out directory. Github workflow actions compile the app into a /out directory and hosts the website with it. Do not check in /out.

First time only!
`npm install`

then for local development run `npx run dev` from the root directory.

To host locally - `npm run build` then `npx serve out`

For the LLM side of things to work, you will need to create a .env.local file and include this in it: GEMINI_API_KEY=YOUR_KEY_HERE
