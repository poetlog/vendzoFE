import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { UserService } from '../user.service';
import { CommonModule } from '@angular/common';
import { TabViewModule } from 'primeng/tabview';
import { FieldsetModule } from 'primeng/fieldset';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TagModule } from 'primeng/tag';
import { concatMap, tap } from 'rxjs/operators';
import { InputNumberModule } from 'primeng/inputnumber';
import { PasswordModule } from 'primeng/password';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CheckboxModule } from 'primeng/checkbox';
import { ChipModule } from 'primeng/chip';
import { BadgeModule } from 'primeng/badge';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { DataViewModule } from 'primeng/dataview';
import { AccordionModule } from 'primeng/accordion';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-user-page',
  standalone: true,
  imports: [
    TabViewModule,
    FieldsetModule,
    InputTextModule,
    FormsModule,
    FloatLabelModule,
    ButtonModule,
    ToastModule,
    ConfirmPopupModule,
    TagModule,
    InputNumberModule,
    PasswordModule,
    ReactiveFormsModule,
    CardModule,
    DialogModule,
    InputTextareaModule,
    CheckboxModule,
    CommonModule,
    ChipModule,
    BadgeModule,
    MenuModule,
    ScrollPanelModule,
    DataViewModule,
    AccordionModule,
    TableModule,
  ],
  templateUrl: './user-page.component.html',
  styleUrl: './user-page.component.css',
  providers: [ConfirmationService, MessageService]

  
})
export class UserPageComponent implements OnInit {
  user : any;
  userDisabled = true;
  emailDisabled = true;
  telDisabled = true;
  resetForm: FormGroup;
  addressForm: FormGroup;
  itemForm: FormGroup;
  itemEditForm: FormGroup;
  isLoading = false;
  addAddressDialog: boolean = false;
  addItemDialog: boolean = false;
  editItemDialog: boolean = false;
  itemToEdit:string = '';
  addresses = [];
  items = [];
  orders: any[] = []
  currentOrderEntries: any[] = [];

  
  constructor(private fb: FormBuilder,
    private authService: AuthService, 
    private userService: UserService,
    private confirmationService: ConfirmationService, 
    private messageService: MessageService) { 
      this.resetForm = this.fb.group({
        passwordOld: ['', [Validators.required, Validators.minLength(8)]],
        passwordNew: ['', [Validators.required, Validators.minLength(8)]]
      });
      this.addressForm = this.fb.group({
        title: ['', [Validators.required, Validators.minLength(3),Validators.maxLength(25)]],
        contact: [null, [Validators.required, Validators.pattern(/^\d{10}$/)]],
        details: ['', [Validators.required, Validators.minLength(5),Validators.maxLength(150)]],
        isDefault : [true]
      });
      this.itemForm = this.fb.group({
        title: ['', [Validators.required, Validators.minLength(3),Validators.maxLength(50)]],
        category: ['', [Validators.required, Validators.minLength(3),Validators.maxLength(50)]],
        description: ['', [Validators.required, Validators.minLength(5),Validators.maxLength(150)]],
        photo: ['', [Validators.maxLength(500)]],
        price: [0, [Validators.required, Validators.min(0)]],
        stock: [0, [Validators.required, Validators.min(0)]]
      });
      this.itemEditForm = this.fb.group({
        title: ['', [Validators.required, Validators.minLength(3),Validators.maxLength(50)]],
        category: ['', [Validators.required, Validators.minLength(3),Validators.maxLength(50)]],
        description: ['', [Validators.required, Validators.minLength(5),Validators.maxLength(150)]],
        photo: ['', [Validators.maxLength(500)]],
        price: [0, [Validators.required, Validators.min(0)]],
        stock: [0, [Validators.required, Validators.min(0)]]
      });
    }

    ngOnInit(): void {
      this.userService.getProfile().pipe(
        concatMap(user => {
          this.user = user;
          if(user.isClient){
            this.userService.getItems().subscribe(data => {
              this.items = data;
            });
            this.userService.getOrdersOfSeller().subscribe(data => {
              this.orders = data;
            });
          } else {
            this.userService.getOrders().subscribe(data => {
              this.orders = data;
            });
          }
          return this.userService.getAddresses();
        })
      ).subscribe(data => {
        this.addresses = data.sort((a:any, b:any) => 
          a.id === this.user.currentAddress ? -1 : b.id === this.user.currentAddress ? 1 : 0
        );
      });
      
    }

  refreshAddresses(): void {
    this.userService.getProfile().pipe(
      concatMap(user => {
        this.user = user;
        return this.userService.getAddresses();
      })
    ).subscribe(data => {
      this.addresses = data.sort((a:any, b:any) => 
        a.id === this.user.currentAddress ? -1 : b.id === this.user.currentAddress ? 1 : 0
      );
    });
  }

  showAddAddressDialog() {
    if(this.addresses.length >= 5) {
      this.messageService.add({ severity: 'error', summary: 'Hata', detail: 'En Fazla 5 Adres Ekleyebilirsiniz.', life: 3000 });
      return;
    }
    if(this.addresses.length === 0) this.addressForm.value.isDefault = true;
    this.addAddressDialog = true;
  }

  showAddItemDialog() {
    if(this.items.length >= 25) {
      this.messageService.add({ severity: 'error', summary: 'Hata', detail: 'En Fazla 25 Ürün Ekleyebilirsiniz.', life: 3000 });
      return;
    }
    this.addItemDialog = true;
  }

  showEditItemDialog(item: any) {
    if(item !== null) {
      this.itemEditForm.setValue({
        title: item.title,
        category: item.category,
        description: item.description,
        photo: item.photo,
        price: item.price,
        stock: item.stock
      });
      this.itemToEdit = item.id;
      this.editItemDialog = true;
    }
    return;
  }

  closeAddAddressDialog() {
    this.addressForm.reset({ isDefault: true });
    this.addAddressDialog = false;
  }
  closeAddItemDialog() {
    this.itemForm.reset();
    this.addItemDialog = false;
  }
  closeEditItemDialog() {
    this.itemEditForm.reset({ isDefault: true });
    this.editItemDialog = false;
  }


  signOut(): void {
    this.authService.logout();
  }

  onReset() {
    if (this.resetForm.valid) {
      if (this.resetForm.get('passwordOld')?.value === this.resetForm.get('passwordNew')?.value) {
        this.messageService.add({ severity: 'error', summary: 'Hata', detail: 'Yeni Şifre Eski Şifre İle Aynı Olamaz', life: 3000 });
        return;
      }

      this.isLoading = true;
      this.userService.changePassword(this.resetForm.value.passwordOld, this.resetForm.value.passwordNew).pipe(
        tap({
          next: data => {
            this.isLoading = false;
            this.messageService.add({ severity: 'success', summary: 'Başarılı', detail: 'Şifreniz Değiştirildi', life: 3000 });
            this.resetForm.reset();
          },
          error: error => {
            this.isLoading = false;
            this.messageService.add({ severity: 'error', summary: 'Hata', detail: 'Bilgilerinizi kontrol ediniz.', life: 3000 });
          }
        })
      ).subscribe();
    }
  }

  onAddAddress(): void {
    if (this.addressForm.valid) {
      this.userService.addAddress(this.addressForm.value).pipe(
        tap({
          next: data => {
            this.isLoading = false;
            this.messageService.add({ severity: 'success', summary: 'Başarılı', detail: 'Adres Eklendi', life: 3000 });
            this.refreshAddresses();
            this.closeAddAddressDialog();
          },
          error: error => {
            this.isLoading = false;
            this.messageService.add({ severity: 'error', summary: 'Hata', detail: 'Bilgilerinizi kontrol ediniz.', life: 3000 });
          }
        })
      ).subscribe();
    }
    else {
      this.messageService.add({ severity: 'error', summary: 'Hata', detail: 'Bilgilerinizi kontrol ediniz.', life: 3000 });
    }
  }

  onAddItem(): void {
    if (this.itemForm.valid) {
      this.userService.addItem(this.itemForm.value).pipe(
        tap({
          next: data => {
            this.messageService.add({ severity: 'success', summary: 'Başarılı', detail: 'Ürün Eklendi', life: 3000 });
            this.userService.getItems().subscribe(data => {
              this.items = data;
            });
            this.closeAddItemDialog();
          },
          error: error => {
            this.messageService.add({ severity: 'error', summary: 'Hata', detail: 'Bilgilerinizi kontrol ediniz.', life: 3000 });
          }
        })
      ).subscribe();
    }
    else {
      this.messageService.add({ severity: 'error', summary: 'Hata', detail: 'Bilgilerinizi kontrol ediniz.', life: 3000 });
    }
  }

  onEditItem(): void {
    if (this.itemEditForm.valid) {
      this.userService.editItem(this.itemToEdit, this.itemEditForm.value).pipe(
        tap({
          next: data => {
            this.messageService.add({ severity: 'success', summary: 'Başarılı', detail: 'Ürün Güncellendi', life: 3000 });
            this.userService.getItems().subscribe(data => {
              this.items = data;
            });
            this.closeEditItemDialog();
          },
          error: error => {
            this.messageService.add({ severity: 'error', summary: 'Hata', detail: 'Bilgilerinizi kontrol ediniz.', life: 3000 });
          }
        })
      ).subscribe();
    }
    else {
      this.messageService.add({ severity: 'error', summary: 'Hata', detail: 'Bilgilerinizi kontrol ediniz.', life: 3000 });
    }
  }

  onSetDefaultAddress(addressId: string): void {
    this.userService.setDefaultAddress(addressId).pipe(
      tap({
        next: data => {
          this.messageService.add({ severity: 'success', summary: 'Başarılı', detail: 'Adres Varsayılan Olarak Ayarlandı', life: 3000 });
          this.refreshAddresses();
        },
        error: error => {
          this.messageService.add({ severity: 'error', summary: 'Hata', detail: 'Bilgilerinizi kontrol ediniz.', life: 3000 });
        }
      })
    ).subscribe();
  }

  onDeleteAddress(addressId: string): void {
    this.userService.deleteAddress(addressId).pipe(
      tap({
        next: data => {
          this.messageService.add({ severity: 'success', summary: 'Başarılı', detail: 'Adres Silindi', life: 3000 });
          this.refreshAddresses();
          //this.addresses = this.addresses.filter((address: any) => address.id !== addressId);
        },
        error: error => {
          this.messageService.add({ severity: 'error', summary: 'Hata', detail: 'Bilgilerinizi kontrol ediniz.', life: 3000 });
        }
      })
    ).subscribe();
  }

  onDeleteItem(itemId: string): void {
    this.userService.deleteItem(itemId).pipe(
      tap({
        next: data => {
          this.messageService.add({ severity: 'success', summary: 'Başarılı', detail: 'Ürün Silindi', life: 3000 });
          this.userService.getItems().subscribe(data => {
            this.items = data;
          });
        },
        error: error => {
          this.messageService.add({ severity: 'error', summary: 'Hata', detail: 'Bilgilerinizi kontrol ediniz.', life: 3000 });
        }
      })
    ).subscribe();
  }

  async editUsername(): Promise<void> {
    if(this.userDisabled) {
      this.userDisabled = false;
    } else{
        this.userDisabled = await this.updateProfile();
      }
  }

  async editEmail(): Promise<void> {
    if(this.emailDisabled) {
      this.emailDisabled = false;
    } else{
        this.emailDisabled = await this.updateProfile();
      }
  }

  async editTel(): Promise<void> {
    if(this.telDisabled) {
      this.telDisabled = false;
    } else{
        this.telDisabled = await this.updateProfile();
      }
  }

  updateProfile(): Promise<boolean> {
    return new Promise((resolve, reject) => {

      if( this.user.username.length < 3 || 
          this.user.username.length > 50 || 
          this.user.username === '' || 
          this.user.username === null || 
          this.user.username === undefined || 
          this.user.username === ' ') {
        this.messageService.add({ severity: 'error', summary: 'Hata', detail: 'Kullanıcı Adını Kontrol Ediniz', life: 3000 });
        return resolve(false);
      }

      if(this.user.email.length < 3 || 
        this.user.email.length > 50 || 
        this.user.email === '' || 
        this.user.email === null || 
        this.user.email === undefined || 
        this.user.email === ' ') {
        this.messageService.add({ severity: 'error', summary: 'Hata', detail: 'Emaili Kontrol Ediniz', life: 3000 });
        return resolve(false);
      }

      if(this.user.contactNo != null || this.user.contactNo != undefined) {
        if(this.user.contactNo && 
          this.user.contactNo.toString().length != 10 && 
          this.user.contactNo.toString().length != 0) {
            this.messageService.add({ severity: 'error', summary: 'Hata-Telefon', detail: 'Lütfen Formata Uyunuz', life: 3000 });
            return resolve(false);
        }
        else this.user.contactNo = this.user.contactNo.toString();
      }

      this.userService.updateProfile(this.user).pipe(
        tap({
          next: data => {
            console.log(data);
            this.messageService.add({ severity: 'success', summary: 'Başarılı', detail: 'Profil Güncellendi', life: 3000 });
            return resolve(true);
          },
          error: error => {
            this.messageService.add({ severity: 'error', summary: 'Hata', detail: "Bilgilerinizi kontrol ediniz.", life: 3000 });
            return resolve(false);
          }
        })
      ).subscribe();
    });
  }
  confirm1(event: Event) {
    this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: 'Çıkmak istediğinizden emin misiniz?',
        icon: 'pi pi-sign-out',
        acceptLabel: 'Evet',
        rejectLabel: 'Hayır',
        accept: () => {
            this.messageService.add({ severity: 'info', summary: 'Çıkış Yaptınız.', life: 3000 });
            this.signOut();
        },
        reject: () => {
            //this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
        }
    });
  }
  confirm2(event: Event) {
    this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: 'Şifrenizi değiştirmek istediğize emin misiniz?',
        icon: 'pi pi-lock',
        acceptLabel: 'Evet',
        rejectLabel: 'Hayır',
        accept: () => {
            this.onReset();
        },
        reject: () => {
            //this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
        }
    });
  }
  confirm3(event: Event, id: string) {
    this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: 'Bu adresi varsayılan olarak ayarlamak istediğinize emin misiniz?',
        icon: 'pi pi-pen-to-square',
        acceptLabel: 'Evet',
        rejectLabel: 'Hayır',
        accept: () => {
          this.onSetDefaultAddress(id);
        },
        reject: () => {
            //this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
        }
    });
  }
  confirm4(event: Event, id: string) {
    this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: 'Bu adresi silmek istediğinize emin misiniz?',
        acceptButtonStyleClass: 'p-button-danger p-button-sm',
        rejectButtonStyleClass: 'p-button-danger p-button-outlined p-button-sm',
        icon: 'pi pi-trash',
        acceptLabel: 'Evet',
        rejectLabel: 'Hayır',
        accept: () => {
          this.onDeleteAddress(id);
        },
        reject: () => {
            //this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
        }
    });
  }
  confirm5(event: Event, id: string) {
    this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: 'Bu ürünü silmek istediğinize emin misiniz?',
        acceptButtonStyleClass: 'p-button-danger p-button-sm',
        rejectButtonStyleClass: 'p-button-danger p-button-outlined p-button-sm',
        icon: 'pi pi-trash',
        acceptLabel: 'Evet',
        rejectLabel: 'Hayır',
        accept: () => {
          this.onDeleteItem(id);
        },
        reject: () => {
            //this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
        }
    });
  }
  formatDate(date: string) {
    let orderDate = new Date(date);
    let minutes = orderDate.getMinutes().toString().padStart(2, '0');
    return `${orderDate.getDate()}/${orderDate.getMonth() + 1}/${orderDate.getFullYear()} ${orderDate.getHours()}:`+minutes;
  }

  getOrderEntries( orderId:string): any{
    this.userService.getOrderDetails(orderId).subscribe((data)=>{
      this.currentOrderEntries = data;
    })
  }

  setEntryStatus(entryId: string, status: string): void {
    this.userService.setEntryStatus(entryId, status).pipe(
      tap({
        next: data => {
          this.messageService.add({ severity: 'success', summary: 'Başarılı', detail: 'Durum Güncellendi', life: 3000 });
          this.userService.getOrdersOfSeller().subscribe(data => {
            this.orders = data;
          });
        },
        error: error => {
          this.messageService.add({ severity: 'error', summary: 'Hata', detail: 'Bilgilerinizi kontrol ediniz.', life: 3000 });
        }
      })
    ).subscribe();
  }

}
