const {chromium}=require('playwright');
const fs=require('node:fs/promises');
const assert=require('node:assert/strict');
(async()=>{
 await fs.mkdir('test-results',{recursive:true});
 const browser=await chromium.launch({args:['--enable-unsafe-swiftshader']});
 const context=await browser.newContext({viewport:{width:1440,height:1050},recordVideo:{dir:'test-results/video',size:{width:1280,height:932}}});
 const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 try {
  await page.goto('http://127.0.0.1:4173/portrait-study/',{waitUntil:'networkidle'});
  await page.locator('#portrait[data-ready="true"]').waitFor();
  await page.screenshot({path:'test-results/character-front.png'});
  const r=await page.locator('#portrait').boundingBox();
  const samples=[];
  for(let i=0;i<=16;i++) {
   await page.mouse.move(r.x+r.width*(.1+.8*i/16),r.y+r.height*.36);
   await page.waitForTimeout(75);
   samples.push(Number(await page.locator('#portrait').getAttribute('data-yaw')));
  }
  assert.ok(new Set(samples.map(v=>v.toFixed(3))).size>12,'Head yaw must have many intermediate angles');
  await page.waitForTimeout(400);await page.screenshot({path:'test-results/character-right.png'});
  await page.mouse.move(40,120);await page.waitForTimeout(900);await page.screenshot({path:'test-results/character-left.png'});
  let blink=false;
  for(let i=0;i<90;i++) {if(Number(await page.locator('#portrait').getAttribute('data-blink'))>.7)blink=true;await page.waitForTimeout(70);}
  assert.ok(blink,'An automatic blink must occur');
  await page.getByRole('button',{name:'Pause motion',exact:true}).click();
  assert.equal(await page.locator('#portrait').getAttribute('data-paused'),'true');
  await page.reload({waitUntil:'networkidle'});await page.locator('#portrait[data-ready="true"]').waitFor();
  assert.equal(await page.locator('#portrait').getAttribute('data-paused'),'true');
  await page.getByRole('button',{name:'Play motion',exact:true}).click();
  await page.setViewportSize({width:390,height:844});
  await page.locator('#portrait').scrollIntoViewIfNeeded();await page.waitForTimeout(500);
  const metrics=await page.evaluate(()=>({inner:innerWidth,scroll:document.documentElement.scrollWidth}));
  await page.screenshot({path:'test-results/character-mobile.png'});
  assert.ok(metrics.scroll<=metrics.inner+1,'Mobile must not overflow: '+JSON.stringify(metrics));
  await page.emulateMedia({reducedMotion:'reduce'});await page.getByRole('button',{name:'Reduced motion'}).waitFor();
  assert.equal(await page.locator('#portrait').getAttribute('data-paused'),'true');
  await page.setViewportSize({width:320,height:740});
  await page.locator('#portrait').scrollIntoViewIfNeeded();
  const narrow=await page.evaluate(()=>({inner:innerWidth,scroll:document.documentElement.scrollWidth}));
  assert.ok(narrow.scroll<=narrow.inner+1,'Narrow layout must fit: '+JSON.stringify(narrow));
  assert.deepEqual(errors,[]);
  await fs.writeFile('test-results/results.json',JSON.stringify({errors,yawSamples:samples,blinkObserved:blink,mobile:metrics},null,2));
  console.log('PASS: continuous head motion, automatic blinking, pause persistence, mobile layout, reduced motion.');
 } finally {await context.close();await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
