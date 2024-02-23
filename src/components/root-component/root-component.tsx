import { Component, Host, State, h } from '@stencil/core';
import { css } from '../../utils/cssUtils';

import { StorageReference, getDownloadURL, listAll, ref } from 'firebase/storage';
import { storage } from '../../config/firebaseConfig';
import dayjs from 'dayjs';

const getAllFileRefs = async () => {
  const listRef = ref(storage);

  const storageReferencesResponse: Promise<StorageReference[]> = new Promise((resolve, reject) => {
    listAll(listRef)
      .then(res => {
        resolve(res.items);
      })
      .catch(error => {
        // Uh-oh, an error occurred!
        reject(error);
      });
  });

  return storageReferencesResponse;
};

type TImageData = {
  name: string;
  formattedDate: string;
  groupId: string;
  downloadUrl: string;
};
@Component({
  tag: 'root-component',
})
export class RootComponent {
  @State() status: 'loading_refs' | 'ready' = 'loading_refs';
  @State() imageData: TImageData[] = [];
  @State() imageDataGroups: {
    [key: string]: TImageData[];
  } = {};

  async componentDidLoad() {
    const fileRefs = await getAllFileRefs();
    console.log({ fileRefs });

    const initImageData = fileRefs.map(x => {
      const groupId = x.fullPath.split('-').slice(0, -1).join('-');
      return {
        name: x.fullPath,
        groupId,
        formattedDate: dayjs(new Date(groupId)).format('DD/MM H:mm'),
        downloadUrlPromise: getDownloadURL(x),
      };
    });
    const imageDataDownloadUrlPromises = await Promise.all(initImageData.map(x => x.downloadUrlPromise));
    this.imageData = initImageData.map(({ downloadUrlPromise, ...x }, i) => ({
      ...x,
      downloadUrl: imageDataDownloadUrlPromises[i],
    }));
    this.imageData.forEach(x => {
      if (!this.imageDataGroups[x.groupId]) this.imageDataGroups[x.groupId] = [];
      this.imageDataGroups[x.groupId].push(x);
    });

    console.log({ y: this.imageDataGroups });

    this.status = 'ready';
  }

  render() {
    return (
      <Host>
        <main class="bg-neutral-content" style={css({ height: '100vh', padding: '10px', display: 'flex', flexDirection: 'column' })}>
          <h2 class="text-neutral" style={css({ textAlign: 'center', fontSize: '2.5rem' })}>
            Chris & Sam 2024
          </h2>
          <div style={css({ flex: '1', overflow: 'auto' })}>
            <div style={css({ height: '100%', maxHeight: '100%', width: '600px', maxWidth: '100%', margin: '0 auto' })}>
              <daisy-card>
                {this.status === 'loading_refs' && (
                  <div style={css({ display: 'flex', justifyContent: 'center', padding: '40px' })}>
                    <span class="loading loading-spinner loading-lg"></span>
                  </div>
                )}
                {this.status === 'ready' &&
                  Object.values(this.imageDataGroups).map(imageDataGroup => (
                    <div>
                      <div class="carousel w-full" style={css({ flexDirection: 'row-reverse' })}>
                        {[...imageDataGroup].reverse().map(imageData => (
                          <div id={imageData.name} class="carousel-item w-full" key={`${imageData.name}-main-image`} style={css({ width: '100%' })}>
                            <img src={imageData.downloadUrl} />
                          </div>
                        ))}
                      </div>
                      <div style={css({ display: 'flex', gap: '10px' })}>
                        {imageDataGroup.map(imageData => (
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
                      {/* {x.map(y => (
                      <div
                        style={css({
                          border: '1px solid red',
                          flex: '1',
                          minHeight: '80px',
                          backgroundImage: `url(${y.downloadUrl})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        })}
                        key={y.name}
                      />
                    ))} */}
                    </div>
                  ))}
              </daisy-card>
            </div>
          </div>
        </main>
      </Host>
    );
  }
}
