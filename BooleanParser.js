var kw = '(OOT OR FEP OR "over the top" OR "full episode player" OR "digital media" OR OOT NEAR5 advertising) AND ("Managed multiple complex projects" OR "Managed multiple projects" OR "Manage multiple projects" OR "Manage projects" OR "competing prioritization" OR "competing prioritizaties" OR "aggressive turnarounds" OR "aggressive goals" OR renewal OR upsell OR "up-sell" OR "identifying opportunities" OR "identify opportunities" OR "performance data" OR "client performance" OR "performance metrics" OR "account performance" OR "product performance" OR "ad performance" OR "advertising performance" OR "performance of advertising" OR "improve performance" OR insights OR recommend OR "campaign review" OR "campaign updates" OR "client budget" OR "campaign effectivenes" OR "campaign performance" OR "marketing campaigns" OR "campaign delivery" OR "Trafficked campaigns" OR "regarding performance" OR MediaTools OR MarketMate OR "improve media performance" OR "improve media efficiency") AND ("customer service" OR "assist customers" OR "strategic customer" OR "customer strategy" OR "Perform consultations" OR "consult with") AND ("evaluating proposals" OR "evaluate proposals" OR "negotiate" OR "preparing special estimates" OR "prepare special estimates" OR "prepare estimates" OR "advertiser orders" OR "ad orders" OR RFP OR "transmitting orders" OR "managing orders" OR "proposition development" OR "proposal development" OR "develop proposal" OR "market intelligence" OR "strategic analysis" OR "strategic development" OR "segmentation opportunities" OR "customer segmentation" OR "strategic media recommendations" OR "strategic recommendations") AND superduper';

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

matchArray(kw)
