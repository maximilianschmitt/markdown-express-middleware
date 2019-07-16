const fs = require("fs");
const path = require("path");
const marked = require("marked");
const cheerio = require("cheerio");
const express = require("express");

const CSS = fs.readFileSync(require.resolve("github-markdown-css"), "utf8");

marked.setOptions({ gfm: true });

function mdem(filepath, { title = path.basename(filepath) } = {}) {
  filepath = path.resolve(process.cwd(), filepath);
  const app = express();
  const markdown = fs.readFileSync(filepath, "utf8");
  const html = marked(markdown);
  const $ = cheerio.load(html);
  const imageSrc = $("img")
    .toArray()
    .map(img => img.attribs.src)
    .filter(src => /^\.\//.test(src))
    .map(src => "/" + src.replace(/^\.\//, ""));

  if (imageSrc.length) {
    app.get(imageSrc, (req, res) => {
      const imgPath = path.relative(path.dirname(filepath), req.path.slice(1));
      fs.createReadStream(imgPath).pipe(res);
    });
  }

  app.get("/", function(req, res) {
    res.status(200).send(`
      <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta http-equiv="X-UA-Compatible" content="ie=edge" />
                <title>${title}</title>
                <style>${CSS}</style>
                <style>
                    body {
                        text-align: center;
                    }

                    .markdown-body {
                        max-width: 700px;
                        margin: 0 auto;
                        text-align: left;
                    }
                </style>
            </head>
            <body>
                <div class="markdown-body">${html}</div>
            </body>
        </html>
      `);
  });

  return app;
}

module.exports = mdem;
