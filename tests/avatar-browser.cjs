// Run against a local static server: PORTFOLIO_URL=http://127.0.0.1:4173.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');

const base = process.env.PORTFOLIO_URL || 'http://127.0.0.1:4173';
const output = path.join(__dirname, '..', 'test-results');
let browser;
let passed = 0;

async function check(name, options, run) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1080 }, ...options });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  try {
    await run(page);
    assert.deepEqual(errors, [], 'No uncaught JavaScript errors');
    console.log('PASS ' + name);
    passed++;
  } catch (error) {
    await page.screenshot({ path: path.join(output, 'failure-' + name.replace(/\W+/g, '-') + '.png'), fullPage: false });
    throw error;
  } finally {
    await context.close();
  }
}

async function open(page, pathname = '/') {
  await page.goto(base + pathname, { waitUntil: 'networkidle' });
  await page.locator('.hero-name').waitFor();
  await page.waitForFunction(() => document.querySelector('.avatar-poster').naturalWidth > 0);
}

async function ready(page) {
  await page.locator('#avatar-stage[data-avatar-ready="true"]').waitFor();
}

async function pose(page, value) {
  await page.waitForFunction(value => document.getElementById('avatar-stage').dataset.pose === String(value), value);
}

async function noOverflow(page) {
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), 'No horizontal page overflow');
  const name = await page.locator('.hero-name').boundingBox();
  assert.ok(name.x >= 0 && name.x + name.width <= page.viewportSize().width + 1, 'Name fits viewport');
}

(async () => {
  await fs.mkdir(output, { recursive: true });
  assert.equal(await fs.readFile('index.html', 'utf8'), await fs.readFile('portfolio.html', 'utf8'), 'Both entry points match');
  browser = await chromium.launch();

  await check('desktop directions and pause persistence', {}, async page => {
    await open(page);
    await ready(page);
    await noOverflow(page);
    await page.screenshot({ path: path.join(output, 'desktop.png') });
    const rect = await page.locator('#avatar-stage').boundingBox();
    for (let row = -1; row <= 1; row++) {
      for (let column = -1; column <= 1; column++) {
        await page.mouse.move(rect.x + rect.width * (0.5 + column * 0.43), rect.y + rect.height * (0.43 + row * 0.36));
        await pose(page, (row + 1) * 3 + column + 1);
      }
    }
    await page.screenshot({ path: path.join(output, 'desktop-looking-down-right.png') });
    await page.getByRole('button', { name: 'Pause motion' }).click();
    await pose(page, 4);
    await page.mouse.move(10, 200);
    assert.equal(await page.locator('#avatar-stage').getAttribute('data-pose'), '4');
    await page.reload({ waitUntil: 'networkidle' });
    assert.equal(await page.locator('.avatar-hero').getAttribute('data-motion'), 'paused');
    assert.equal(await page.locator('#avatar-motion-toggle').getAttribute('aria-pressed'), 'true');
    await page.getByRole('button', { name: 'Play motion' }).focus();
    await page.keyboard.press('Enter');
    await ready(page);
    assert.equal(await page.locator('.avatar-hero').getAttribute('data-motion'), 'playing');
    await page.mouse.move(10, 200);
    await pose(page, 0);
  });

  await check('mobile taps and responsive layout', { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1 }, async page => {
    await open(page);
    await page.screenshot({ path: path.join(output, 'mobile-top.png') });
    await noOverflow(page);
    await page.locator('#avatar-stage').scrollIntoViewIfNeeded();
    await ready(page);
    const rect = await page.locator('#avatar-stage').boundingBox();
    await page.touchscreen.tap(rect.x + rect.width * 0.9, rect.y + rect.height * 0.5);
    await pose(page, 5);
    await page.locator('.avatar-hero').screenshot({ path: path.join(output, 'mobile-hero.png') });
    await page.getByRole('button', { name: 'Pause motion' }).tap();
    await pose(page, 4);
  });

  await check('tablet and narrow layouts', {}, async page => {
    await open(page);
    for (const width of [320, 768, 1024]) {
      await page.setViewportSize({ width, height: 1000 });
      await noOverflow(page);
      await page.screenshot({ path: path.join(output, 'width-' + width + '.png') });
    }
  });

  await check('reduced motion avoids atlas download', { reducedMotion: 'reduce' }, async page => {
    const atlasRequests = [];
    page.on('request', request => { if (request.url().includes('ritik-avatar-atlas')) atlasRequests.push(request.url()); });
    await open(page);
    assert.equal(await page.locator('.avatar-hero').getAttribute('data-motion'), 'paused');
    assert.equal(await page.getByRole('button', { name: 'Reduced motion' }).isDisabled(), true);
    await page.mouse.move(10, 200);
    assert.equal(await page.locator('#avatar-stage').getAttribute('data-pose'), '4');
    assert.deepEqual(atlasRequests, []);
    assert.equal(await page.locator('.avatar-poster').evaluate(element => getComputedStyle(element).opacity), '1');
  });

  await check('no JavaScript keeps the portrait and links', { javaScriptEnabled: false }, async page => {
    await open(page);
    assert.equal(await page.locator('#avatar-motion-toggle').isVisible(), false);
    assert.equal(await page.locator('.avatar-poster').evaluate(element => getComputedStyle(element).opacity), '1');
    assert.equal(await page.getByRole('link', { name: 'Explore my work' }).getAttribute('href'), '#projects');
    assert.equal(await page.getByRole('link', { name: "Let's talk" }).getAttribute('href'), '#contact');
  });

  await check('missing atlas keeps a usable static portrait', {}, async page => {
    await page.route('**/ritik-avatar-atlas.webp', route => route.abort());
    await open(page);
    assert.equal(await page.locator('#avatar-motion-toggle').isVisible(), false);
    assert.equal(await page.locator('.avatar-poster').evaluate(element => getComputedStyle(element).opacity), '1');
    assert.equal(await page.locator('#avatar-hint').textContent(), 'A little personality behind the projects.');
  });

  await check('project navigation and alternate entry point', {}, async page => {
    await open(page, '/portfolio.html');
    await page.getByRole('link', { name: 'Explore my work' }).click();
    await page.waitForURL(url => url.hash === '#projects');
    const linuxButton = page.locator('button[onclick="openProjectModal(\'server-monitor\')"]');
    await linuxButton.click();
    await page.locator('#project-modal.opacity-100').waitFor();
    assert.match(await page.locator('#modal-title').textContent(), /Linux/i);
    assert.match(await page.locator('#modal-action-btn').getAttribute('href'), /server-health-monitor/);
    await page.keyboard.press('Escape');
    await page.locator('#project-modal.opacity-0').waitFor();
  });

  console.log('All ' + passed + ' browser scenarios passed.');
})().catch(error => { console.error(error); process.exitCode = 1; }).finally(async () => { if (browser) await browser.close(); });
