  var wordarr = ["application","sql","database"]; //words to match
  var readString = 'Develop interface applications to convert flat files sent by clients to load to our system SQL server database to be worked by our service representatives. Develop interface applications to pull data from our SQL server database; convert into flat files and then return to our clients utilizing Microsoft.Net technology and OOP Design practices and principles.'; //this will be filled with the text we want to match
  //this is not likely the best way to do this, but it uses regular expressions, so why not go with it?
  var sudoRegX = wordarr.toString().replace(/,/g, ".{1,40}\\b"); //toString() removes the object stuff, but keeps the commas, becoming //application,sql,database

  var regXnear = new RegExp("\\b"+ sudoRegX, 'i'); 
  var match = regXnear.exec(readString);
  console.log(match);
