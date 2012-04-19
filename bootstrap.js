var fs = require('fs')

var libxmljs = require("libxmljs");

var program = require('commander');

program
  .version('0.0.2')
  .option('-i, --input <files>', 'List of input files.')
  .parse(process.argv);



if (program.input) {
  // if input files option is set
  console.log(program.input);
  if (program.input instanceof Array) {
    for (var i = 0; i<program.input.length; i++){
      processFile(program.input[i]);
    }
  } else {
    processFile(program.input);
  }
} else {
  // getting current folder file list for user to choose from.
  var list = new Array();
  var folderContent = fs.readdirSync(".");
  var j = 0;
  for (var i = 0; i < folderContent.length; i++){
    var file = fs.lstatSync(folderContent[i]);
    if ( file.isFile()) {
      list[j] = folderContent[i];
      j++;
    }
  }

  // offering user to choose file
  program.choose(fs.readdirSync("."), function(i){
    processFile(list[i-1], true);
  });

}


function processFile(fileName, exitOnClose){
  // reading the file
  fs.readFile(fileName, 'utf8', function (err,rawData) {
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

        var title         = escapeString(getChildDesc(child, 'titre'));
        var movieLink     = escapeString(getChildDesc(child, 'movieLink'));
        var targetPublic  = escapeString(getChildDesc(child, 'publicType'));
        var filmLength    = escapeString(getChildDesc(child, 'duree'));
        var type          = escapeString(getChildDesc(child, 'genre'));
        var realisator    = escapeString(getChildDesc(child, 'realisateur'));
        var actors        = escapeString(getChildDesc(child, 'acteurs'));
        var mediaScore    = escapeString(getChildDesc(child, 'notePresse'));
        var specScore     = escapeString(getChildDesc(child, 'noteSpec'));
        var synopsis      = escapeString(getChildDesc(child, 'synopsis'));
        var affiche       = escapeString(getChildDesc(child, 'affiche'));
        var originalTitle = escapeString(getChildDesc(child, 'titreOriginal'));
        var releaseDate   = escapeString(getChildDesc(child, 'dateDeSortie'));


        originalTitle = originalTitle != "-" ? originalTitle : "";
        releaseDate   = convertDateFormat(releaseDate);


        var request = 'INSERT INTO film(`nom_fichier`, `titre`, `allocine`, `titre_original`, `date_sortie`, `public`, `durée`, `genre`, `realisateur`, `acteur`, `note_presse`, `note_spectateur`, `synopsis`, `image`) VALUES (';
        request += '"' + fileName + '", ';
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
        request += '"' + affiche + '"';
        request += ' );';

        console.log(request);
      }
    }

    if (exitOnClose) process.exit();
  });
}




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


function escapeString(inputString) {
  return inputString ? inputString.split("&quot;").join("").split('"').join('\\"') : "";
}


function convertDateFormat(inputDate){
  var result = "";
  var tab = inputDate.split(" ");
  if(tab.length == 3){
    var month = tab[1];
    if     (month == "janvier")   month = "01"
    else if(month == "février")   month = "02"
    else if(month == "mars")      month = "03"
    else if(month == "avril")     month = "04"
    else if(month == "mai")       month = "05"
    else if(month == "juin")      month = "06"
    else if(month == "juillet")   month = "07"
    else if(month == "août")      month = "08"
    else if(month == "septembre") month = "09"
    else if(month == "octobre")   month = "10"
    else if(month == "novembre")  month = "11"
    else if(month == "décembre")  month = "12"
    result = tab[2] + "-" + month + "-" + tab[0];
  }
  return result;
}
