import { newE2EPage } from '@stencil/core/testing';

describe('kiktab-gallery', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<kiktab-gallery></kiktab-gallery>');

    const element = await page.find('kiktab-gallery');
    expect(element).toHaveClass('hydrated');
  });
});
