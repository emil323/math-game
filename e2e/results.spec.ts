import { test, expect } from '@playwright/test';

test.describe('Results Page', () => {
  test('displays results heading', async ({ page }) => {
    await page.goto('/results?score=8&total=10&difficulty=barneskole&categories=whole,fraction');
    await expect(page.getByRole('heading', { name: 'Resultater' })).toBeVisible();
  });

  test('shows correct score breakdown', async ({ page }) => {
    await page.goto('/results?score=8&total=10&difficulty=barneskole&categories=whole,fraction');

    await expect(page.getByText('Riktige')).toBeVisible();
    await expect(page.getByText('Feil')).toBeVisible();
    await expect(page.getByText('Poengsum')).toBeVisible();
  });

  test('displays percentage score', async ({ page }) => {
    await page.goto('/results?score=8&total=10&difficulty=barneskole&categories=whole,fraction');
    await expect(page.getByText('80%')).toBeVisible();
  });

  test('shows perfect score message', async ({ page }) => {
    await page.goto('/results?score=10&total=10&difficulty=barneskole&categories=whole,fraction');
    await expect(page.getByText('Perfekt resultat')).toBeVisible();
  });

  test('shows great score message for 80%+', async ({ page }) => {
    await page.goto('/results?score=8&total=10&difficulty=barneskole&categories=whole,fraction');
    await expect(page.getByText('Flott jobbet')).toBeVisible();
  });

  test('shows good effort message for 60%+', async ({ page }) => {
    await page.goto('/results?score=6&total=10&difficulty=barneskole&categories=whole,fraction');
    await expect(page.getByText('God innsats')).toBeVisible();
  });

  test('shows encouragement message for below 60%', async ({ page }) => {
    await page.goto('/results?score=3&total=10&difficulty=barneskole&categories=whole,fraction');
    await expect(page.getByText('Hold ut')).toBeVisible();
  });

  test('displays difficulty label', async ({ page }) => {
    await page.goto('/results?score=8&total=10&difficulty=ungdomskole&categories=whole,fraction');
    await expect(page.getByText('Vanskelighetsgrad: Ungdomskole')).toBeVisible();
  });

  test('has "Spill igjen" link that navigates back to game', async ({ page }) => {
    await page.goto('/results?score=8&total=10&difficulty=barneskole&categories=whole,fraction');
    await page.getByRole('link', { name: 'Spill igjen' }).click();
    await expect(page).toHaveURL(/\/play/);
  });

  test('has home link', async ({ page }) => {
    await page.goto('/results?score=8&total=10&difficulty=barneskole&categories=whole,fraction');
    await expect(page.getByRole('link', { name: '← Hjem' })).toBeVisible();
    await page.getByRole('link', { name: '← Hjem' }).click();
    await expect(page).toHaveURL(/\/$/);
  });
});
