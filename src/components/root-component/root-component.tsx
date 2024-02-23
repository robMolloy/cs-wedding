import { Component, Host, h } from '@stencil/core';
import { css } from '../../utils/cssUtils';
// import { css } from '../../utils/cssUtils';

@Component({
  tag: 'root-component',
})
export class RootComponent {
  render() {
    return (
      <Host>
        <main class="bg-neutral-content" style={css({ height: '100vh', padding: '10px' })}>
          <div style={css({ height: '100%', width: '600px', maxWidth: '100%', margin: '0 auto' })}>
            <daisy-card></daisy-card>
          </div>
        </main>
      </Host>
    );
  }
}
