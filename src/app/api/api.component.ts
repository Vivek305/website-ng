import { NestedTreeControl } from '@angular/cdk/tree';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { API } from '../api';
import { GlobalService } from '../global.service';
//import { GoogleAnalyticsService } from './../google-analytics.service';




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
  scrollCounter: number = 0;
  scrollThreshold: number = 20;
  segments: UrlSegment[];
  fragment: string;

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

  @HostListener('window:scroll', ['$event'])
  onScroll(event) {
    if (this.scrollCounter < this.scrollThreshold) {
      this.scrollCounter += 1;
    }
  }

  @ViewChild('sidenav', { static: true })
  sidenav: MatSidenav;

  @ViewChild('grippy', { static: true })
  grippy: ElementRef;

  constructor(private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private title: Title,
    private globalService: GlobalService
    //private googleAnalyticsService: GoogleAnalyticsService
    ) { }

  ngOnInit() {
    this.treeControl = new NestedTreeControl<API>(node => node.children);
    this.dataSource = new MatTreeNestedDataSource<API>();

    this.route.url.subscribe((segments: UrlSegment[]) => {
      this.globalService.setLoading();
      this.segments = segments;
      this.getAPIStructure();
    });

    this.route.fragment.subscribe((fragment: string) => {
      this.fragment = fragment;
    })

    this.screenWidth$.subscribe(width => {
      this.screenWidth = width;
    });
  }

  ngAfterViewChecked() {
    /* Scroll to the fragment postition.
       The reason for adding a scroll threshold is to scroll to the fragment position after image loaded.
       Before the counter goes to scollThreshold, the scrolling postion will stick to fragment.
       This wook will trigger the onScroll event and trigger back to this funtion again.
       So the counter will goes extremely fast.
    */

    if (this.fragment && this.scrollCounter < this.scrollThreshold) {
      if (document.querySelector('#' + this.fragment) != null) {
        document.querySelector('#' + this.fragment).scrollIntoView();
        window.scrollBy(0, -90); // the offset of navbar height
      }
    }
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
        this.router.navigate(['PageNotFound'], { replaceUrl: true });
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

        this.router.navigate(['PageNotFound'], { replaceUrl: true })
      });
  }

  sendEvent() {
    //this.googleAnalyticsService.eventEmitter('Button click', 'API- Github Source', this.currentAPILink)
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
      this.grippy.nativeElement.style.left = "19rem"
    } else {
      this.grippy.nativeElement.style.backgroundImage = "url(../../assets/images/sidebar-grippy-show.png)"
      this.grippy.nativeElement.style.left = "0rem"
    }
  }

  getImageUrl() {
    if (this.sidenav.opened) {
      this.grippy.nativeElement.style.left = "19rem"
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
