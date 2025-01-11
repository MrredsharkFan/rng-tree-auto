function getSeed() {
	if (window.player !== undefined) return player.seed;
	else if (localStorage.getItem("rng_madness") !== null ? JSON.parse(atob(localStorage.getItem("rng_madness"))) !== null : false) return JSON.parse(atob(localStorage.getItem("rng_madness"))).seed;
	else return Math.round(Math.random()*9223372036854775807);
}

function RNGReset() {
	let s = +prompt("Enter a seed (number from 1 to 9223372036854775807).");
	if (isNaN(s)) return;
	if (s<0 || s>=9223372036854775808 || s!=Math.round(s)) return;
	hardReset(false, s);
}

const RNG_DATA = {
	rows: 5,
	minLayers: 1,
	maxLayers: 5,
	layers(row) { 
		let l = Math.max(Math.min(Math.floor(random(getSeed()*row)*RNG_DATA.maxLayers+1), RNG_DATA.maxLayers), RNG_DATA.minLayers);
		return Math.min(l, row);		
	},
	chars: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
	types: ["normal", "static"],
	rowReqs: {
		1: new Decimal(10),
		2: new Decimal(16777216),
		3: new Decimal.pow(2,128),
		4: new Decimal.pow(2,512),
		5: new Decimal.pow(2,1024),
	},
	rowBaseExps: {
		1: new Decimal(0.5),
		2: new Decimal(0.25),
		3: new Decimal(0.125),
		4: new Decimal(0.0625),
		5: new Decimal(0.03125),
	},
	staticRowBaseExps: {
		1: new Decimal(1),
		2: new Decimal(1.2),
		3: new Decimal(1.5),
		4: new Decimal(2),
		5: new Decimal(2.5),
	},
	rowLayerTotalMultExps: {
		1: new Decimal(0.5),
		2: new Decimal(0.75),
		3: new Decimal(0.875),
		4: new Decimal(0.95),
		5: new Decimal(0.98),
	},
}

function random(seed) {
    var x = Math.sin(seed*10+1) * 10000;
    return x - Math.floor(x);
}

function globalEffect(target) {
	let eff = new Decimal(1);
	for (let l in layers) {
		if (!tmp[l].hasEffect) continue;
		if (tmp[l].effectTarget == target) {
			if (target!="NONE"?tmp[target].type=="static":false) eff = eff.div(tmp[l].effect);
			else eff = eff.times(tmp[l].effect);
		}
	}
	return eff;
}

function globalUpgEffect(target) {
	let eff = new Decimal(1);
	for (let l in layers) {
		if (!tmp[l].upgrades) continue;
		for (let r=1;r<=tmp[l].upgrades.rows;r++) {
			for (let c=1;c<=tmp[l].upgrades.cols;c++) {
				let id = r*10+c;
				if (!hasUpgrade(l, id)) continue;
				if (tmp[l].upgrades[id].et == target) {
					if (target!="NONE"?tmp[target].type=="static":false) eff = eff.div(tmp[l].upgrades[id].effect);
					else eff = eff.times(tmp[l].upgrades[id].effect);
				}
			}
		}
	}
	return eff;
}

function globalBuyableEffect(target) {
	let eff = new Decimal(1);
	for (let l in layers) {
		if (!tmp[l].buyables) continue;
		for (let r=1;r<=tmp[l].buyables.rows;r++) {
			for (let c=1;c<=tmp[l].buyables.cols;c++) {
				let id = r*10+c;
				if (tmp[l].buyables[id].et == target) {
					if (target!="NONE"?tmp[target].type=="static":false) eff = eff.div(tmp[l].buyables[id].effect);
					else eff = eff.times(tmp[l].buyables[id].effect);
				}
			}
		}
	}
	return eff;
}

function globalMilestoneCalc() {
	for (let l in layers){
		if (!tmp[l].milestones || tmp[l].row == 1) continue;
		let et = tmp[l].branches
		tmp[et].passiveGeneration = hasMilestone(l,0)
		tmp[et].autoUpgrade = hasMilestone(l,1)
	}
}

const RARITY_LIST = ["Worst","Worse","Bad","Belowground","Common","Uncommon","Rare","Epic","Legendary","Mythical","Divine","Super","Mega","Ultra","Omega","Extreme","Ultimate","Hyper","Godly","Unique","Exotic","Celestial","Paradoxial","Cosmic"]
function rarity(rarity){
	if (rarity > 2){return format(rarity,2)}
	else{
	let r1 = Math.min(Math.floor(-Math.log(1-rarity/2)*10),RARITY_LIST.length-1)
	if (rarity < 0){
		console.log("unexpected input of rarity of " + rarity)
		return undefined
	}
	return "<i>"+RARITY_LIST[r1]+"</i> ("+format(rarity,2)+")"}
}