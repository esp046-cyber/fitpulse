import AxeBuilder from '@axe-core/playwright';
import {test,expect} from '@playwright/test';
test('navigation, workout completion and theme',async({page})=>{
 const errs=[];page.on('pageerror',e=>errs.push(e.message));await page.goto('/');
 await expect(page.getByRole('heading',{name:'Training'})).toBeVisible();
 await page.getByRole('button',{name:'Week 2'}).click();await page.getByRole('button',{name:'Mon'}).click();
 await expect(page.locator('svg.body').first()).toBeVisible();await expect(page.locator('.m.on').first()).toBeVisible();
 await page.locator('input[data-i="0"]').fill('60');await page.getByRole('button',{name:'Complete workout'}).click();
 await expect(page.getByRole('heading',{name:'Dashboard'})).toBeVisible();await expect(page.getByText('First workout')).toBeVisible();
 await page.getByRole('button',{name:/Settings/}).click();await page.selectOption('select[data-s="theme"]','contrast');
 await expect(page.locator('html')).toHaveAttribute('data-theme','contrast');expect(errs).toEqual([]);});
for(const t of ['light','dark','contrast'])test('visual '+t,async({page})=>{
 await page.addInitScript(x=>localStorage.setItem('fitpulse.v1',JSON.stringify({week:1,day:0,tab:'train',set:{theme:x,haptics:false}})),t);
 await page.goto('/');await page.waitForSelector('.m.on');await page.addStyleTag({content:'*{animation:none!important;transition:none!important}'});
 await expect(page).toHaveScreenshot(`train-${t}.png`,{maxDiffPixelRatio:.02});});

for(const t of ['light','dark','contrast'])test('wcag aa '+t,async({page})=>{
 await page.addInitScript(x=>localStorage.setItem('fitpulse.v1',JSON.stringify({week:1,day:0,tab:'train',set:{theme:x,haptics:false}})),t);
 await page.goto('/');await page.waitForSelector('.m.on');
 const r=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(r.violations).toEqual([]);});
