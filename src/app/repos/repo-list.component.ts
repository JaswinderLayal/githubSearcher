import { Component, Input } from '@angular/core';
import { repo } from '../modals/repo';
import { GithubService } from '../services/github.service';

@Component({
  selector: 'gtc-repos',
  templateUrl: 'repo-list.component.html',

})
export class RepoListComponent {
  title = 'githubSearcherChallenge';
  @Input() repos: repo[];
  constructor(private githubService: GithubService) {
  }

  addFavourite(repo: repo) {
   
      this.githubService.addFavourite(repo.id).subscribe(data => {
        console.log(data);
        this.githubService.myFavRepos.next(repo);
        this.githubService.myFavReposIds.push(repo.id);
        repo.isFavourite=true;
      })
   
  }

}
