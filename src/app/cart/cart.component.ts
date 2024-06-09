import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ItemService } from '../item.service';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { InputNumberModule } from 'primeng/inputnumber';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    SidebarModule,
    ButtonModule,
    ScrollPanelModule,
    InputTextModule,
    FloatLabelModule,
    TableModule,
    CommonModule,
    ToastModule,
    ConfirmPopupModule,
    InputNumberModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [MessageService,ConfirmationService],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {

  products: any[] = [];

  productCount = 0;

  totalPrice = 0;

  promoForm: FormGroup;

  isDiscounted = false;


  constructor(private itemService: ItemService, 
              private messageService: MessageService,
              private fb: FormBuilder, 
              private confirmationService: ConfirmationService) {
                this.promoForm =this.fb.group({
                  promo: ['', [Validators.required, Validators.minLength(1)]],
                });
              }

  @Output() visibleChange = new EventEmitter<boolean>();
  private _visible: boolean = false;
  
  @Input()
  set visible(value: boolean) {
    this._visible = value;
    this.visibleChange.emit(this._visible);
    this.itemService.getCartItems().subscribe((data) => {
      this.products = data;
      this.totalPrice = this.products.reduce((acc, product) => acc + product.itemPrice, 0);
      this.productCount = this.products.length;
    });
    this.isDiscounted = false;
  }

  get visible(): boolean {
    return this._visible;
  }

  onDelete(id: number) {
    this.itemService.deleteCartItem(id).subscribe(() => {
      this.itemService.getCartItems().subscribe((data) => {
        this.products = data;
        this.totalPrice = this.products.reduce((acc, product) => acc + product.itemPrice, 0);
        this.productCount = this.products.length;
      });
    });
  }

  confirmDelete(event: Event, id: number) {
    this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: 'Bu ürünü sepetinizden kaldırmak istediğinize emin misiniz?',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Evet',
        rejectLabel: 'Hayır',
        accept: () => {
          this.onDelete(id);
        },
        reject: () => {
        }
    });
  }
  onDeleteAll() {
    this.itemService.deleteCart().subscribe(() => {
      this.itemService.getCartItems().subscribe((data) => {
        this.products = data;
        this.totalPrice = this.products.reduce((acc, product) => acc + product.itemPrice, 0);
        this.productCount = this.products.length;
      });
    });
  }

  confirmDeleteAll(event: Event) {
    this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: 'Sepetinizi boşaltmak istediğinize emin misiniz?',
        icon: 'pi pi-trash',
        acceptLabel: 'Evet',
        rejectLabel: 'Hayır',
        accept: () => {
          this.onDeleteAll();
        },
        reject: () => {
        }
    });
  }

  onChangeQuantity(event: any, id: number, quantity: number, stock: number) {
    if (quantity > stock) {
      this.messageService.add({severity:'error', summary:'Hata', detail:'Stokta yeterli ürün bulunmamaktadır!'});
      return;
    }
    if (quantity < 1) {
      this.messageService.add({severity:'error', summary:'Hata', detail:'Ürün adeti 1\'den küçük olamaz!'});
      return;
    }
    this.itemService.updateCartItemQuantity(id, quantity).subscribe(() => {
      this.itemService.getCartItems().subscribe((data) => {
        this.products = data;
        this.totalPrice = this.products.reduce((acc, product) => acc + product.itemPrice, 0);
        this.productCount = this.products.length;
      });
    });
  }

  applyPromo() {
    
    if (this.promoForm.valid) {
      this.itemService.checkPromoCode(this.promoForm.value.promo).subscribe((data) => {
        if (this.isDiscounted) {
          this.messageService.add({severity:'error', summary:'Hata', detail:'Zaten bir kupon uygulandı!'}); 
          return;
        }
        if(data.type === 'percent')
          this.totalPrice = this.totalPrice - (this.totalPrice * data.amount / 100);
        else if(data.type === 'cash')
          this.totalPrice = this.totalPrice - data.amount;
        this.isDiscounted = true;
        this.messageService.add({severity:'success', summary:'Başarılı', detail:'Kupon başarıyla uygulandı!'});
      }, (error) => {
        this.messageService.add({severity:'error', summary:'Hata', detail:'Kupon kodu geçersiz!'});
      });
    } else {
      this.totalPrice = this.products.reduce((acc, product) => acc + product.itemPrice, 0);
      this.messageService.add({severity:'warn', detail:'Kupon kodu kaldırıldı.'});
    }
  }
}
