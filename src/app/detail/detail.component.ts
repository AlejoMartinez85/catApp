import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { CatService } from '../shared/services/cat.service';
import { Cat, CatById } from '../shared/interfaces/cat.interface';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ExternalLinkService } from '../shared/services/external-link.service';
import { CommonModule } from '@angular/common';
import { RatingComponent } from '../shared/components/rating/rating.component';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RatingComponent]
})
export class DetailComponent  implements OnInit, OnDestroy {
  cat = signal<Cat>({
    weight: {
      imperial: '',
      metric: ''
    },
    id: '',
    name: '',
    cfa_url: '',
    vetstreet_url: '',
    vcahospitals_url: '',
    temperament: '',
    origin: '',
    country_codes: '',
    country_code: '',
    description: '',
    life_span: '',
    indoor: 0,
    lap: 0,
    alt_names: '',
    adaptability: 0,
    affection_level: 0,
    child_friendly: 0,
    dog_friendly: 0,
    energy_level: 0,
    grooming: 0,
    health_issues: 0,
    intelligence: 0,
    shedding_level: 0,
    social_needs: 0,
    stranger_friendly: 0,
    vocalisation: 0,
    experimental: 0,
    hairless: 0,
    natural: 0,
    rare: 0,
    rex: 0,
    suppressed_tail: 0,
    short_legs: 0,
    wikipedia_url: '',
    hypoallergenic: 0,
    reference_image_id: '',
    image: {
      id: '',
      width: 0,
      height: 0,
      url: ''
    }
  });
  homePath: string = '/home';
  catUrl: string = '';
  catCountryFlagCode: string = '';
  /**
   * variable for show and hide skeleton screen
   */
  isLoadingSK = signal<boolean>(true);
  constructor(
    private catService: CatService,
    private route: ActivatedRoute,
    private externalLinkService: ExternalLinkService
  ) { }

  ngOnInit() {
    this.validateExistingData();
  }
  /**
   *
   */
  validateExistingData(): void {
    const getCurrentCatData: Cat = this.catService.getCurrentCat;
    if (getCurrentCatData.id !== '') {
      this.cat.set(getCurrentCatData);
      this.catUrl = this.cat().image.url;
      this.setCurrentCatOriginFlag(this.cat().country_code);
      this.isLoadingSK.set(false);
    } else {
      this.route.params.subscribe((response: any) => {
        console.log('response: ', response);
        if (response.id) {
          this.getCatById(response.id);
        }
      })
    }
  }
  /**
   *
   * @param catId
   */
  getCatById(catId: string): void {
    this.catService.getCatListById(catId).subscribe((response: CatById[]) => {
      this.cat.set(response[0].breeds[0]);
      this.catUrl = response[0].url;
      this.setCurrentCatOriginFlag(this.cat().country_code);
      this.isLoadingSK.set(false);
    })
  }
  /**
   *
   * @param countryCode
   */
  setCurrentCatOriginFlag(countryCode: string): void {
    this.catCountryFlagCode = `fi fi-${countryCode.toLowerCase()}`;
  }
  /**
   *
   * @param link
   */
  openExternalLink(link:string): void {
    this.externalLinkService.openExternalLink(link);
  }
  /**
   *
   * @param event
   */
  handleRefresh(event: any) {
    setTimeout(() => {
      this.isLoadingSK.set(true);
      // Any calls to load data go here
      this.getCatById(this.cat().id);
      event.target.complete();
    }, 1000);
  }

  ngOnDestroy(): void {
    this.catService.resetCatSelected();
  }

}
