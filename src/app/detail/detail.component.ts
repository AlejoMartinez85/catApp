import { Component, OnInit, signal } from '@angular/core';
import { CatService } from '../shared/services/cat.service';
import { Cat } from '../shared/interfaces/cat.interface';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
  standalone: true,
})
export class DetailComponent  implements OnInit {
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
  constructor(
    private catService: CatService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.validateExistingData();
  }

  validateExistingData(): void {
    const getCurrentCatData: Cat = this.catService.getCurrentCat;
    if (getCurrentCatData.id !== '') {
      this.cat.set(getCurrentCatData);
    } else {
      this.route.params.subscribe((response: any) => {
        console.log('response: ', response);
        if (response.id) {
          this.getCatById(response.id);
        }
      })
      // this.getCatById();
    }
  }

  getCatById(catId: string): void {
    this.catService.getCatListById(catId).subscribe((response: Cat) => {
      console.log('cat by id: ', response);
    })
  }

}
