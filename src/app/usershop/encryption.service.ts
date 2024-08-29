// encryption.service.ts
import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {
  private secretKey = 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4i5j6k7l8m9n0o1p2q3r4s5t6u7v8w9x0y1z2a3b4c5d6e7f8g9h0i1j2k3l4m5n6o7p8q9r0';


  encrypt(value: string): string {
    return encodeURIComponent(CryptoJS.AES.encrypt(value, this.secretKey).toString());
  }

  decrypt(encryptedValue: string): string {
    const bytes = CryptoJS.AES.decrypt(decodeURIComponent(encryptedValue), this.secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
}
