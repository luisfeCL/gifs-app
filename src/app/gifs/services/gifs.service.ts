import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  private _tagsHistory: string[] = []; // se hace privado para evitar que desde fuera se haga una mutación del array
  private serviceURL = 'https://api.giphy.com/v1/gifs'
  private GIPHY_API_KEY = '01Pnz1goNBjoCeni8JIOQUZfrQi2SEeM'

  constructor(private http: HttpClient ) { };

  get TagsHistory(){
    return [...this._tagsHistory];
  }

  private organizeHistory(tag: string){
    tag = tag.toLowerCase();

    if(this._tagsHistory.includes(tag)){
      this._tagsHistory = this._tagsHistory.filter((oldTag) => oldTag !== tag)
    }

    this._tagsHistory.unshift( tag )
    this._tagsHistory = this._tagsHistory.splice(0, 10);
  }

  async searchTag( tag: string ): Promise<void>{
    if (tag.length === 0) return;
    this.organizeHistory(tag);

    const params = new HttpParams()
      .set('api_key', this.GIPHY_API_KEY)
      .set('limit', '10')
      .set('q', tag)

    this.http.get(`${this.serviceURL}/search`, { params })
      .subscribe(resp =>{
        console.log(resp)
      })

  }
}
