import { getFirestore, collection, getDocs, query, onSnapshot, doc, getDoc } from "firebase/firestore";

export default class FirebaseControls
{
    constructor()
    {
    }

    getUSerData = async () =>
    {
        const db = getFirestore();
        console.log(db);

        /* const docRef = doc(db, "Users", "user_MFlOGmlmXgXrvy7lFZvUTjhdEFE3");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists())
        {
        console.log("Document data:", docSnap.data());
        }
        else
        {
        console.log("No such document!");
        } */
    }
}