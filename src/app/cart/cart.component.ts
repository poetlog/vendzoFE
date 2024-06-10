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
import { DialogModule } from 'primeng/dialog';
import { StepsModule } from 'primeng/steps';
import { CarouselModule } from 'primeng/carousel';
import { UserService } from '../user.service';
import { concatMap } from 'rxjs';
import { CheckboxModule } from 'primeng/checkbox';
import { CalendarModule } from 'primeng/calendar';

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
    DialogModule,
    StepsModule,
    CarouselModule,
    CheckboxModule,
    CalendarModule,
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

  paymentForm: FormGroup;

  isDiscounted = false;

  discountText = '';

  promoButton = {
    label: 'Kupon Uygula',
    icon: 'pi pi-check',
  }

  purchaseVisible = false;

  activeIndex = 0;

  stepItems = [
    {
      label: 'Adres',
    },
    {
      label: 'Ödeme',
    },
    {
      label: 'Onay',
    }
  ];

  addresses = [];

  selectedShippingAddress:any = null;
  selectedBillingAddress:any = null;

  matchAddresses = true;

  user:any = null;

  cardNo: string = "";

  currentDate = new Date();

  constructor(private itemService: ItemService, 
              private userService: UserService,
              private messageService: MessageService,
              private fb: FormBuilder, 
              private confirmationService: ConfirmationService) {
                this.promoForm =this.fb.group({
                  promo: ['', [Validators.required, Validators.minLength(1)]],
                });
                this.paymentForm =this.fb.group({
                  holder: ['', [Validators.required, Validators.minLength(3)]],
                  cardNo: [null, [Validators.required,Validators.pattern('^\\d{16}$')]],
                  cvc: [null, [Validators.required,Validators.pattern('^\\d{3,4}$')]],
                  expiration: ['', [Validators.required]],
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
    this.resetDiscount();
    this.purchaseVisible = false;
  }

  openPurchase() {
    this.userService.getProfile().pipe(
      concatMap(user => {
        this.user = user;
        return this.userService.getAddresses();
      })
    ).subscribe(data => {
      if(!this.user.isClient)
        this.purchaseVisible = true;
      else {
        this.messageService.add({severity:'error', summary:'Hata', detail:'Satıcı hesaplarından alışveriş yapılamaz.'});
        return;
      }
      this.addresses = data.sort((a:any, b:any) => 
        a.id === this.user.currentAddress ? -1 : b.id === this.user.currentAddress ? 1 : 0
      );
      this.selectedBillingAddress = this.addresses.find((address:any) => address.id === this.user.currentAddress);
      this.selectedShippingAddress = this.addresses.find((address:any) => address.id === this.user.currentAddress);
    });
    
  }

  get visible(): boolean {
    return this._visible;
  }

  resetDiscount(){
    this.promoForm.reset();
    this.isDiscounted = false;
    this.discountText = '';
    this.promoButton = {
      label: 'Kupon Uygula',
      icon: 'pi pi-check',
    }
  }

  selectShippingAddress(address:any){
    this.selectedShippingAddress = address;
    if(this.matchAddresses)
      this.selectedBillingAddress = address;
  }

  confirmPayment(){
    if(this.paymentForm.valid){
      this.cardNo = "**** **** **** " + this.paymentForm.value.cardNo.toString().slice(-4);
      this.activeIndex = 2;
    }
    else{
      this.messageService.add({severity:'error', summary:'Hata', detail:'Ödeme bilgileri eksik veya hatalı!'});
    }
  }


  onDelete(id: number) {
    this.itemService.deleteCartItem(id).subscribe(() => {
      this.itemService.getCartItems().subscribe((data) => {
        this.products = data;
        this.totalPrice = this.products.reduce((acc, product) => acc + product.itemPrice, 0);
        this.productCount = this.products.length;
        this.resetDiscount()
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
        this.resetDiscount();
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
        this.resetDiscount();

      });
    });
  }

  applyPromo() {
    if(this.isDiscounted){
      this.totalPrice = this.products.reduce((acc, product) => acc + product.itemPrice, 0);
      this.resetDiscount();
      this.messageService.add({severity:'warn', detail:'Kupon kodu kaldırıldı.'});
      return;
    } 
    if (this.promoForm.valid) {
      this.itemService.checkPromoCode(this.promoForm.value.promo).subscribe((data) => {
        if (this.isDiscounted) {
          this.messageService.add({severity:'error', summary:'Hata', detail:'Zaten bir kupon uygulandı!'}); 
          return;
        }
        if(data.type === 'percent')
        {
          this.totalPrice = this.totalPrice - (this.totalPrice * data.amount / 100);
          
          this.discountText = '%' + data.amount + " indirim uygulandı.";
        }
        else if(data.type === 'cash')
        {
          this.totalPrice = this.totalPrice - data.amount;
          this.discountText = data.amount + "₺ indirim uygulandı.";
        }
        
        this.promoButton = {
          label: 'Kuponu Kaldır',
          icon: 'pi pi-times',
        }

        this.isDiscounted = true;
        this.messageService.add({severity:'success', summary:'Başarılı', detail:'Kupon başarıyla uygulandı!'});
      }, (error) => {
        this.messageService.add({severity:'error', summary:'Hata', detail:'Kupon kodu geçersiz!'});
      });
    } else {
      this.messageService.add({severity:'error', summary:'Hata', detail:'Kupon kodu boş olamaz!'});
    }
  }

  confirmOrder(){
    if(this.selectedBillingAddress === null || this.selectedShippingAddress === null){
      this.messageService.add({severity:'error', summary:'Hata', detail:'Adres bilgileri eksik!'});
      return;
    }
    this.itemService.createOrder(this.selectedBillingAddress.address1, this.selectedShippingAddress.address1, this.totalPrice).subscribe(() => {
      this.messageService.add({severity:'success', summary:'Başarılı', detail:'Siparişiniz alındı!'});
      this.onDeleteAll();
      this.purchaseVisible = false;
      this.visible = false;
    }, (error) => {
      this.messageService.add({severity:'error', summary:'Hata', detail:'Sipariş oluşturulamadı!'});
    });
  }
}
