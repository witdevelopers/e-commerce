import { Inject, Injectable, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Settings } from '../app-setting';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContractService {

  tronWeb: any;

  account: string = ''
  accountChange: Subject<string> = new Subject<string>();
  constructor(@Inject('Window') private window: any,) {

   // this.initTronWeb()
  }

  initTronWeb() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          this.tronWeb = (window as any).tronWeb;
          console.log(this.tronWeb)

          if (!(this.tronWeb && this.tronWeb.defaultAddress.base58)) {
            // Swal.fire('', '', 'error')
            Swal.fire('', 'You must have TronLink in your device!', 'error')
            resolve(false)
          }
          resolve(true)
        }
        catch (e: any) {
          Swal.fire('', e, 'error')
          resolve(false)
        }
      }, 500);
    })
  }

  async getAddress() {
    try {
      if (await this.initTronWeb()) {
        this.account = this.tronWeb.defaultAddress.base58;

        // Set up an interval to check for address changes
        setInterval(() => {
          if (this.tronWeb.defaultAddress.base58 !== this.account) {
            this.account = this.tronWeb.defaultAddress.base58;
            this.accountChange.next(this.account);
            this.fetchAddressBalance()
          }
        }, 1000); // Checks every second

        return this.account;
      }
      return "";
    }
    catch (e: any) {
      Swal.fire('', e, 'error')
      return this.account;
    }
  }

  async getContract(CONTRACT_ADDRESS: string) {
    if (this.initTronWeb()) {
      try {
        var contract_info = await this.tronWeb.trx.getContract(CONTRACT_ADDRESS);
        if (contract_info) {
          return await this.tronWeb.contract(contract_info.abi.entrys, CONTRACT_ADDRESS);
        } else {
          Swal.fire('', "Something went wrong!", 'error')
        }
      } catch (err: any) {
        Swal.fire('', err, 'error')
      }
    }
  }

  async approveUSDT() {
    // try {
    let contract = await this.getContract(Settings.tokenContractAddress);
    //console.log(contract);
    let txId = await contract.approve(Settings.contractAddress, "115792089237316195423570985008687907853269984665640564039457584007913129639935").send({
      from: this.tronWeb.defaultAddress.base58,
      callValue: 0
    });

    return txId;
    // } catch (err: any) {
    //   this.toastr.error(err);
    // }
  }

  async getUSDTAllowance(ownerAddress: string, spenderAddress: string) {
    // try {
    let contract = await this.getContract(Settings.tokenContractAddress);
    //console.log(contract);
    let amount = await contract.allowance(ownerAddress, spenderAddress).call();

    return amount;
    // } catch (err: any) {
    //   this.toastr.error(err);
    // }
  }

  async fetchAddressBalance() {
    await this.getAddress();
    let balance = (await this.tronWeb.trx.getBalance(this.account));
    // console.log(balance)
    return balance/1000000;
  }

  async registerUser(sponsorAddress: string, amount: number, packageId: number) {
    try {
      let contract = await this.getContract(Settings.contractAddress);
      //console.log(contract);
      let txId = await contract.Join(sponsorAddress, packageId).send({
        from: this.tronWeb.defaultAddress.base58,
        callValue: amount * 1000000
      });

      return { success: true, data: txId, message: "Ok!" };
    } catch (err: any) {
      console.log(err);

      return { success: false, data: '', message: 'Some error occurred!' };
    }
  }

  async Reinvest(amount: number, packageId: number) {
    // try {
    let contract = await this.getContract(Settings.contractAddress);
    //console.log(contract);
    let txId = await contract.Reinvest(packageId).send({
      from: this.tronWeb.defaultAddress.base58,
      callValue: amount * 1000000
    });

    return txId;
    // } catch (err: any) {
    //   this.toastr.error(err);
    // }
  }

  async getTransactionConfirmationCount(txId: string) {

    return new Promise((resolve, reject) => {

      let intervalId = setInterval(async () => {

        let currentBlock = await this.tronWeb.trx.getCurrentBlock();
        if (currentBlock) {
          let txDetails = await this.tronWeb.trx.getTransaction(txId);
          // console.log(currentBlock)
          if (txDetails) {
            if (txDetails.ret[0]["contractRet"] == 'SUCCESS') {
              // console.log("here", txDetails.raw_data)

              // if (txDetails.raw_data.timestamp) {
              //   let countConfirmation = txDetails.blockNumber === null ? 0 : currentBlock.block_header.raw_data.number - txDetails.blockNumber.raw_data.timestamp;
              //   if (countConfirmation > 0) {
              clearInterval(intervalId);
              resolve(1);
              //   }
              // }
            } else {
              clearInterval(intervalId);
              reject(-1);
            }
          }
          else {
            clearInterval(intervalId);
            reject(-1);
          }
        }
        else {
          clearInterval(intervalId);
          reject(-1);
        }
      }, 1000);
    });
  }

  async signMessage(message: string) {
    if (this.initTronWeb()) {
      let messageHex = this.hexEncode(message);
      var signature = await this.tronWeb.trx.signMessage(messageHex);
      //console.log(signature);

      return signature;
    }
    return "";
  }

  hexEncode(text: string) {
    var hex, i;

    var result = "";
    for (i = 0; i < text.length; i++) {
      hex = text.charCodeAt(i).toString(16);
      result += hex;
    }

    return result;
  }

  verifySignature(message, address, signature, useTronHeader = false) {
    const TRX_MESSAGE_HEADER = '\x19TRON Signed Message:\n32';
    // it should be: '\x15TRON Signed Message:\n32';
    const ETH_MESSAGE_HEADER = '\x19Ethereum Signed Message:\n32';
    const ADDRESS_PREFIX = "41";

    console.log(this.tronWeb.utils.ethersUtils.toUtf8Bytes(TRX_MESSAGE_HEADER))
    message = message.replace(/^0x/, '');
    signature = signature.replace(/^0x/, '');

    const messageBytes = [
      ...this.tronWeb.utils.ethersUtils.toUtf8Bytes(useTronHeader ? TRX_MESSAGE_HEADER : ETH_MESSAGE_HEADER),
      ...this.tronWeb.utils.code.hexStr2byteArray(message)
    ];

    console.log(messageBytes)
    const messageDigest = this.tronWeb.utils.ethersUtils.keccak256(messageBytes);
    console.log("digest", messageDigest);

    const recovered = this.tronWeb.utils.ethersUtils.recoverAddress(messageDigest, {
      recoveryParam: signature.substring(128, 130) == '1c' ? 1 : 0,
      r: '0x' + signature.substring(0, 64),
      s: '0x' + signature.substring(64, 128)
    });

    const tronAddress = ADDRESS_PREFIX + recovered.substr(2);
    const base58Address = this.tronWeb.address.fromHex(tronAddress);

    return base58Address == this.tronWeb.address.fromHex(address);
  }
}
