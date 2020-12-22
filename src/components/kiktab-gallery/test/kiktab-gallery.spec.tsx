import { newSpecPage } from '@stencil/core/testing';
import { KiktabGallery } from '../kiktab-gallery';

describe('kiktab-gallery', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [KiktabGallery],
      html: `<kiktab-gallery></kiktab-gallery>`,
    });
    expect(page.root).toEqualHtml(`
      <kiktab-gallery>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </kiktab-gallery>
    `);
  });
});
