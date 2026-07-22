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
    const answerInput = page.locator('input.answer-input').first();
    await expect(answerInput).toBeVisible();
    await expect(page.getByRole('button', { name: 'Send inn' })).toBeVisible();
  });

  test('can submit an answer via button', async ({ page }) => {
    // Use whole-number-only problems to avoid fraction input complexity
    await page.goto('/');
    await page.locator('button.option-card').filter({ hasText: 'Brøk' }).click();
    await page.getByRole('button', { name: 'Start spill' }).click();
    await expect(page).toHaveURL(/\/play/);

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

  test('can submit an answer via Enter key', async ({ page }) => {
    // Use whole-number-only problems so Enter key works with a single input
    await page.goto('/');
    await page.locator('button.option-card').filter({ hasText: 'Brøk' }).click();
    await page.getByRole('button', { name: 'Start spill' }).click();
    await expect(page).toHaveURL(/\/play/);

    const answerInput = page.locator('input.answer-input');
    await answerInput.fill('42');
    await answerInput.press('Enter');

    // Either "Neste oppgave" (correct answer) or "Fortsett" (incorrect) should appear
    const nextBtn = page.getByRole('button', { name: /Neste oppgave/ });
    const ackBtn = page.getByRole('button', { name: 'Fortsett' });

    const nextVisible = await nextBtn.isVisible();
    const ackVisible = await ackBtn.isVisible();
    expect(nextVisible || ackVisible).toBeTruthy();
  });

  test('shows next button or acknowledge button after answering', async ({ page }) => {
    // Use whole-number-only problems to avoid fraction input complexity
    await page.goto('/');
    await page.locator('button.option-card').filter({ hasText: 'Brøk' }).click();
    await page.getByRole('button', { name: 'Start spill' }).click();
    await expect(page).toHaveURL(/\/play/);

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
    // Start with only 5 whole-number problems for faster testing
    await page.goto('/');
    await page.locator('button.option-card').filter({ hasText: 'Brøk' }).click();
    await page.getByRole('button', { name: '5 oppgaver' }).click();
    await page.getByRole('button', { name: 'Start spill' }).click();
    await expect(page).toHaveURL(/\/play/);

    // Answer all 5 problems (just submit any answer each time)
    for (let i = 0; i < 5; i++) {
      const answerInput = page.locator('input.answer-input');
      await answerInput.fill('1');
      await page.getByRole('button', { name: 'Send inn' }).click();

      // Wait for next/ack buttons to appear (more reliable than .feedback)
      await expect(
        page.getByRole('button', { name: /Neste oppgave|Fortsett/ })
      ).toBeVisible();

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

  test('can solve fraction problems with same denominator', async ({ page }) => {
    // Start with fraction-only problems at barneskole (same denominators)
    await page.goto('/');
    // Deselect Heltall to get only fraction problems
    await page.locator('button.option-card').filter({ hasText: 'Heltall' }).click();
    await page.getByRole('button', { name: '5 oppgaver' }).click();
    await page.getByRole('button', { name: 'Start spill' }).click();
    await expect(page).toHaveURL(/\/play/);

    // Fraction problems have two inputs: numerator (Teller) and denominator (Nevner)
    for (let i = 0; i < 5; i++) {
      const numerator = page.getByPlaceholder('Teller');
      const denominator = page.getByPlaceholder('Nevner');

      // Fill both numerator and denominator, then submit
      await numerator.fill('1');
      await denominator.fill('2');
      await page.getByRole('button', { name: 'Send inn' }).click();

      // Wait for next/ack buttons to appear
      await expect(
        page.getByRole('button', { name: /Neste oppgave|Fortsett/ })
      ).toBeVisible();

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

  test('shows correct answer in feedback for wrong fraction answer', async ({ page }) => {
    // Start with fraction-only problems at barneskole (same denominators)
    await page.goto('/');
    await page.locator('button.option-card').filter({ hasText: 'Heltall' }).click();
    await page.getByRole('button', { name: '5 oppgaver' }).click();
    await page.getByRole('button', { name: 'Start spill' }).click();
    await expect(page).toHaveURL(/\/play/);

    // Enter a deliberately wrong answer (0/1)
    await page.getByPlaceholder('Teller').fill('0');
    await page.getByPlaceholder('Nevner').fill('1');
    await page.getByRole('button', { name: 'Send inn' }).click();

    // Check that the incorrect feedback is shown with the correct answer
    await expect(page.getByText(/Feil! Svaret var/)).toBeVisible();
    // The correct answer should be displayed as either a fraction (.fraction) or a strong element
    const feedbackEl = page.locator('.feedback.incorrect');
    const hasFractionDisplay = await feedbackEl.locator('.fraction').count();
    const hasStrongDisplay = await feedbackEl.locator('strong').count();
    expect(hasFractionDisplay + hasStrongDisplay).toBeGreaterThan(0);
  });

  test('shows correct answer in feedback for wrong equation answer', async ({ page }) => {
    // Start with equation-only problems at ungdomskole
    await page.goto('/');
    // Switch to ungdomskole to enable equations
    await page.getByRole('button', { name: 'Ungdomskole' }).click();
    // Deselect Heltall and Brøk, then select Likninger
    await page.locator('button.option-card').filter({ hasText: 'Heltall' }).click();
    await page.locator('button.option-card').filter({ hasText: 'Brøk' }).click();
    await page.locator('button.option-card').filter({ hasText: 'Likninger' }).click();
    await page.getByRole('button', { name: '5 oppgaver' }).click();
    await page.getByRole('button', { name: 'Start spill' }).click();
    await expect(page).toHaveURL(/\/play/);

    // Enter a deliberately wrong answer (0)
    const answerInput = page.locator('input.answer-input');
    await answerInput.fill('0');
    await page.getByRole('button', { name: 'Send inn' }).click();

    // Check that the incorrect feedback is shown with the correct answer
    await expect(page.getByText(/Feil! Svaret var/)).toBeVisible();
    // The correct answer should be displayed as a strong element
    const feedbackEl = page.locator('.feedback.incorrect');
    const hasStrongDisplay = await feedbackEl.locator('strong').count();
    expect(hasStrongDisplay).toBeGreaterThan(0);
    // The strong element should contain a number (not empty)
    const strongText = await feedbackEl.locator('strong').first().textContent();
    expect(strongText).toMatch(/\d/);
  });
});
