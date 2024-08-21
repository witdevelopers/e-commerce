import { Injectable } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";
import { defer, finalize, NEVER, share } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class LoaderService{
    public isLoading:boolean=false
    
    public readonly loader$ = defer(() => {
        this.isLoading=true;
         return NEVER.pipe(
           finalize(() => {
             this.isLoading=false;
           })
         );
       }).pipe(share());    
}