import idb from 'idb';

let dbPromised = idb.open('football',1,upgradeDb=>{
    let teamsObjectStore = upgradeDb.createObjectStore('teams',{keyPath:'id'});
    teamsObjectStore.createIndex('name','name',{unique:false})
})
const saveForLater = team=>{
    dbPromised
    .then(db=>{
        const tx = db.transaction('teams','readwrite');
        const store = tx.objectStore('teams');
        store.add(team);
        return tx.complete;
    })
    .then(()=>{
        console.log('Team berhasil disimpan.')
    })
}
const removeSaved = id=>{
  dbPromised
  .then(db=>{
    const tx = db.transaction('teams','readwrite');
    const store = tx.objectStore('teams');
    store.delete(Number(id))
    return tx.complete
  })
}
const getAll = ()=>{
    return new Promise((resolve,reject)=>{
        dbPromised
        .then(db=>{
            const tx = db.transaction('teams','readonly');
            const store = tx.objectStore('teams');
            return store.getAll();
        })
        .then(teams=>{
            if(teams.length){
                resolve(teams)
            }else{
                reject(`
                <div class="row message-container">
                    <img class="message-img" src="/assets/soccer2.png">
                    <div class="col s12">
                        <h1>Currently,No Item Has Been Saved Yet.</h1>
                    </div>
                </div>
                `)
            }
        })
    })
}
const isExist = (id)=>{
  return dbPromised
  .then(db=>{
      const tx = db.transaction('teams','readonly');
      const store = tx.objectStore('teams');
      return store.get(Number(id))
  })
  .then(response=>{
      if(response){
          return `
          <a class="btn-floating red pulse halfway-fab modal-trigger delete-team scale-transition" data-id="${id}" data-target="delete-modal">
              <i class="material-icons">remove</i>
          </a>
          `
      }else{
          return `
          <a class="btn-floating pink pulse halfway-fab modal-trigger save-team scale-transition" data-target="save-modal" data-id="${id}">
              <i class="material-icons">favorite</i>
          </a>
      `
      }
  })
}
export {saveForLater,removeSaved,getAll,isExist}