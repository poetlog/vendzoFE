import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ItemService } from '../item.service';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';


@Component({
  selector: 'app-item',
  standalone: true,
  imports: [DialogModule,
    ButtonModule,
    CommonModule,
    ToastModule,
  ],
  templateUrl: './item.component.html',
  providers: [MessageService],
  styleUrl: './item.component.css'
  
})
export class ItemComponent {
  @Output() visibleChange = new EventEmitter<boolean>();
  private _item: any;
  private _visible: boolean = false;
  seller: string = '';
  isLoggedIn: boolean = false;

  constructor(private itemService: ItemService, 
    private authService: AuthService,
    private messageService: MessageService) {}

  @Input()
  set visible(value: boolean) {
    this._visible = value;
    this.visibleChange.emit(this._visible);
  }

  get visible(): boolean {
    return this._visible;
  }

  @Input()
  set item(value: any) {
    this._item = value;
    this.itemService.getSellerOfItem(this._item.id).subscribe((data) => {
      this.seller = data.username;
    });
    this.isLoggedIn = this.authService.isAuthenticated();
  }

  get item(): any {
    return this._item;
  }

  closeDialog() {
    this.visible = false;
  }

  onAddToCart() {
    if(this.isLoggedIn) {
      this.itemService.addToCart(this._item.id).subscribe(
        (data) => {
          this.messageService.add({severity:'success', summary:'Başarılı', detail:'Ürün sepetinize eklendi!'});
        },
        (error) => {
          console.error('Error:', error);
          this.messageService.add({severity:'warn', detail:'Ürün zaten sepetinizde.'});
        });
    } else {
      this.messageService.add({severity:'error', summary:'Hata', detail:'Sepetinize ürün eklemek için giriş yapmalısınız!'});
    }
  }
}
