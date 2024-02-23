import { Component, Host, h } from '@stencil/core';
import { css } from '../../utils/cssUtils';

@Component({
  tag: 'daisy-card',
})
export class DaisyCard {
  render() {
    return (
      <Host>
        <div
          class="card bg-base-100"
          style={css({
            width: '100%',
            height: '100%',
            boxShadow: '7px 7px 13px rgba(0, 0, 0, 0.6)',
          })}
        >
          <div class="card-body">
            <h2 class="card-title">Shoes!</h2>
          </div>
          <slot></slot>
        </div>
      </Host>
    );
  }
}
