import { StorageReference } from 'firebase/storage';

export type TImageData = {
  ref: StorageReference;
  name: string;
  formattedDate: string;
  groupId: string;
  downloadUrl: string;
};
