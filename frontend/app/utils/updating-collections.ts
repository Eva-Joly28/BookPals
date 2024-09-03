import { hasManyToArray } from "./has-many-to-array";
import { updateRecord } from "./update-model";

export async function updatePal(book:any, mode:string, user: any){
    await user.reload();
    await book.reload();
    if(mode === 'filter'){
        await book.reload();
        let id = hasManyToArray(user.booksToRead).findIndex(b=>b.id===book.id);
        (hasManyToArray(user.booksToRead)).splice(id, 1);
        // user.booksToRead = user.booksToRead.filter((b:any)=>{
        //     b.id !== book.id
        // })
    }
    else{
        
        user.booksToRead.push(book);
    }
    let data = {
        "data": {
            "id": `${user.id}`,
            "type": "users",
            "relationships": {
                "booksToRead": {
                    "data": user.booksToRead.map((book:any) => ({
                            type: 'books',
                            id: book.id,
                        }))
                }
            }
         }
        }
    let response = await updateRecord('users',user.id,data);
}

export async function updateInProgress(book:any, mode:string, user: any){
    await user.reload();
    await book.reload();
    if(mode === 'filter'){
        await book.reload();
        user.booksInProgress = user.booksInProgress.filter((b:any)=>{
            b.id !== book.id
        })
    }
    else{
        
        user.booksInProgress.push(book);
    }
    let data = {
        "data": {
            "id": `${user.id}`,
            "type": "users",
            "relationships": {
                "booksInProgress": {
                    "data": user.booksInProgress.map((book:any) => ({
                            type: 'books',
                            id: book.id,
                        }))
                }
            }
         }
        }
    let response = await updateRecord('users',user.id,data);
}

export async function updateRead(book:any, mode:string, user: any){
    await user.reload();
    await book.reload();
    if(mode === 'filter'){
        await book.reload();
        user.readBooks = user.readBooks.filter((b:any)=>{
            b.id !== book.id
        })
    }
    else{
        
        user.readBooks.push(book);
    }
    let data = {
        "data": {
            "id": `${user.id}`,
            "type": "users",
            "relationships": {
                "readBooks": {
                    "data": user.readBooks.map((book:any) => ({
                            type: 'books',
                            id: book.id,
                        }))
                }
            }
         }
        }
    let response = await updateRecord('users',user.id,data);
}

export async function updateWishlist(book:any, mode:string, user: any){
    await user.reload();
    await book.reload();
    if(mode === 'filter'){
        await book.reload();
        user.wishList = user.wishList.filter((b:any)=>{
            b.id !== book.id
        })
    }
    else{
        
        user.wishList.push(book);
    }
    let data = {
        "data": {
            "id": `${user.id}`,
            "type": "users",
            "relationships": {
                "wishList": {
                    "data": user.wishList.map((book:any) => ({
                            type: 'books',
                            id: book.id,
                        }))
                }
            }
         }
        }
    let response = await updateRecord('users',user.id,data);
}

export async function updateFollowing(follow:any, mode:string, user: any){
    await user.reload();
    await follow.reload();
    if(mode === 'filter'){
        await follow.reload();
        user.following = user.following.filter((b:any)=>{
            b.id !== follow.id
        })
    }
    else{
        
        user.following.push(follow);
    }
    let data = {
        "data": {
            "id": `${user.id}`,
            "type": "users",
            "relationships": {
                "following": {
                    "data": user.following.map((follow:any) => ({
                            type: 'user',
                            id: follow.id,
                        }))
                }
            }
         }
        }
    let response = await updateRecord('users',user.id,data);
}

export async function updateStatus(user: any, value:number){
    let finalValue = parseInt(user.status) + value;

    let data = {
        "data": {
            "id": `${user.id}`,
            "type": "users",
            "attributes": {
                "status": finalValue
            }
            }
        }
    let response = await updateRecord('users',user.id,data);
}