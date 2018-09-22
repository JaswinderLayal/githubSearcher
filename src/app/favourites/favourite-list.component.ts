import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { GithubService } from '../services/github.service';
import { repo } from '../modals/repo';



@Component({
  selector: 'gtc-fav-list',
  templateUrl: 'favourite-list.component.html'

})
export class FavouriteListComponent implements OnInit {
  title = 'githubSearcherChallenge';
  urlHead="https://github.com";
 favourites:repo[]=[];
  loading=false;
  constructor(private githubService:GithubService){
   // this.subscribeToFavObservable();
  }
  
  subscribeToFavObservable(){
   this.githubService.myFavRepos.subscribe((repo)=>{
        this.favourites.push(repo);
    })
  }

  ngOnInit(){
      this.loading=true;
      this.githubService.listFavourite().subscribe(data=>{
          console.log(data)
          this.favourites=[];
       // this.githubService.myFavRepos.unsubscribe();
         data.forEach(item => {
             let reponame=item.node.name;
             let lang=item.node.primaryLanguage.name;
             let owner= item.node.owner?item.node.owner.login:"NA"
             let tag=item.node.refs.edges.length?item.node.refs.edges[0].node.name:"-";
             let link=item.node.resourcePath?this.urlHead+item.node.resourcePath:"#";
             let id=item.node.id;
             let name=`${owner} / ${reponame}`;
            this.githubService.myFavReposIds.push(id);
             this.favourites.push({id,name,lang,tag,link});
         });
         this.subscribeToFavObservable();
         this.loading=false;
      })
  }

  removeFavourite(repo){
      this.githubService.removeFavourite(repo.id).subscribe(data=>{
          console.log(data);
          this.favourites.splice(this.favourites.indexOf(repo),1);
          this.githubService.removeFavRepo.next(repo.id)
      })
  }


}
