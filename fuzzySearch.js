var kw = '("Managed multiple complex projects" OR "Managed multiple projects" OR "Manage multiple projects" OR "Manage projects" OR "competing prioritization" OR "competing prioritizaties" OR "aggressive turnarounds" OR "aggressive goals" OR renewal OR upsell OR "up-sell" OR "identifying opportunities" OR "identify opportunities" OR "performance data" OR "client performance" OR "performance metrics" OR "account performance" OR "product performance" OR "ad performance" OR "advertising performance" OR "performance of advertising" OR "improve performance" OR insights OR recommend OR "campaign review" OR "campaign updates" OR "client budget" OR "campaign effectivenes" OR "campaign performance" OR "marketing campaigns" OR "campaign delivery" OR "Trafficked campaigns" OR "regarding performance" OR MediaTools OR MarketMate OR "improve media performance" OR "improve media efficiency" OR "customer service" OR "assist customers" OR "strategic customer" OR "customer strategy" OR "Perform consultations" OR "consult with" OR "evaluating proposals" OR "evaluate proposals" OR "negotiate" OR "preparing special estimates" OR "prepare special estimates" OR "prepare estimates" OR "advertiser orders" OR "ad orders" OR RFP OR "transmitting orders" OR "managing orders" OR "proposition development" OR "proposal development" OR "develop proposal" OR "market intelligence" OR "strategic analysis" OR "strategic development" OR "segmentation opportunities" OR "customer segmentation" OR "strategic media recommendations" OR "strategic recommendations")';

var fuzzX = /\s+a\s+|\s+able\s+|\s+act\s+|\s+add\s+|\s+age\s+|\s+ago\s+|\s+air\s+|\s+all\s+|\s+also\s+|\s+and\s+|\s+any\s+|\s+as\s+|\s+at\s+|\s+be\s+|\s+both\s+|\s+but\s+|\s+by\s+|\s+can\s+|\s+come\s+|\s+do\s+|\s+each\s+|\s+else\s+|\s+ever\w\s+|\s+for\s+|\s+free\s+|\s+from\s+|\s+full\s+|\s+get\s+|\s+give\s+|\s+go\s+|\s+good\s+|\s+have\s+|\s+he\s+|\s+here\s+|\s+how\s+|\s+I\s+|\s+if\s+|\s+in\s+|\s+into\s+|\s+it\s+|\s+its\s+|\s+just\s+|\s+know\s+|\s+last\s+|\s+less\s+|\s+let\s+|\s+lie\s+|\s+like\s+|\s+lot\s+|\s+make\s+|\s+many\s+|\s+may\s+|\s+me\s+|\s+more\s+|\s+most\s+|\s+much\s+|\s+must\s+|\s+my\s+|\s+near\s+|\s+next\s+|\s+none\s+|\s+nor\s+|\s+not\s+|\s+now\s+|\s+of\s+|\s+off\s+|\s+oh\s+|\s+ok\s+|\s+on\s+|\s+one\s+|\s+only\s+|\s+onto\s+|\s+or\s+|\s+our\s+|\s+out\s+|\s+over\s+|\s+own\s+|\s+per\s+|\s+pull\s+|\s+push\s+|\s+put\s+|\s+say\s+|\s+see\s+|\s+seek\s+|\s+seem\s+|\s+she\s+|\s+so\s+|\s+some\s+|\s+soon\s+|\s+such\s+|\s+sure\s+|\s+than\s+|\s+that\s+|\s+the\s+|\s+them\s+|\s+then\s+|\s+they\s+|\s+this\s+|\s+thus\s+|\s+to\s+|\s+too\s+|\s+upon\s+|\s+us\s+|\s+use\s+|\s+very\s+|\s+way\s+|\s+we\s+|\s+well\s+|\s+what\s+|\s+when\s+|\s+who\s+|\s+whom\s+|\s+why\s+|\s+will\s+|\s+with\s+|\s+yes\s+|\s+yet\s+|\s+you\s+|\s+your\s+/gi;

var notArray = (str) => str.match(/(?<=\bNOT\s+|\s+-\s{0,2})(\w+|".+?")/g);
var getQuoted = (str) => str.match(/(?<="\b).+?(?=\b")/g);

function getNearGroups(str) {
  var x = /\w+\s+NEAR\d+\s+\w+/g;
  var mx = str.match(x);
  if (mx != null) {
    return mx.map(itm => {
      var near = Math.ceil(parseInt(/(?<=NEAR)\d+/.exec(itm)[0]) * 7);
      return itm.replace(/\s+NEAR\d+\s+/g, '.{0,' + near + '}?');
    })
  }
}

function getOrGroups(str) {
  var arr = [];
  var x = /\(.+?\)/gi;
  var ors = str.match(x);
  if (ors != null) ors.forEach(elm => arr.push(elm) );
  return arr;
}

function parseORs(str) {
  var arr = [];
  var ors = getOrGroups(str);
  ors.forEach(itm => {
	var i = itm.replace(/OR /g,'')
    var tarr = '';
    var nears = getNearGroups(i);
	var theRest = i.replace(/\w+\s+NEAR\d+\s+\w+/g, '').match(/(?<=")\b.+?\b(?=")|\w+/g);
	nears ? nears.forEach(elm=> tarr = tarr + elm + '|') : ''; 
	theRest ? theRest.forEach(elm=> tarr = tarr + elm + '|') : ''; 
	arr.push(tarr.replace(/\|$/,''));
  })
  return arr;
}

function getAndGroups(str) {
  var arr = [];
  var str = str.replace(/\bNOT\s+(\w+|".+?")|\s+-\s{0,2}(\w+|".+?")/g, '');
  var onlyAND = str.replace(/\(.+?\)/g, '').replace(/\bAND\b/g, '');
  var noNear = onlyAND.replace(/\w+\s+NEAR\d+\s+\w+/g, '').replace(/"\b.+?\b"/g, '');
  var x = /\b\w+\b/g;
  var quoted = getQuoted(onlyAND);
  var near = getNearGroups(onlyAND);
  if (noNear.match(x) != null) noNear.match(x).forEach(elm => arr.push(elm) );
  if (quoted != null) quoted.forEach(elm => arr.push(elm) );
  if (near != null) near.forEach(elm => arr.push(elm) );
  return arr;
}

function matchArray(str) {
  var arr = [];
  parseORs(str).forEach(itm => arr.push(itm) );
  getAndGroups(str).forEach(itm => arr.push(itm) );
  return arr;
}


function fuzzySearchX(input){
  var start = '(?<=\\s+).{28}';
  var end = '.{10,28}(?=\\s+)';
  var str = matchArray(kw).toString();
  var output = str.replace(fuzzX, '.{0,5}').replace(/\|/g, end+'|'+start);
  return new RegExp(start+output+end, 'i');
}
fuzzySearchX()
// notArray(kw)
