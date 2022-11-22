import { ChangeDetectorRef, Component, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'author-books';
  booksData :any= null;
  bookList : any =[[],[]];
  mobileBooks = [];
  
  isMobile = false;
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.generateBookData();    
  }
  constructor(private http: HttpClient, private cd: ChangeDetectorRef){}
  async ngOnInit(){
    this.booksData = await this.http.get('https://s3.amazonaws.com/api-fun/books.json').toPromise();
    this.generateBookData();  
  }
  generateBookData(){
    this.isMobile = window.innerWidth<481;
    console.log('Are we on mobile', this.isMobile,window.innerWidth);
    
    if(this.isMobile){    
      this.bookList[0] = this.booksData.data.books;
      this.cd.detectChanges();
      return;
    }
    this.bookList[0] = [...this.booksData.data.books.slice(0, Math.ceil(this.booksData.data.books.length/2))];
    this.bookList[1] = [...this.booksData.data.books.slice(Math.ceil(this.booksData.data.books.length/2))];
    this.cd.detectChanges();
  }
}
