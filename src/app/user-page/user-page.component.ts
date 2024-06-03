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
import { tap } from 'rxjs/operators';
import { InputNumberModule } from 'primeng/inputnumber';
import { PasswordModule } from 'primeng/password';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CheckboxModule } from 'primeng/checkbox';

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
  ],
  templateUrl: './user-page.component.html',
  styleUrl: './user-page.component.css',
  providers: [ConfirmationService, MessageService]

  
})
export class UserPageComponent implements OnInit {
  user : any;
  addresses: any;
  userDisabled = true;
  emailDisabled = true;
  telDisabled = true;
  resetForm: FormGroup;
  addressForm: FormGroup;
  isLoading = false;
  addAddressDialog: boolean = false;

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
        title: ['', [Validators.required, Validators.minLength(3)]],
        contact: [null, [Validators.required, Validators.maxLength(10),Validators.minLength(10)]],
        details: ['', [Validators.required, Validators.minLength(5)]],
        isDefault : [true]
      });
    }

  ngOnInit(): void {
    //this.authService.isTokenExpired(localStorage.getItem('authToken'));
    this.userService.getProfile().subscribe(data => {
      this.user = data;
    });
    this.userService.getAddresses().subscribe(data => {
      this.addresses = data;
    });
  }

  showAddAddressDialog() {
    this.addAddressDialog = true;
  }

  closeAddAddressDialog() {
    this.addressForm.reset({ isDefault: true });
    this.addAddressDialog = false;
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
            this.closeAddAddressDialog();
          },
          error: error => {
            this.isLoading = false;
            this.messageService.add({ severity: 'error', summary: 'Hata', detail: 'Bilgilerinizi kontrol ediniz.', life: 3000 });
          }
        })
      ).subscribe();
    }
    
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

      if(this.user.username.length < 3) {
        this.messageService.add({ severity: 'error', summary: 'Hata', detail: 'Kullanıcı Adı En Az 3 Karakter Olmalı', life: 3000 });
        return resolve(false);
      }

      if(this.user.email === '') {
        this.messageService.add({ severity: 'error', summary: 'Hata', detail: 'Email Boş Olamaz', life: 3000 });
        return resolve(false);
      }

      if(this.user.contactNo && 
        this.user.contactNo.toString().length != 10 && 
        this.user.contactNo.toString().length != 0) {
          this.messageService.add({ severity: 'error', summary: 'Hata-Telefon', detail: 'Lütfen Formata Uyunuz', life: 3000 });
          return resolve(false);
      }
      else this.user.contactNo = this.user.contactNo.toString();

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

}
