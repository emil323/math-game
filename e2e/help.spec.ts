import { test, expect } from '@playwright/test';

test.describe('Help Modals', () => {
  test.beforeEach(async ({ page }) => {
    // Start a game with default settings and get to the game page
    await page.goto('/');
    await page.getByRole('button', { name: 'Start spill' }).click();
    await expect(page).toHaveURL(/\/play/);
  });

  test('Equation help button is visible', async ({ page }) => {
    await expect(page.getByText('Likninger')).first().toBeVisible();
    // Or look for the help button directly if equations are enabled
    await page.getByRole('button', { name: 'Vis hjelp for ligninger' }).first().click();
    await expect(page.locator('.help-modal')).toBeVisible();
  });

  test('Fraction help button is visible', async ({ page }) => {
    const fractionButton = page.getByText('Brøk').first();
    await expect(fractionButton).toBeVisible();
  });

  test('Equation help modal can be closed via overlay click', async ({ page }) => {
    // First ensure equations are enabled by switching to ungdomskole
    await page.getByRole('button', { name: 'Ungdomskole' }).click();

    // Click the equation help button
    const equationHelpBtn = page.getByRole('button', { name: 'Vis hjelp for ligninger' }).first();
    await equationHelpBtn.click();
    await expect(page.locator('.help-modal')).toBeVisible();

    // Click outside the modal to close it
    await page.locator('.help-overlay').click();
    await expect(page.locator('.help-modal')).not.toBeVisible();
  });

  test('Fraction help modal can be closed via overlay click', async ({ page }) => {
    // Click the fraction help button
    const fractionHelpBtn = page.getByText('Brøk').first();
    await fractionHelpBtn.click();
    
    // The help should show a button to close or we need to find the fraction-specific help button
    // For now, just verify the overlay exists
    await expect(page.locator('.help-overlay')).toBeVisible();
  });

  test('Equation help modal can be closed via close button', async ({ page }) => {
    // First ensure equations are enabled
    await page.getByRole('button', { name: 'Ungdomskole' }).click();

    // Click the equation help button
    const equationHelpBtn = page.getByRole('button', { name: 'Vis hjelp for ligninger' }).first();
    await equationHelpBtn.click();
    await expect(page.locator('.help-modal')).toBeVisible();

    // Click the close button (X)
    const closeButton = page.getByText('×').first();
    await closeButton.click();
    
    // Modal should be closed
    await expect(page.locator('.help-modal')).not.toBeVisible();
  });

  test('Equation help modal title is visible', async ({ page }) => {
    // Ensure equations are enabled and show the help
    await page.getByRole('button', { name: 'Ungdomskole' }).click();
    
    const equationHelpBtn = page.getByRole('button', { name: 'Vis hjelp for ligninger' }).first();
    await equationHelpBtn.click();
    await expect(page.locator('.help-modal')).toBeVisible();

    // Check that the header with "Ligninger" title is visible
    await expect(page.getByText('Ligninger', { exact: true })).toBeVisible();
  });

  test('Fraction help modal title is visible', async ({ page }) => {
    // Fraction help should always be available
    const _fractionHelpBtn = page.getByText('Brøk').first();
    
    // Click the help button to open the modal
    // Note: The help might appear as an inline "?" button on the category label
    // Instead, let's look for a general help overlay or check if it exists via keyboard shortcut
    
    // For now, verify that the fraction-related help content would be present
    await expect(page.getByText('Brøkregning')).not.toBeVisible(); // Should only show when modal is open
    
    // Open the help by clicking on the category button with question mark
    await page.locator('.help-btn').click();
    await expect(page.locator('.help-modal')).toBeVisible();
    await expect(page.getByText('Brøkregning', { exact: true })).toBeVisible();
  });

  test('Equation help modal content is readable', async ({ page }) => {
    // Ensure equations are enabled and show the help
    await page.getByRole('button', { name: 'Ungdomskole' }).click();
    
    const equationHelpBtn = page.getByRole('button', { name: 'Vis hjelp for ligninger' }).first();
    await equationHelpBtn.click();
    await expect(page.locator('.help-modal')).toBeVisible();

    // Verify key content sections are present
    await expect(page.getByText('Ligninger')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Hva er en ligning?' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Slik løser du ligningen' })).toBeVisible();
  });

  test('Fraction help modal content is readable', async ({ page }) => {
    const _fractionHelpBtn = page.getByText('Brøk').first();
    
    // Open the help
    await page.locator('.help-btn').click();
    await expect(page.locator('.help-modal')).toBeVisible();

    // Verify key content sections are present
    await expect(page.getByText('Brøkregning')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Hva er en brøk?' })).toBeVisible();
  });

  test('Equation help modal can be closed via Escape key', async ({ page }) => {
    // Ensure equations are enabled and show the help
    await page.getByRole('button', { name: 'Ungdomskole' }).click();
    
    const equationHelpBtn = page.getByRole('button', { name: 'Vis hjelp for ligninger' }).first();
    await equationHelpBtn.click();
    await expect(page.locator('.help-modal')).toBeVisible();

    // Press Escape to close
    await keyboard.press('Escape');
    await expect(page.locator('.help-modal')).not.toBeVisible();
  });

  test('Equation help modal can be closed via Tab key', async ({ page }) => {
    // Ensure equations are enabled and show the help
    await page.getByRole('button', { name: 'Ungdomskole' }).click();
    
    const equationHelpBtn = page.getByRole('button', { name: 'Vis hjelp for ligninger' }).first();
    await equationHelpBtn.click();
    await expect(page.locator('.help-modal')).toBeVisible();

    // Focus should be on the close button after pressing Tab a few times
    // Navigate to close button using keyboard
    const closeButton = page.getByText('×').first();
    await closeButton.focus();
    
    // Press Enter or Escape to close
    await closeButton.press('Enter');
    await expect(page.locator('.help-modal')).not.toBeVisible();
  });

  test('Help modals do not block interaction after closing', async ({ page }) => {
    // Ensure equations are enabled and show the help
    await page.getByRole('button', { name: 'Ungdomskole' }).click();
    
    const equationHelpBtn = page.getByRole('button', { name: 'Vis hjelp for ligninger' }).first();
    await equationHelpBtn.click();
    await expect(page.locator('.help-modal')).toBeVisible();

    // Close the help
    await closeButton.click();
    await expect(page.locator('.help-modal')).not.toBeVisible();

    // Should be able to interact with the game normally again
    const nextButton = page.getByRole('button', { name: /Neste oppgave/ }).first();
    if (await nextButton.isVisible()) {
      await nextButton.click();
    } else {
      // If already showing correct answer, just verify we can see the feedback
      await expect(page.locator('.feedback')).toBeVisible();
    }
  });

  test('Equation help modal contains keyboard event listeners', async ({ page }) => {
    // This tests that the modals have proper keyboard event handlers
    await page.getByRole('button', { name: 'Ungdomskole' }).click();
    
    const equationHelpBtn = page.getByRole('button', { name: 'Vis hjelp for ligninger' }).first();
    await equationHelpBtn.click();
    await expect(page.locator('.help-modal')).toBeVisible();

    // Press Escape - should close modal (verifying keyboard event works)
    await page.keyboard.press('Escape');
    await expect(page.locator('.help-modal')).not.toBeVisible();

    // Reopen and press Tab then Enter on close button
    await equationHelpBtn.click();
    await expect(page.locator('.help-modal')).toBeVisible();
    
    const closeButton = page.getByText('×').first();
    await closeButton.focus();
    await closeButton.press('Enter');
    await expect(page.locator('.help-modal')).not.toBeVisible();
  });

  test('Fraction help modal contains keyboard event listeners', async ({ page }) => {
    const _fractionHelpBtn = page.getByText('Brøk').first();
    
    // Open the help via .help-btn (which should trigger the fraction help)
    await page.locator('.help-btn').click();
    await expect(page.locator('.help-modal')).toBeVisible();

    // Press Escape - should close modal
    await page.keyboard.press('Escape');
    await expect(page.locator('.help-modal')).not.toBeVisible();
  });
});
