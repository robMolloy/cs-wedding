import { Component, Host, Prop, h } from '@stencil/core';
import { css } from '../../utils/cssUtils';

@Component({
  tag: 'daisy-card',
})
export class DaisyCard {
  @Prop() heading?: string;
  render() {
    return (
      <Host>
        <div
          class="card bg-base-100"
          style={css({
            width: '100%',
            height: '100%',
            maxHeight: '100%',
            boxShadow: '7px 7px 13px rgba(0, 0, 0, 0.6)',
            overflow: 'scroll',
          })}
        >
          <div class="card-body">
            {this.heading && <h2 class="card-title">{this.heading}</h2>}
            <slot></slot>
          </div>
        </div>
      </Host>
    );
  }
}
