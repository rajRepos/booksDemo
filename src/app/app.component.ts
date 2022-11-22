import { ChangeDetectorRef, Component, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'author-books';
  booksData: any = null;
  bookList: any = [[], []];
  mobileBooks = [];
  sortToggle:any ={
    title:{
      "0":false,
      "1":false,
    },
    PublishDate:{
      "0":false,
      "1":false,
    }
  }

  isMobile = false;
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.generateBookData();
  }
  constructor(private http: HttpClient, private cd: ChangeDetectorRef) { }
  async ngOnInit() {
    this.booksData = await this.http.get('https://s3.amazonaws.com/api-fun/books.json').toPromise();
    this.generateBookData();
  }
  generateBookData() {
    this.isMobile = window.innerWidth < 481;
    console.log('Are we on mobile', this.isMobile, window.innerWidth);
    if (this.isMobile) {
      this.bookList[0] = this.booksData.data.books;
      this.cd.detectChanges();
      return;
    }
    this.bookList[0] = [...this.booksData.data.books.slice(0, Math.ceil(this.booksData.data.books.length / 2))];
    this.bookList[1] = [...this.booksData.data.books.slice(Math.ceil(this.booksData.data.books.length / 2))];
    this.cd.detectChanges();
  }
  sortBy(type: string,listNumber: number) {
    let ascending: number;
    let descending: number;
    this.sortToggle[type][listNumber]?(ascending=-1,descending=1): (ascending=1,descending=-1);
    this.sortToggle[type][listNumber] = !this.sortToggle[type][listNumber];
        this.bookList[listNumber] = this.bookList[listNumber].sort((a: any, b: any) => {
          if (a[type].toLowerCase() < b[type].toLowerCase()) { return ascending; }
          if (a[type].toLowerCase() > b[type].toLowerCase()) { return descending; }
          return 0;
        })
  }
}
