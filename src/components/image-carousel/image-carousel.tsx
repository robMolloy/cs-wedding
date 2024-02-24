import { Component, Host, Prop, h } from '@stencil/core';
import { css } from '../../utils/cssUtils';
import { TImageData } from '../../types';

@Component({
  tag: 'image-carousel',
})
export class ImageCarousel {
  @Prop() imageDataGroup!: TImageData[];

  render() {
    return (
      <Host>
        <br />
        <div style={css({ textAlign: 'center' })}>{this.imageDataGroup[0].formattedDate}</div>
        <div class="carousel w-full" style={css({ flexDirection: 'row-reverse' })}>
          {[...this.imageDataGroup].reverse().map(imageData => (
            <div id={imageData.name} class="carousel-item w-full" key={`${imageData.name}-main-image`} style={css({ width: '100%' })}>
              <img src={imageData.downloadUrl} />
            </div>
          ))}
        </div>
        <div style={css({ display: 'flex', gap: '10px' })}>
          {this.imageDataGroup.map(imageData => (
            <a
              href={`#${imageData.name}`}
              key={`${imageData.name}-choose-image-button`}
              style={css({
                flex: '1',
                minHeight: '80px',
                backgroundImage: `url(${imageData.downloadUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              })}
            />
          ))}
        </div>
      </Host>
    );
  }
}
