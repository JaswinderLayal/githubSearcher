import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'
import { AppComponent } from './app.component';
import { HttpClientModule }    from '@angular/common/http';
import { RepoListComponent } from './repos/repo-list.component';
import { FavouriteListComponent } from './favourites/favourite-list.component';
@NgModule({
  declarations: [
    AppComponent,
    RepoListComponent,
    FavouriteListComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
