import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
    switchMap, map
} from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { query } from '../../../node_modules/@angular/core/src/render3/query';
import { repo } from '../modals/repo';


@Injectable({
    providedIn: 'root',
})
export class GithubService {

    private url: string = "https://api.github.com/graphql";
    private searchQuery: string = "angular";
    private token: string = "d0c7c65215b3fc719dd607bd83e9647cae4c22dd"
    private userName: string = "JaswinderLayal";
    public myFavReposIds=[];
    public myFavRepos=new Subject<repo>();
    public removeFavRepo=new Subject<string>();
    constructor(private http: HttpClient) {

    }

    fetch(search: string): Observable<Array<any>> {
        console.log(search);
        let data = this.makeQuery(search);
        const httpOptions = {
            headers: new HttpHeaders({ 'Authorization': `Bearer ${this.token}` })
        };

        return this.http.post(this.url, JSON.stringify(data), httpOptions)
            .pipe(map((data: any) => data.data.search.edges));

    }


    addFavourite(id) {
        const httpOptions = {
            headers: new HttpHeaders({ 'Authorization': `Bearer ${this.token}` })
        };
        return this.http.post(this.url, this.makeFavouriteQuery(id), httpOptions);
    }


    removeFavourite(id) {
        const httpOptions = {
            headers: new HttpHeaders({ 'Authorization': `Bearer ${this.token}` })
        };
        return this.http.post(this.url, this.makeRemoveFavouriteQuery(id), httpOptions);
    }
 



    listFavourite() {
        const httpOptions = {
            headers: new HttpHeaders({ 'Authorization': `Bearer ${this.token}` })
        };
        return this.http.post(this.url, this.makeListFavouriteQuery(), httpOptions).pipe(
            map((data: any) => data.data.user.starredRepositories.edges)
        );
    }


    makeRemoveFavouriteQuery(id) {
        return {
            query: `
            mutation{
                removeStar(input:{starrableId:"${id}"}) {
                   starrable{
                    id
                  }
                } 
              }`
        };
    }

    makeListFavouriteQuery() {
        return {
            query: `
        query {
            user(login:"${this.userName}"){
              starredRepositories(first:100){
                edges{
                  node{
                    name
                    id
                    owner {
                      login
                    }
                    resourcePath
                    primaryLanguage{
                      name
                    }
               refs(refPrefix: "refs/tags/", first: 1, orderBy: {field: TAG_COMMIT_DATE, direction: DESC}) {
                edges {
                  node {
                    name
                   
                  }
                }
              }    
                  }
                }
              }
            }
          }
        `
        }
    }

    makeFavouriteQuery(id) {
        return {
            query: `
            mutation{
                addStar(input:{starrableId:"${id}"}) {
                   starrable{
                    id
                  }
                } 
              }`
        };
    }


    makeQuery(search: string) {
        return {
            query: `
        {
            search(query: "${search}", type: REPOSITORY, first: 10) {
              repositoryCount
              edges {
                node {
                  ... on Repository {
                      id
                    name
                    resourcePath
                    owner {
                        login
                      }
                    primaryLanguage{
                      name
                    }
                 refs(refPrefix: "refs/tags/", first: 1, orderBy: {field: TAG_COMMIT_DATE, direction: DESC}) {
                edges {
                  node {
                    name
                    target {
                      oid
                      ... on Tag {
                        commitUrl
                        tagger {
                          date
                        }
                      }
                    }
                  }
                }
              }
                   
                  }
                }
              }
            }
          }
        `
        }
    }
}