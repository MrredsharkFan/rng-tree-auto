let modInfo = {
	name: "The RNG Tree",
	id: "rng_madness",
	author: "RNGeezus",
	pointsName: "points",
	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal(0), // Used for hard resets and new players
	
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.11",
	name: "HOW TO GET A GOOD SEED???????/",
}

let changelog = `<h1>v0.11</h1><br>changed something`

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything", "createLayers"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(player.bestPoints).add(10).log(10)
	gain = gain.times(globalEffect("NONE")).times(globalUpgEffect("NONE")).times(globalBuyableEffect("NONE"));
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
	seed: getSeed(),
}}

// Display extra things at the top of the page

var displayThings = [
	function() { return "Seed: "+player.seed + "<br>Best points: " + format(new Decimal(player.bestPoints)) + "<br>which gives a <b>" + format(new Decimal(player.bestPoints).add(10).log(10)) + "</b>x to points"; },
]

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte(new Decimal("e280000000"))
}



// Less important things beyond this point!

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}