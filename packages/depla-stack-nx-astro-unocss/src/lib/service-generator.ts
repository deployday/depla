import { IEntity, ITemplateGenerator, Config } from 'depla';

// CHALLENGE: Update service template to be dynamic
const generate = (entity: IEntity, { scope }: Config) => {
  // const { ref, refs, model, models, singleParam } = entity;

  const template = `
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Album } from '@acme/api-interfaces';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class AlbumsService {
  model = 'albums';

  constructor(private http: HttpClient) { }

  all() {
    return this.http.get<Album[]>(this.getUrl());
  }

  find(id: string) {
    return this.http.get<Album>(this.getUrlWithId(id));
  }

  create(album: Album) {
    return this.http.post(this.getUrl(), album);
  }

  update(album: Album) {
    return this.http.put(this.getUrlWithId(album.id), album);
  }

  delete(album: Album) {
    return this.http.delete(this.getUrlWithId(album.id));
  }

  private getUrl() {
    return \`\${environment.apiEndpoint}\${this.model}\`;
  }

  private getUrlWithId(id) {
    return \`\${this.getUrl()}/\${id}\`;
  }
}`;

  return {
    template,
    title: `Albums Service`,
    fileName: `libs/core-data/src/lib/services/albums/albums.service.ts`,
  };
};

export const ServiceGenerator: ITemplateGenerator = {
  generate,
};
