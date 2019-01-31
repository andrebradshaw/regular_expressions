var kw = '("general sales manager" OR "general manager") AND (work NEAR4 customer OR assist NEAR6 customer) AND strategy AND lead AND "operational process"';

function getQuoted(str){
	var x = /(?<="\b).+?(?=\b")/g;
	return str.match(x);
}
// getQuoted(kw)

function getOrGroups(str){
	var x = /\(.+?\)/gi;
	return str.match(x);
}

// getOrGroups(kw)

function getAndGroups(str){
	var cleanse = str.replace(/\(.+?\)/g, '').replace(/\bAND\b/g, '');
	var x = /(?<!")\b\w+\b(?!")/gi;
	return cleanse.match(x);
}
// getAndGroups(kw)

function getNearGroups(str){
	var x = /\w+\s+NEAR\d+\s+\w+/g;
	var mx = str.match(x);
	if(mx != null){
	return mx.map(itm=>{
		var near = Math.ceil(parseInt(/(?<=NEAR)\d+/.exec(itm)[0]) * 7);
		return itm.replace(/\s+NEAR\d+\s+/g, '.{0,'+near+'}?');
	})
	}
}
// getNearGroups(kw)
