var fs = require('fs')

var libxmljs = require("libxmljs");

var inputFileName = 'db.myc';
if (process.argv.length >= 3){
  inputFileName = process.argv[2];
}

// reading the file

fs.readFile(inputFileName, 'utf8', function (err,rawData) {
  if (err) {
    return console.log(err);
  }
  var xmlDoc = libxmljs.parseXmlString(rawData);
  var root = xmlDoc.root();
  var children = root.childNodes();

  for (var i = 0 ; i < children.length; i++) {
    var child = children[i];
    if (child.name() != 'text'){

      var fileName = getAttributeValue(child, 'filename');
      var titleKey = getAttributeValue(child, 'titleKey');

      var title         = getChildDesc(child, 'titre');
      var movieLink     = getChildDesc(child, 'movieLink');
      var originalTitle = getChildDesc(child, 'titreOriginal');
      var releaseDate   = getChildDesc(child, 'dateDeSortie');
      var targetPublic  = getChildDesc(child, 'publicType');
      var filmLength    = getChildDesc(child, 'duree');
      var type          = getChildDesc(child, 'genre');
      var realisator    = getChildDesc(child, 'realisateur');
      var actors        = getChildDesc(child, 'acteurs');
      var mediaScore    = getChildDesc(child, 'notePresse');
      var specScore     = getChildDesc(child, 'noteSpec');
      var synopsis      = getChildDesc(child, 'synopsis');
      var affiche       = getChildDesc(child, 'affiche');


      var request = 'INSERT INTO table_name VALUES (';
      request += '"' + fileName + '", ';
      request += '"' + titleKey + '", ';
      request += '"' + title + '", ';
      request += '"' + movieLink + '", ';
      request += '"' + originalTitle + '", ';
      request += '"' + releaseDate + '", ';
      request += '"' + targetPublic + '", ';
      request += '"' + filmLength + '", ';
      request += '"' + type + '", ';
      request += '"' + realisator + '", ';
      request += '"' + actors + '", ';
      request += '"' + mediaScore + '", ';
      request += '"' + specScore + '", ';
      request += '"' + synopsis + '", ';
      request += '"' + affiche + '", ';
      request += '"' + "" + '"';
      request += ' );';


      console.log(request);
    }
  }
});



function getAttributeValue(element, attributeName, defaultValue){
  var attribute = element && element.attr(attributeName);
  var value = attribute && attribute.value();
  return value ? value : defaultValue;
}


function getChildDesc(element, childName, defaultValue){
  var childNodeArray = element && element.find(childName);
  var childNode = childNodeArray.length > 0 && childNodeArray[0];
  var description = childNode && childNode.attr('description');
  var value = description && description.value();
  return value ? value : defaultValue;
}
