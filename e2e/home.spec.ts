import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('displays the home page with correct title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle('Math Game');
    await expect(page.getByRole('heading', { name: '🧮 Regnespill' })).toBeVisible();
  });

  test('defaults to barneskole difficulty', async ({ page }) => {
    await page.goto('/');
    const activeTab = page.getByRole('button', { name: 'Barneskole' }).first();
    await expect(activeTab).toHaveClass(/active/);
  });

  test('can switch difficulty levels', async ({ page }) => {
    await page.goto('/');

    // Switch to ungdomskole
    await page.getByRole('button', { name: 'Ungdomskole' }).click();
    await expect(page.getByRole('button', { name: 'Ungdomskole' })).toHaveClass(/active/);

    // Switch to videregående
    await page.getByRole('button', { name: 'Videregående' }).click();
    await expect(page.getByRole('button', { name: 'Videregående' })).toHaveClass(/active/);
  });

  test('equation category is only available at ungdomskole and above', async ({ page }) => {
    await page.goto('/');

    // At barneskole, equation should not be visible
    await expect(page.getByRole('button', { name: 'Likninger' })).not.toBeVisible();

    // Switch to ungdomskole
    await page.getByRole('button', { name: 'Ungdomskole' }).click();
    await expect(page.getByRole('button', { name: 'Likninger' })).toBeVisible();
  });

  test('can toggle problem categories', async ({ page }) => {
    await page.goto('/');

    // Toggle Heltall off
    await page.getByRole('button', { name: 'Heltall' }).click();
    await expect(page.getByRole('button', { name: 'Heltall' })).not.toHaveClass(/selected/);

    // Toggle Heltall back on
    await page.getByRole('button', { name: 'Heltall' }).click();
    await expect(page.getByRole('button', { name: 'Heltall' })).toHaveClass(/selected/);
  });

  test('can select problem count', async ({ page }) => {
    await page.goto('/');

    // Default should be 10
    await expect(page.getByRole('button', { name: '10 oppgaver' })).toHaveClass(/selected/);

    // Switch to 5
    await page.getByRole('button', { name: '5 oppgaver' }).click();
    await expect(page.getByRole('button', { name: '5 oppgaver' })).toHaveClass(/selected/);

    // Switch to 20
    await page.getByRole('button', { name: '20 oppgaver' }).click();
    await expect(page.getByRole('button', { name: '20 oppgaver' })).toHaveClass(/selected/);
  });

  test('start button is disabled when no categories selected', async ({ page }) => {
    await page.goto('/');

    // Deselect all categories
    await page.getByRole('button', { name: 'Heltall' }).click();
    await page.getByRole('button', { name: 'Brøk' }).click();

    await expect(page.getByRole('button', { name: 'Start spill' })).toBeDisabled();
  });

  test('navigates to game page on start', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Start spill' }).click();
    await expect(page).toHaveURL(/\/play/);
  });

  test('game page URL includes selected options', async ({ page }) => {
    await page.goto('/');

    // Select ungdomskole difficulty
    await page.getByRole('button', { name: 'Ungdomskole' }).click();

    // Select 5 problems
    await page.getByRole('button', { name: '5 oppgaver' }).click();

    // Start game
    await page.getByRole('button', { name: 'Start spill' }).click();

    await expect(page).toHaveURL(/difficulty=ungdomskole/);
    await expect(page).toHaveURL(/count=5/);
  });
});
