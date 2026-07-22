import { test, expect } from '@playwright/test';

test.describe('Game Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to home and start a game with default settings
    await page.goto('/');
    await page.getByRole('button', { name: 'Start spill' }).click();
    await expect(page).toHaveURL(/\/play/);
  });

  test('displays the score board', async ({ page }) => {
    await expect(page.getByText('Poeng')).toBeVisible();
    await expect(page.getByText('Oppgave')).toBeVisible();
  });

  test('displays a math problem with input field', async ({ page }) => {
    const answerInput = page.locator('input.answer-input');
    await expect(answerInput).toBeVisible();
    await expect(page.getByRole('button', { name: 'Send inn' })).toBeVisible();
  });

  test('can submit an answer via button', async ({ page }) => {
    const answerInput = page.locator('input.answer-input');
    await answerInput.fill('42');
    await page.getByRole('button', { name: 'Send inn' }).click();

    // Feedback should appear (either correct or incorrect)
    const feedback = page.locator('.feedback');
    await expect(feedback).toBeVisible();
  });

  test('can submit an answer via Enter key', async ({ page }) => {
    const answerInput = page.locator('input.answer-input');
    await answerInput.fill('42');
    await answerInput.press('Enter');

    // Feedback should appear
    const feedback = page.locator('.feedback');
    await expect(feedback).toBeVisible();
  });

  test('shows next button or acknowledge button after answering', async ({ page }) => {
    const answerInput = page.locator('input.answer-input');
    await answerInput.fill('42');
    await page.getByRole('button', { name: 'Send inn' }).click();

    // Either "Neste oppgave" (correct answer) or "Fortsett" (incorrect) should appear
    const nextBtn = page.getByRole('button', { name: /Neste oppgave/ });
    const ackBtn = page.getByRole('button', { name: 'Fortsett' });

    const nextVisible = await nextBtn.isVisible();
    const ackVisible = await ackBtn.isVisible();
    expect(nextVisible || ackVisible).toBeTruthy();
  });

  test('has a link back to home', async ({ page }) => {
    await expect(page.getByRole('link', { name: '← Tilbake hjem' })).toBeVisible();
    await page.getByRole('link', { name: '← Tilbake hjem' }).click();
    await expect(page).toHaveURL(/\/$/);
  });

  test('navigates to results after completing all problems', async ({ page }) => {
    // Start with only 5 problems for faster testing
    await page.goto('/');
    await page.getByRole('button', { name: '5 oppgaver' }).click();
    await page.getByRole('button', { name: 'Start spill' }).click();
    await expect(page).toHaveURL(/\/play/);

    // Answer all 5 problems (just submit any answer each time)
    for (let i = 0; i < 5; i++) {
      const answerInput = page.locator('input.answer-input');
      await answerInput.fill('1');
      await page.getByRole('button', { name: 'Send inn' }).click();

      // Wait for feedback
      await expect(page.locator('.feedback')).toBeVisible();

      // If incorrect, click "Fortsett" first
      const ackBtn = page.getByRole('button', { name: 'Fortsett' });
      if (await ackBtn.isVisible()) {
        await ackBtn.click();
      }

      // Click "Neste oppgave" or "Se resultater"
      await page.getByRole('button', { name: /Neste oppgave|Se resultater/ }).click();
    }

    // Should navigate to results page
    await expect(page).toHaveURL(/\/results/);
  });
});
