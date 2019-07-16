# markdown-express-middleware

Express middleware to easily serve a markdown file with the GitHub-style CSS built in.

## Usage

```js
const express = require("express");
const mdem = require("./src");

const app = express();

app.use("/", mdem("README.md", { title: "markdown-express-middleware" }));

app.listen(3333);
```

![](./example.png)
