import { Component } from '@angular/core';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ItemService } from '../item.service';
@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [CarouselModule,
    ButtonModule,
    TagModule,
  ],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent {
  products = [];
  responsiveOptions: any[] | undefined;

  constructor(private itemService: ItemService) {}

  ngOnInit() {
    this.itemService.getAllItems().subscribe((data) => {
      if (data.length < 10) {
        data = data.concat(data);
      }
      this.products = data;
    });

   this.responsiveOptions = [
        {
            breakpoint: '1199px',
            numVisible: 1,
            numScroll: 1
        },
        {
            breakpoint: '991px',
            numVisible: 2,
            numScroll: 1
        },
        {
            breakpoint: '767px',
            numVisible: 1,
            numScroll: 1
        }
    ];
}
}
