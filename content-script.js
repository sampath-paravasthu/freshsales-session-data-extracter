const APP_CONFIG = {
  db: 'fsa-store',
  store: 'application_config',
  permission: 'readonly',
  key: 'session',
};

chrome.runtime.sendMessage({
  from: 'content',
  subject: 'showPageAction',
});


chrome.runtime.onMessage.addListener((msg, sender, response) => {
  if ((msg.from === 'popup') && (msg.subject === 'DOMInfo')) {
    if ("indexedDB" in window) {
      indexedDB.databases()
        .then((dbs) => {
          let { name: dbName, version: dbVersion } = dbs.find((db) => db.name.includes(APP_CONFIG.db));
          let indexedDB = window.indexedDB.open(dbName, dbVersion);
          indexedDB.onsuccess = function () {
            let db = indexedDB.result;
            let transaction = db.transaction(APP_CONFIG.store, APP_CONFIG.permission);
            let storage = transaction.objectStore(APP_CONFIG.store);
            let data = storage.getAll();
            data.onsuccess = function () {
              let config = data.result.find(val => val.apiName === APP_CONFIG.key).config;
              let { accounts, user } = config;
              response({ accountInfo: accounts[0], userInfo: user });
            }
          };
      });
    }
    return true;
  }
});
