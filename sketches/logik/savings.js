

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

class SaveLoadManager {
  static load() {

    loadedJSON = loadJSON("logik_savegame.json");
  }

  static createObjects() {
    var logics = loadedJSON['Logics'];
    for (var i = 0; i < logics.length; i++) {
      var data = logics[i];
      new LogicOr(data['x'], data['y']);
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
