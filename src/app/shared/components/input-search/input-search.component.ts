import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-input-search',
  templateUrl: './input-search.component.html',
  styleUrls: ['./input-search.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class InputSearchComponent {
  /**
   * output variable
   */
  @Output() search = new EventEmitter<string>();
  constructor() { }
  /**
   *
   * @param event
   */
  handleInput(event: any): void {
    const query = event.target.value.toLowerCase();
    console.log('query: ', query);
    this.search.emit(query);
  }

}