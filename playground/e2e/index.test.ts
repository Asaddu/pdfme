import { test, expect, Page } from '@playwright/test';
import { pdf2img } from '@pdfme/converter';

const viewport = { width: 1366, height: 768 };

async function generatePdf(page: Page): Promise<Buffer> {
  await page.click('#generate-pdf');

  // Wait for new tab with blob URL
  const newPage = await page.context().waitForEvent('page', {
    predicate: (page) => page.url().startsWith('blob:'),
    timeout: 40000,
  });

  await newPage.setViewportSize(viewport);
  await newPage.bringToFront();
  await newPage.waitForLoadState('networkidle');

  const pdfArray = await newPage.evaluate(async () => {
    const response = await fetch(location.href);
    const buffer = await response.arrayBuffer();
    return Array.from(new Uint8Array(buffer));
  });

  const pdfBuffer = Buffer.from(pdfArray);

  await newPage.close();
  await page.bringToFront();
  return pdfBuffer;
}

async function pdfToImages(pdf: Buffer): Promise<Buffer[]> {
  const arrayBuffer = pdf.buffer.slice(pdf.byteOffset, pdf.byteOffset + pdf.byteLength);
  const arrayBuffers = await pdf2img(arrayBuffer, { imageType: 'png' });
  return arrayBuffers.map((buf) => Buffer.from(new Uint8Array(buf)));
}

test.describe('Playground E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(viewport);
    // Block ad domains
    await page.route('https://media.ethicalads.io/**', (route) => route.abort());
  });

  test('should select Invoice template and compare PDF snapshot', async ({ page }) => {
    // 1. Navigate to templates list & click on Invoice template
    await page.goto('/templates');
    await page.waitForSelector('#template-img-invoice', { timeout: 40000 });
    await page.click('#template-img-invoice');

    // 2. Check that "INVOICE" text is present
    await page.waitForFunction(
      () => {
        const container = document.querySelector('div.flex-1.w-full');
        return container ? container.textContent?.includes('INVOICE') : false;
      },
      { timeout: 40000 }
    );

    // 3. Screenshot & compare
    await expect(page).toHaveScreenshot('invoice-designer.png', {
      maxDiffPixelRatio: 0.01,
    });

    // 4. Generate PDF & compare
    const pdfBuffer = await generatePdf(page);
    const pdfImages = await pdfToImages(pdfBuffer);

    for (let idx = 0; idx < pdfImages.length; idx++) {
      await expect(pdfImages[idx]).toMatchSnapshot(`invoice-pdf-page-${idx}.png`, {
        maxDiffPixelRatio: 0.01,
      });
    }
  });

  test('should select Pedigree template and compare PDF snapshot', async ({ page }) => {
    // 5. Navigate to template list screen
    await page.goto('/templates');

    // 6. Select Pedigree template
    await page.waitForSelector('#template-img-pedigree', { timeout: 40000 });
    await page.click('#template-img-pedigree');

    await page.waitForFunction(
      () => {
        const container = document.querySelector('div.flex-1.w-full');
        return container ? container.textContent?.includes('Pet Name') : false;
      },
      { timeout: 40000 }
    );

    // 7. Screenshot & compare
    await expect(page).toHaveScreenshot('pedigree-designer.png', {
      maxDiffPixelRatio: 0.01,
    });

    // 8. Generate PDF & compare
    const pdfBuffer = await generatePdf(page);
    const pdfImages = await pdfToImages(pdfBuffer);

    for (let idx = 0; idx < pdfImages.length; idx++) {
      await expect(pdfImages[idx]).toMatchSnapshot(`pedigree-pdf-page-${idx}.png`, {
        maxDiffPixelRatio: 0.01,
      });
    }
  });

  test('should modify template, generate PDF and compare, then input form data', async ({
    page,
  }) => {
    // Navigate to home page
    await page.goto('/');

    // 9. Press Reset button
    await page.click('#reset-template');

    // 10. Add elements by clicking on toolbar buttons
    // These clicks simulate the templateCreationRecord operations
    // Click on various toolbar buttons to add elements
    await page.click('div.flex-1 > div > div > div:nth-of-type(1) > div:nth-of-type(1) button');
    await page.click('div.flex-1 > div > div > div:nth-of-type(1) > div:nth-of-type(3) button');
    await page.click('div:nth-of-type(7) button');
    await page.click('div > div:nth-of-type(1) > div:nth-of-type(10) button');
    await page.click('div:nth-of-type(14) button');
    await page.click('div > div:nth-of-type(1) > div:nth-of-type(15) button');
    await page.click('div:nth-of-type(16) button');

    // 11. Screenshot & compare
    await expect(page).toHaveScreenshot('modified-template-designer.png', {
      maxDiffPixelRatio: 0.01,
    });

    // 12. Generate PDF & compare
    let pdfBuffer = await generatePdf(page);
    let pdfImages = await pdfToImages(pdfBuffer);

    for (let idx = 0; idx < pdfImages.length; idx++) {
      await expect(pdfImages[idx]).toMatchSnapshot(`modified-template-pdf-page-${idx}.png`, {
        maxDiffPixelRatio: 0.01,
      });
    }

    // 13. Save locally
    await page.click('#save-local');

    // 14. Move to form viewer
    await page.click('#form-viewer-nav');
    await page.waitForFunction(
      () => {
        const container = document.querySelector('div.flex-1.w-full');
        return container ? container.textContent?.includes('Type Something...') : false;
      },
      { timeout: 40000 }
    );

    // 15. Input form data (simulating formInputRecord operations)
    // Click on text field and enter text
    await page.click('text=Type Something...');
    await page.keyboard.press('ControlOrMeta+a');
    await page.fill('[id*="text-"]', 'Test!');

    // Click + button to add
    await page.click('button:has-text("+")');

    // Fill URL input
    const urlInput = page.locator('input[placeholder*="https://"]').first();
    if (await urlInput.isVisible()) {
      await urlInput.click();
      await urlInput.press('ControlOrMeta+a');
      await urlInput.fill('A');
    }

    // Select dropdown option
    const selectElement = page.locator('select').first();
    if (await selectElement.isVisible()) {
      await selectElement.selectOption('option2');
    }

    // Click checkbox elements
    const checkboxes = page.locator('input[type="checkbox"]');
    const checkboxCount = await checkboxes.count();
    if (checkboxCount > 0) {
      await checkboxes.first().click();
    }
    if (checkboxCount > 1) {
      await checkboxes.nth(1).click();
    }

    // 16. Generate PDF & compare
    pdfBuffer = await generatePdf(page);
    pdfImages = await pdfToImages(pdfBuffer);

    for (let idx = 0; idx < pdfImages.length; idx++) {
      await expect(pdfImages[idx]).toMatchSnapshot(`final-form-pdf-page-${idx}.png`, {
        maxDiffPixelRatio: 0.01,
      });
    }
  });
});
