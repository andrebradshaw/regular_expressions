function getName(type, fullname){
  function cleanName(fullname){
    var regXcommaplus = new RegExp(",.+");
    var regXjunk  = new RegExp('\\(|\\)|"|\\s*\\b[jJ][rR]\\b.*|\\s*\\b[sS][rR]\\b.*|\\s*\\bIi\\b.*|\\s*\\bI[Ii][Ii]\\b.*|\\s*\\bI[Vv]\\b.*|\\s+$', 'g');
    var regXendDot = new RegExp("\\.$");
    return fullname.replace(regXcommaplus, "").replace(regXjunk, "").replace(regXendDot, "");
  }
  function fixCase(fullname){ 
    return fullname.replace(/\w\S*/g, function(txt){
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }
  function getFirstName(fullname){
  	return /^\w+\.\s+\w+(?=\s)|^\S+(?=\s)/.exec(cleanName(fullname)).toString();
  }
  function getLastName(fullname){
  	return /\w*'\w*$|\w*-\w*$|\w+$/.exec(cleanName(fullname)).toString();
  }
  if(type == "first"){
    return getFirstName(cleanName(fixCase(fullname)));
  }
  if(type == "last"){
    return getLastName(cleanName(fixCase(fullname)));
  }
}

//Usage: 
getName('first', 'Poopie "Chris" Butthole III') //Poopie
getName('last', 'Poopie "Chris" Butthole III') //Butthole
