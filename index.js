const express = require("express");
const puppeteer = require("puppeteer");
const app = express();

let browser;

puppeteer
  .launch({ args: ["--no-sandbox"] })
  .then(
    (subject) => (browser = subject),
    (e) => console.error(e),
  );

const getPageHTML = async (url) => {
  const page = await browser.newPage();
  await page.goto(url, {waitUntil: 'networkidle0'});
  const html = await page.content();
  page.close();
  return html;
};


app.get("*", async (req, res, next) => {
  const url = `https://seoullatte.com${req.originalUrl}`;
  const start = new Date();

  try {
    const html = await getPageHTML(url);
    res
      .set(
        "Server-Timing",
        `Prerender;dur=${new Date() - start};desc="Headless render time (ms)"`,
      )
      .status(200)
      .send(html);
  } catch (e) {
    next(e);
  }
});

app.listen(80, () => console.log("port 80"));
