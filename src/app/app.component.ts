import { Component, OnInit } from '@angular/core';
import { GithubService } from './services/github.service'
import { Observable, Subject } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { repo } from './modals/repo';


@Component({
  selector: 'gtc-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'githubSearcherChallenge';
  repos: repo[] = [];
  searchStrokes = new Subject<string>();
  urlHead="https://github.com";
  loading=false;
  search(keyword) {
    //console.log(keyword);
    this.loading=true;
    this.searchStrokes.next(keyword);
  }

  clearResult(keyword:string){
     if(!keyword.length)
     this.repos=[];
  }

  ngOnInit(): void {
    this.githubService.removeFavRepo.subscribe(id=>{
      this.repos.filter((repo)=>{
          if(repo.id==id)
          {
            repo.isFavourite=false;
          }
      });
    });


    this.searchStrokes.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((s: any) => {
       return  this.githubService.fetch(s)
      })).subscribe(data => {
        this.repos=[];
        console.log(data)
        data.forEach(item => {
          console.log(item);
          let owner= item.node.owner?item.node.owner.login:"NA"
          let reponame = item.node.name ? item.node.name : "NA";
          let id=item.node.id;
          let lang = item.node.primaryLanguage ? item.node.primaryLanguage.name : "NA";
          let tag = item.node.refs.edges.length ? item.node.refs.edges[0].node.name : "-";
          let link=item.node.resourcePath?this.urlHead+item.node.resourcePath:"#";
          let name=`${owner} / ${reponame}`;
          let isFavourite=this.githubService.myFavReposIds.filter(item=>item==id).length?true:false;
          this.repos.push({id, name , lang, tag,link,isFavourite })
        })
        console.log(this.repos);
        this.loading=false;
      });
  }

  constructor(private githubService: GithubService) {

  }
}
