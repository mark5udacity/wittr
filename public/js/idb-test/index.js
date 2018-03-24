/* eslint-disable no-case-declarations */
import idb from 'idb';

const CUR_IDB_VERSION = 4;

const dbPromise = idb.open('test-db', CUR_IDB_VERSION, upgradeDb => {
  switch (upgradeDb.oldVersion) {
    case 0:
      const keyValStore = upgradeDb.createObjectStore('keyval');
      keyValStore.put("world", "hello");
      // intentional fallthrough
    case 1:
      upgradeDb.createObjectStore('people', {keyPath: 'name'});
      // intentional fallthrough
    case 2:
      const peopleStore = upgradeDb.transaction.objectStore('people');
      peopleStore.createIndex('animal', 'favoriteAnimal');
      // intentional fallthrough
    case 3:
      peopleStore.createIndex('age', 'age');


      break;
    default:
      console.error(`Unhandled prior version: ${upgradeDb.oldVersion}! 
       Did you forget to add a case or bump vs correctly?  Current version: ${CUR_IDB_VERSION}`);
  }
});

// read "hello" in "keyval"
dbPromise.then(function(db) {
  var tx = db.transaction('keyval');
  var keyValStore = tx.objectStore('keyval');
  return keyValStore.get('hello');
}).then(function(val) {
  console.log('The value of "hello" is:', val);
});

// set "foo" to be "bar" in "keyval"
dbPromise.then(function(db) {
  var tx = db.transaction('keyval', 'readwrite');
  var keyValStore = tx.objectStore('keyval');
  keyValStore.put('bar', 'foo');
  return tx.complete;
}).then(function() {
  console.log('Added foo:bar to keyval');
});

dbPromise.then(function(db) {
  var tx = db.transaction('keyval', 'readwrite');
  var keyValStore = tx.objectStore('keyval');
  keyValStore.put('cat', 'favoriteAnimal');
  return tx.complete;
}).then(function() {
  console.log('Added favoriteAnimal:cat to keyval');
});

// add people to "people"
dbPromise.then(function(db) {
  var tx = db.transaction('people', 'readwrite');
  var peopleStore = tx.objectStore('people');

  peopleStore.put({
    name: 'Sam Munoz',
    age: 25,
    favoriteAnimal: 'dog'
  });

  peopleStore.put({
    name: 'Susan Keller',
    age: 34,
    favoriteAnimal: 'cat'
  });

  peopleStore.put({
    name: 'Lillie Wolfe',
    age: 28,
    favoriteAnimal: 'dog'
  });

  peopleStore.put({
    name: 'Marc Stone',
    age: 39,
    favoriteAnimal: 'cat'
  });

  return tx.complete;
}).then(function() {
  console.log('People added');
});

// list all cat people
dbPromise.then(function(db) {
  var tx = db.transaction('people');
  var peopleStore = tx.objectStore('people');
  var animalIndex = peopleStore.index('animal');

  return animalIndex.getAll('cat');
}).then(function(people) {
  console.log('Cat people:', people);
});

// console.log all people ordered by age
dbPromise.then(db => {
  const tx = db.transaction('people');
  const pplStore = tx.objectStore('people');
  const ageIdx = pplStore.index('age');

  return ageIdx.getAll();
}).then(ppl => console.log(`People by age`, ppl));
