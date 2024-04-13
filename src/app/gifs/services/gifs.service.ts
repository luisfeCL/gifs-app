import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SearchResponse, Gif } from '../interfaces/gifs.interface';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  public gifList: Gif[] = []

  private _tagsHistory: string[] = []; // se hace privado para evitar que desde fuera se haga una mutación del array
  private serviceURL = 'https://api.giphy.com/v1/gifs'
  private GIPHY_API_KEY = '01Pnz1goNBjoCeni8JIOQUZfrQi2SEeM'

  constructor(private http: HttpClient ) {
    this.loadLocalStorage()

  };

  get TagsHistory(){
    return [...this._tagsHistory]; // genera una copia del array así podemos modificar sin necesidad de alterar el original
  }

  private organizeHistory(tag: string){
    tag = tag.toLowerCase();

    if(this._tagsHistory.includes(tag)){
      this._tagsHistory = this._tagsHistory.filter((oldTag) => oldTag !== tag)
    }

    this._tagsHistory.unshift( tag )
    this._tagsHistory = this._tagsHistory.splice(0, 10);
    this.saveLocalStorage();
  }

  private saveLocalStorage():void{
    localStorage.setItem('history', JSON.stringify(this._tagsHistory))
  }

  private loadLocalStorage():void{
    if(!localStorage.getItem('history')) return;

    this._tagsHistory = JSON.parse(localStorage.getItem('history')!)

    if(this._tagsHistory.length === 0) return;
    this.searchTag(this.TagsHistory[0])

  }

  async searchTag( tag: string ): Promise<void>{
    if (tag.length === 0) return;
    this.organizeHistory(tag);

    const params = new HttpParams()
      .set('api_key', this.GIPHY_API_KEY)
      .set('limit', '10')
      .set('q', tag)

    this.http.get<SearchResponse>(`${this.serviceURL}/search`, { params })
      .subscribe(( res ) =>{
        this.gifList = res.data
      })

  }
}
