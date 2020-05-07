import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';

import { API } from '../api';
import { MatSidenav } from '@angular/material';
import { Title } from '@angular/platform-browser';
import { GlobalService } from '../global.service';

@Component({
  selector: 'app-api',
  templateUrl: './api.component.html',
  styleUrls: ['./api.component.css']
})
export class ApiComponent implements OnInit {
  apiList: API[];
  selectedAPI: string;
  currentSelection: string;
  currentAPIText: string;
  currentAPILink: string;

  segments: UrlSegment[];

  treeControl: NestedTreeControl<API>;
  dataSource: MatTreeNestedDataSource<API>;

  minWidth: number = 640;
  screenWidth: number;
  private screenWidth$ = new BehaviorSubject<number>(window.innerWidth);

  structureHeaderDict = {
    'Content-Type': 'application/json',
    'Accept': "application/json, text/plain",
    'Access-Control-Allow-Origin': '*'
  }
  structureRequestOptions = {
    headers: new HttpHeaders(this.structureHeaderDict),
  };

  contentHeaderDict = {
    'Accept': "application/json, text/plain",
    'Access-Control-Allow-Origin': '*'
  }
  contentRequestOptions = {
    responseType: 'text' as 'text',
    headers: new HttpHeaders(this.contentHeaderDict)
  };

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.screenWidth$.next(event.target.innerWidth);
  }

  @ViewChild('sidenav', { static: true })
  sidenav: MatSidenav;

  @ViewChild('grippy', { static: true })
  grippy: ElementRef;

  constructor(private http: HttpClient,
              private router: Router,
              private route: ActivatedRoute,
              private title: Title,
              private globalService: GlobalService) { }

  ngOnInit() {
    this.treeControl = new NestedTreeControl<API>(node => node.children);
    this.dataSource = new MatTreeNestedDataSource<API>();

    this.route.url.subscribe((segments: UrlSegment[]) => {
      this.globalService.setLoading();
      console.log(segments)

      this.segments = segments;
      this.getAPIStructure();
    });

    this.screenWidth$.subscribe(width => {
      this.screenWidth = width;
    });
  }

  hasChild = (_: number, node: API) => !!node.children && node.children.length > 0;

  flatten(arr) {
    var ret: API[] = [];
    for (let a of arr) {
      if (a.children) {
        ret = ret.concat(this.flatten(a.children));
      } else {
        ret = ret.concat(a);
      }
    }

    return ret;
  }

  expandNodes(apiName: string) {
    var apiParts: Array<string> = apiName.split("/");
    apiParts.pop();
    if (apiParts[0] != "fe")
      apiParts = ['fe'].concat(apiParts);

    if (apiParts.length == 1) {
      this.treeControl.expand(this.apiList[0]);
    } else {
      var searchRange = this.apiList;
      var searchName = apiParts[0];
      for (var i: number = 0; i < apiParts.length - 1; i++) {
        searchName = searchName + "." + apiParts[i + 1];

        var expandNode = searchRange.filter(api => api.displayName === searchName)[0];
        this.treeControl.expand(expandNode);

        searchRange = expandNode.children;
      }
    }
  }

  getAPIStructure() {
    if (this.apiList) {
      this.loadSelectedAPI();
    } else {
      this.http.get('assets/branches/r1.0/api/structure.json', this.structureRequestOptions).subscribe(data => {
        this.apiList = <API[]>(data);
        this.dataSource.data = this.apiList;
        this.treeControl.dataNodes = this.apiList;

        this.loadSelectedAPI();
      },
      error => {
        console.error(error);
        this.globalService.resetLoading();
      });
    }
  }

  private loadSelectedAPI() {
    /* this might not be used ever cause segments always have the url components */
    if (this.segments.length == 0) {
      this.updateAPIContent(this.apiList[0].children[0]);
      this.treeControl.expand(this.treeControl.dataNodes[0]);
    }
    /* END COMMENTS */
    else {
      console.log(this.flatten(this.apiList));
      var searchString: string;
      if (this.segments.length === 2) {
        searchString = this.segments.join("/") + ".md";
      } else {
        searchString = this.segments.slice(1, this.segments.length).join("/") + ".md";
      }
      var a: API[] = this.flatten(this.apiList).filter(api => searchString === api.name);

      if (a.length > 0) {
        this.updateAPIContent(a[0]);
        this.expandNodes(a[0].name);
      } else {
        this.globalService.resetLoading();
        this.router.navigate(['PageNotFound'], {replaceUrl: true});
      }
    }
  }

  private updateAPIContent(api: API) {
    window.scroll(0, 0);

    this.selectedAPI = api.name;
    this.currentSelection = 'assets/branches/r1.0/api/' + api.name;
    this.currentAPILink = api.sourceurl;

    this.getSelectedAPIText();
    this.title.setTitle(api.displayName + " | Fastestimator");
  }

  getSelectedAPIText() {
    this.http.get(this.currentSelection, this.contentRequestOptions).subscribe(data => {
      this.currentAPIText = data;

      this.globalService.resetLoading();
    },
    error => {
      console.error(error);
      this.globalService.resetLoading();

      this.router.navigate(['PageNotFound'], {replaceUrl: true})
    });
  }

  createRouterLink(url: string) {
    var components: Array<string> = url.substring(0, url.length - 3).split('/');
    if (components[0] != 'fe')
      components = ['fe'].concat(components);

    var ret = ['/api'];

    return ret.concat(components);
  }

  checkSidebar() {
    if (this.sidenav.opened) {
      this.grippy.nativeElement.style.backgroundImage = "url(../../assets/images/sidebar-grippy-hide.png)"
      this.grippy.nativeElement.style.left = "20rem"
    } else {
      this.grippy.nativeElement.style.backgroundImage = "url(../../assets/images/sidebar-grippy-show.png)"
      this.grippy.nativeElement.style.left = "0rem"
    }
  }

  getImageUrl() {
    if (this.sidenav.opened) {
      this.grippy.nativeElement.style.left = "20rem"
      return "url(../../assets/images/sidebar-grippy-hide.png)"
    } else {
      this.grippy.nativeElement.style.left = "0rem"
      return "url(../../assets/images/sidebar-grippy-show.png)"
    }
  }

  toggleMenu() {
    this.sidenav.toggle();
    this.checkSidebar();
  }
}
