import { Injectable } from '@angular/core';
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor() { }

  storage = getStorage()

  upload = async (file: any): Promise<Observable<string>> => {
    const storageRef = ref(this.storage, `${file.name}`)
    let x = ''
    let url: any = of(await uploadBytes(storageRef, file)
    .then(snapshot => getDownloadURL(snapshot.ref)
    .then(link => x = link))
    )
    return url
}
}
