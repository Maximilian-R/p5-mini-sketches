

/*
  Classes should have static function to save/load themself,
  save = put all its data into a json object.
  load = instansiate a object with data from an json object.
*/

class Serializable {
  toJson() {}
  fromJson(json) {}
}

var saveObjects = [];

var loadedJSON;

let classes;

class SaveLoadManager {

  static load() {

    loadedJSON = loadJSON("logik_savegame.json");
  }

  static createObjects() {
    var logics = loadedJSON['Logics'];

    for (var i = 0; i < logics.length; i++) {
      var data = logics[i];
      print(data);
      var obj = new classes[data['class']](data['x'], data['y']);
      
      /* Set saved attributes values */ 
      var keys = Object.keys(data);
      for (var j = 0; j < keys.length; j++) {
        /* obj[keyname from data[0...length]] = data[0...length] */
        obj[keys[j]] = data[j];
      }
      
      Node.addToWorld(obj);
    }
  }

  static save() {
    var json = {};
    json['Logics'] = [];

    for (var i = 0; i < saveObjects.length; i++) {
      json['Logics'][i] = saveObjects[i].toJson();
    }

    print(json);

    saveJSON(json, 'logik_savegame.json')
  }

}
