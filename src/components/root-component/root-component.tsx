import { Component, Host, State, h } from '@stencil/core';
import { css } from '../../utils/cssUtils';

import { StorageReference, getDownloadURL, listAll, ref } from 'firebase/storage';
import { storage } from '../../config/firebaseConfig';
import dayjs from 'dayjs';
import { TImageData } from '../../types';

const getAllFileRefs = async () => {
  const listRef = ref(storage);

  const storageReferencesResponse: Promise<{
    images: StorageReference[];
    folders: StorageReference[];
  }> = new Promise((resolve, reject) => {
    listAll(listRef)
      .then(res => {
        const images = res.items;
        const folders = res.prefixes;

        resolve({ images, folders });
      })
      .catch(error => {
        // Uh-oh, an error occurred!
        reject(error);
      });
  });

  return storageReferencesResponse;
};
const exampleImageUrl =
  'https://firebasestorage.googleapis.com/v0/b/cs-wedding-2fa63.appspot.com/o/2024-01-06T13%3A41%3A34.681Z-1.png?alt=media&token=e2beb33d-5efb-4500-99bf-16dfd70f17f1';

@Component({
  tag: 'root-component',
})
export class RootComponent {
  @State() status: 'loading_refs' | 'ready' = 'loading_refs';
  @State() imageData: TImageData[] = [];
  @State() imageDataGroups: {
    [key: string]: TImageData[];
  } = {};
  @State() zipDownloadUrl?: string;

  async componentDidLoad() {
    const fileRefs = await getAllFileRefs();
    const folderRef = fileRefs.folders.find(x => !!x);
    listAll(folderRef).then(async res => {
      console.log(res.items.find(x => !!x));
      this.zipDownloadUrl = await getDownloadURL(res.items.find(x => !!x));
    });

    const initImageData = fileRefs.images.map(x => {
      const groupId = x.fullPath.split('-').slice(0, -1).join('-');
      return {
        ref: x,
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
                <p>Download all images using the button below. It may take some time and make sure you have at least 1gb free on your device.</p>
                <a href={this.zipDownloadUrl} download="cs-wedding-images">
                  <button class="btn btn-primary" style={css({ width: '100%' })}>
                    Download all
                  </button>
                </a>
                {this.status === 'loading_refs' && (
                  <div style={css({ display: 'flex', justifyContent: 'center', padding: '40px' })}>
                    <span class="loading loading-spinner loading-lg"></span>
                  </div>
                )}
                {this.status === 'ready' &&
                  Object.values(this.imageDataGroups).map(imageDataGroup => {
                    return <image-carousel imageDataGroup={imageDataGroup} />;
                  })}
              </daisy-card>
            </div>
          </div>
        </main>
      </Host>
    );
  }
}
