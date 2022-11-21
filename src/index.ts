import { Hono } from "hono";
import { fetch_index, random, url } from "./avatar";
const app = new Hono();

app.get("/", async (c) => {
    const repo = "https://github.com/jacoblincool/avatars";
    const worker_repo = "https://github.com/jacoblincool/avatars-worker";

    const index = await fetch_index();
    const collections = Object.keys(index);
    const collection = collections[Math.floor(Math.random() * collections.length)];
    const image = await random();

    return c.html(
        `
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <link rel="icon" type="image/png" href="${image}">
        <meta property="og:image" content="${image}">
        <h1>Random Avatar</h1>
        <p>Hello! Try <a href="/random">/random</a> or <a href="/${collection}/random">/${collection}/random</a>!</p>
        <p>Go to <a href="${repo}" target="_blank">${repo}</a> for more details.</p>
        <a href="${image}" target="_blank"><img src="${image}"></a>
        <p>This page is powered by Cloudfare Workers and Hono. <a href="${worker_repo}" target="_blank">Source code is available on GitHub</a>.</p>
        <style>
            body { display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100vh; padding: 2rem; }
            a { color: royalblue; }
            img { max-width: 80vw; max-height: 80vh; border-radius: 25%; border: 2px solid lightgray; }
        </style>
        `,
    );
});
app.get("/random", async (c) => {
    const url = await random();
    if (c.req.query("json")) {
        return c.json({ url });
    }
    return c.redirect(url);
});
app.get("/:collection/random", async (c) => {
    const { collection } = c.req.param() as { collection: string };
    const url = await random(collection);
    if (c.req.query("json")) {
        return c.json({ url });
    }
    return c.redirect(url);
});
app.get("/:collection/:name", async (c) => {
    const { collection, name } = c.req.param() as { collection: string; name: string };
    return c.redirect(url(collection, name));
});

export default app;
