import { HttpClientModule } from '@angular/common/http';
import { NgModule, SecurityContext } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTreeModule } from '@angular/material/tree';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ClipboardModule } from 'ngx-clipboard';
import { MarkdownModule } from 'ngx-markdown';
import { ApiComponent } from './api/api.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommunityComponent } from './community/community.component';
import { DialogComponent } from './dialog/dialog.component';
import { ExampleComponent } from './example/example.component';
import { FooterComponent } from './footer/footer.component';
import { GettingStartedComponent } from './getting-started/getting-started.component';
import { InstallComponent } from './install/install.component';
import { NavbarComponent } from './navbar/navbar.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { SearchResultComponent } from './search-result/search-result.component';
import { SearchComponent } from './search/search.component';
import { SlackFormComponent } from './slack-form/slack-form.component';
import { SnackbarComponent } from './snackbar/snackbar.component';
import { TocComponent } from './toc/toc.component';
import { TutorialComponent } from './tutorial/tutorial.component';
import { WINDOW_PROVIDERS } from './window-provider/window-provider.component';



@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    GettingStartedComponent,
    TutorialComponent,
    ApiComponent,
    TocComponent,
    InstallComponent,
    CommunityComponent,
    SnackbarComponent,
    PageNotFoundComponent,
    ExampleComponent,
    DialogComponent,
    SearchComponent,
    FooterComponent,
    SlackFormComponent,
    SearchResultComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    HttpClientModule,
    FormsModule,

    NgbModule,
    MarkdownModule.forRoot({ sanitize: SecurityContext.NONE }), // for all tag has id
    BrowserAnimationsModule,

    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatTreeModule,
    ClipboardModule,
    MatSnackBarModule,
    MatDialogModule,
    MatCardModule,
    MatProgressBarModule,
    MatMenuModule,
  ],
  providers: [WINDOW_PROVIDERS],
  bootstrap: [AppComponent],
  entryComponents: [SnackbarComponent, DialogComponent, SearchResultComponent]
})
export class AppModule { }
