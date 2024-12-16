import { Component, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { CatService } from '../shared/services/cat.service';
import { Cat, CurrentCatListData } from '../shared/interfaces/cat.interface';
import { IonContent, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CatCardComponent } from '../shared/components/cat-card/cat-card.component';
import { InputSearchComponent } from '../shared/components/input-search/input-search.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CatCardComponent,
    InputSearchComponent
  ]
})
export class HomePage implements OnInit, OnDestroy {
  /**
   * variables for save cat list information
   */
  catList = signal<Cat[]>([]);
  catListBakcup = signal<Cat[]>([]);
  /**
   * variables for do pagination
   */
  currentCatPage: number = 0;
  hasMoreData: boolean = true;
  /**
   * variable for show and hide button scroll up
   */
  showScrollButton: boolean = false;
  scrollPercentage: number = 70;
  /**
   * variable for show and hide skeleton screen
   */
  isLoadingSK = signal<boolean>(true);
  skeletonList = signal<any[]>([{}, {}]);

  @ViewChild(IonContent, { static: true }) mainContent: IonContent | undefined
  /**
   *
   * @param catService
   */
  constructor(
    private catService: CatService
  ) {}

  ngOnInit(): void {
    this.validateExistingData();
  }
  /**
   *
   */
  validateExistingData(): void {
    const currentCatList: CurrentCatListData = this.catService.listCat;
    if (currentCatList.catList.length > 0) {
      this.catList.set(currentCatList.catList);
      this.catListBakcup.set(currentCatList.catList);
      this.currentCatPage = currentCatList.page;
    } else {
      this.isLoadingSK.set(true);
      this.getInitialCatList();
    }
  }
  /**
   *  function for get initial cat list data and set in catList
   */
  getInitialCatList(event?: any): void {
    this.catService.getCatList(this.currentCatPage).subscribe((response: Cat[]) => {
      if (response.length > 0) {
        this.currentCatPage ++;
        this.catList.update(currentData => [...currentData, ...response]);
        this.catListBakcup.set(this.catList());
        console.log('catList data: ', this.catList());
        console.log('this.currentCatPage: ', this.currentCatPage);
      } else {
        this.hasMoreData = false;
      }
      /**
       * for manage the current infinite scroll state
      */
     if (event) {
       event.target.complete();
      }
      this.isLoadingSK.set(false);
    });
  }
  /**
   *
   * @param event
   */
  onIonInfinite(event: any): void {
    if (this.hasMoreData) {
      this.getInitialCatList(event);
    } else {
      event.target.complete();
    }
  }

  searchQuery(event: any): void {
    this.isLoadingSK.set(true);
    console.log('event in home component: ', event);
    if (event === '') {
      /**
       * cuando es vacio eso quiere decir que debemos de traer todo de nuevo
       */
      this.catList.set(this.catListBakcup());
    } else {
      /**
       * vamos a filtrar con lo que trajo haber que se encuentra
       */
      const filter = this.catList().filter((cat) => cat.name.toLowerCase().indexOf(event) > -1);
      this.catList.set(filter);
      if (this.catList().length === 0) {
        /**
         * procedemos a buscar en base de datos
         */
      }
    }
    this.isLoadingSK.set(false);
  }

  /**
   *
   * @param event
   */
  handleRefresh(event: any) {
    setTimeout(() => {
      this.isLoadingSK.set(true);
      // Any calls to load data go here
      this.catService.getCatList(0).subscribe((response:Cat[]) => {
        if (response.length > 0) {
          this.currentCatPage++;
          this.catList.set(response);
          this.catListBakcup.set(this.catList());
        }
        this.isLoadingSK.set(false);
        event.target.complete();
      })
    }, 1000);
  }

  /**
   * Called on scroll events
   */
  async onScroll(event: any): Promise<void> {
    /**
     *  ------ calculate scroll percentage ----------
     */
    /**
     * main scroll event
     */
    const mainContent = event.target;
    const scrollElement = await mainContent.getScrollElement();
    /**
     *  totalHeigh == total height of container
     *  currentScroll == current total height of scroll
     * viewportHeight == viewport height
     */
    const totalHeight = scrollElement.scrollHeight;
    const currentScroll = scrollElement.scrollTop;
    const viewportHeight = mainContent.offsetHeight;
    /**
     * Calculate the scroll percentage
     */
    const scrollPercentage = (currentScroll / (totalHeight - viewportHeight)) * 100;
    this.showScrollButton = scrollPercentage >= 70;
  }

  scrollUp(): void {
    this.mainContent?.scrollToTop(400);
  }

  ngOnDestroy(): void {
    /**
     * The current list of cats is set to avoid multiple queries.
     */
    this.catService.setListCat = {
      catList: this.catList(),
      page: this.currentCatPage
    };
  }

}
