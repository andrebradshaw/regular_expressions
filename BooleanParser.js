var kw = '("general sales manager" OR "general manager") AND (work NEAR4 customer OR assist NEAR6 customer) AND strategy AND lead AND "operational process" AND lead NEAR3 team AND (work OR customer OR leader)';

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

function getQuoted(str){
	var x = /(?<="\b).+?(?=\b")/g;
	return str.match(x);
}


function getOrGroups(str){
	var arr = [];
	var x = /\(.+?\)/gi;
	var ors = str.match(x);
	if(ors != null){
		ors.forEach(elm=>{arr.push(elm)});
	}
	return arr;
}



function parseORs(str){
	var arr = [];
	var ors = getOrGroups(str);
	ors.forEach(itm=>{
		var tarr = '';
		var qt = getQuoted(itm);
		var nr = getNearGroups(itm);
		
		var cleansed = itm.replace(/"\b.+?\b"/g, '').replace(/\bOR\b/g, '').replace(/\w+\s+NEAR\d+\s+\w+/g, '');
		var txt = cleansed.match(/\b\w+\b/g);
		if(txt != null){
			txt.forEach(elm=>{ tarr = tarr + elm + '|'})
			arr.push(tarr.replace(/\|$/, ''))
		}
		if(qt != null){
			qt.forEach(elm=>{ tarr = tarr + elm + '|'})
			arr.push(tarr.replace(/\|$/, ''))
		}
		if(nr != null){
			nr.forEach(elm=>{ tarr = tarr + elm + '|'})
			arr.push(tarr.replace(/\|$/, ''))
		}
		
	})
	return arr;
}

function getAndGroups(str){
	var arr = [];
	var onlyAND = str.replace(/\(.+?\)/g, '').replace(/\bAND\b/g, '');
	var noNear = onlyAND.replace(/\w+\s+NEAR\d+\s+\w+/g, '')
	var x = /(?<!")\b\w+\b(?!")/gi;
	var quoted = getQuoted(onlyAND);
	var near = getNearGroups(onlyAND);
	if(noNear.match(x) != null){
		noNear.match(x).forEach(elm=>{arr.push(elm)});
	}
	if(quoted != null){
		quoted.forEach(elm=>{arr.push(elm)})
    }
	if(near != null){
		near.forEach(elm=>{arr.push(elm)});
	}
	return arr;
}

function getBoolAsArray(str){
	var arr = [];
	parseORs(str).forEach(itm=>{arr.push(itm)});
	getAndGroups(str).forEach(itm=>{arr.push(itm)});
	return arr;
}

getBoolAsArray(kw)
