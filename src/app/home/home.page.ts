import { Component, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { CatService } from '../shared/services/cat.service';
import { Cat, CurrentCatListData } from '../shared/interfaces/cat.interface';
import { Router } from '@angular/router';
import { BASES_ROUTE } from '../shared/constants/constants';
import { InfiniteScrollCustomEvent } from '@ionic/core';
import { IonContent } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
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
    console.log('currentCatList: ', currentCatList);
    if (currentCatList.catList.length > 0) {
      this.catList.set(currentCatList.catList);
      this.catListBakcup.set(currentCatList.catList);
      this.currentCatPage = currentCatList.page;
    } else {
      this.getInitialCatList();
    }
  }
  /**
   *  function for get initial cat list data and set in catList
   */
  getInitialCatList(event?: any): void {
    this.catService.getCatListV2(this.currentCatPage).subscribe((response: Cat[]) => {
      if (response.length > 0) {
        this.currentCatPage ++;
        this.catList.update(currentData => [...currentData, ...response]);
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
    });
  }
  /**
   *
   * @param event
   */
  onIonInfinite(event: any): void {
    if (this.hasMoreData) {
      this.getInitialCatList(event);
      console.log('event infinite scroll: ', event);
    } else {
      event.target.complete();
    }
  }

  /**
   * Called on scroll events
   */
  onScroll(event: any): void {
    /**
     *  ------ calculate scroll percentage ----------
     */
    /**
     * main scroll event
     */
    const scrollElement = event.target;
    /**
     * space that can be moved
     * scrollHeight == all content height
     * clientHeight == visible height
     * scrollTop == how much it was moved
     */
    const scrollHeight = scrollElement.scrollHeight - scrollElement.clientHeight;
    this.scrollPercentage = (event.detail.scrollTop / scrollHeight) * 100;
    /**
     * show or hide the button scroll up depending the percentage
     */
    this.showScrollButton = this.scrollPercentage >= this.scrollPercentage;
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
