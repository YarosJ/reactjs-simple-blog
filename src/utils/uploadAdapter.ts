import axios, { AxiosResponse } from 'axios';
import { getAccessToken } from './localStorageUtils';
import { apiUrl, resourceUploadRoute, uploadsRoute } from '../constants/api';

class UploadAdapter {
  private readonly loader: any;

  private readonly postId: string;

  constructor(loader: any, postId: string) {
    this.loader = loader;
    this.postId = postId;
  }

  /**
   * Uploads resource to the server
   */
  public async upload(): Promise<{ default: string }> {
    const formData: FormData = new FormData();
    const file: File = await this.loader.file;
    const { postId } = this;

    formData.append('file', file);
    formData.append('postId', postId);

    const { data: { filename } }: AxiosResponse<{ filename: string }> = await axios.post(
      `${apiUrl}/${resourceUploadRoute}`,
      formData,
      { headers: { Authorization: getAccessToken() } },
    );

    return { default: `${apiUrl}/${uploadsRoute}/${filename}` };
  }
}

export default (postId: string) => function CustomUploadAdapterPlugin(editor: any) {
  // eslint-disable-next-line no-param-reassign
  editor.plugins.get('FileRepository').createUploadAdapter = (
    loader: any,
  ) => new UploadAdapter(loader, postId);
};

export type UploadAdapterType = (editor: any) => void;