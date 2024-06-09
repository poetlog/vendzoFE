import { Component } from '@angular/core';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ItemService } from '../item.service';
import { DataViewModule } from 'primeng/dataview';
import { SelectItem } from 'primeng/api';
import { DataView } from 'primeng/dataview';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ScrollTopModule } from 'primeng/scrolltop';
import { FormsModule } from '@angular/forms';
import { PaginatorModule } from 'primeng/paginator';
import { DialogModule } from 'primeng/dialog';
import { ItemComponent } from '../item/item.component';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [CarouselModule,
    ButtonModule,
    TagModule,
    DataViewModule,
    DropdownModule,
    InputTextModule,
    ScrollTopModule,
    FormsModule,
    PaginatorModule,
    DialogModule,
    ItemComponent,
  ],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent {
  products = [];
  productCount = 0;
  productsHeader = [];
  productsSideTop = [];
  productsSideBottom = [];
  responsiveOptions: any[] | undefined;
  sortOptions: SelectItem[] = [];
  searchTerm: string = '';
  category: string = '';
  first: number = 0;
  rows: number = 10;
  itemDialogVisible: boolean = false;
  selectedItem: any = null;

  constructor(private itemService: ItemService) {}

  ngOnInit() {
    this.itemService.getFeaturedItems().subscribe((data) => {
      while (data.length < 20) {
        data = data.concat(data);
      }
      this.productsHeader = data.slice(0, 9);
      this.productsSideBottom = data.slice(10, 19);
    });

    this.itemService.getItemsSortedByDateDesc(1).subscribe((data) => {
      this.productsSideTop = data;
    });

    this.itemService.getItemCount().subscribe((data) => {
      this.productCount = data;
    });

    this.itemService.getAllItemsByPage(1).subscribe((data) => {
      /*while (data.length < 9) { //todo: remove
        data = data.concat(data);
      }*/
      this.products = data;
    }
    );
    
    this.sortOptions = [
      { label: 'Önerilen', value: 'default' },
      { label: 'Fiyat Azdan Çoka', value: 'priceAsc' },
      { label: 'Fiyat Çokdan Aza', value: 'priceDesc' },
      { label: 'Eski Ürünler', value: 'dateAsc' },
      { label: 'Yeni Ürünler', value: 'dateDesc' },
      { label: 'Alfabetik', value: 'title' }
  ];
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

  onPageChange(event: any) {
    this.itemService.getAllItemsByPage(event.page + 1).subscribe((data) => {
      this.products = data;
    });
    this.first = event.first;
    this.rows = event.rows;
  }

  showItemDialog(item: any) {
    this.itemDialogVisible = true
    this.selectedItem = item;
  }

  searchProducts() {
    console.log(this.searchTerm)
    this.searchTerm.trim();
    if (this.searchTerm && this.searchTerm.length > 1) {
      this.itemService.getItemsBySearch(this.searchTerm, 1).subscribe((data) => {
        this.products = data;
        this.productCount = data.length;
      });
    } else {
      this.itemService.getAllItemsByPage(1).subscribe((data) => {
        this.products = data;
      });
    }
  }

  filterProducts() {
    this.category.trim();
    if (this.category && this.category.length > 1) {
      this.itemService.getItemsByCategory(this.category, 1).subscribe((data) => {
        this.products = data;
        this.productCount = data.length;
      });
    } else {
      this.itemService.getAllItemsByPage(1).subscribe((data) => {
        this.products = data;
      });
    }
  }

  onSortChange(event: any) {
    const value = event.value;
    if (value === 'default') {
      this.itemService.getAllItemsByPage(1).subscribe((data) => {
        this.products = data;
      });
    } else {
      this.itemService.getItemsSorted(value, 1).subscribe((data) => {
        this.products = data;
      });
    }
  }

}
