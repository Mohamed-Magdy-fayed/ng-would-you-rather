import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

const storage = getStorage()

export const upload = async (file: any) => {
    let url = ''
    const storageRef = ref(storage, `${file.name}`)
    await uploadBytes(storageRef, file)
    .then(snapshot => getDownloadURL(snapshot.ref)
    .then(link => url = link))
    return url
}