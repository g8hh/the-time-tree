addLayer("t", {
    tabFormat: {
        "Main": {
            content:[
                "main-display",
                "blank",
                ["display-text", function() { return "You Are Gaining <h2><b>" + format(getResetGain("t")) + "</b></h2> Time Points Per Second" },],
                "blank",
                ["display-text", function() { return "Time Point Gain Formula : Log10(Time + 1)" + (tmp.t.getExp.eq(1) ? "":"<sup>" + format(tmp.t.getExp) + "</sup>") + ((tmp.t.getMult.eq(1) ? "":" * " + format(tmp.t.getMult))) },],
            ],
        },
        "Upgrades": {
            content: [
                "main-display",
                "blank",
                ["display-text", function() { return "Warning : Buying a Time Point upgrade will RESET TIME AND OTHER LAYERS" },],
                "blank",
                ["display-text", function() { return "You need " + player.t.upgradesUnlock[player.t.upgrades.length] + " in order to unlock the next upgrade"},],
                "blank",
                "upgrades",
            ],
        },
    },
    name: "Time Points", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "TP", // This appears on the layer's node. Default is the id with the first letter capitalized
    row: "side", // Row the layer is in on the tree (0 is the first row)
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    color: "#159d15",
    layerShown(){return true},
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
        best: new Decimal(0),
        upgradesUnlock: ["3 1st point buyable purchases", "20 1st point buyable purchases", "1st speed upgrade purchased", "30 1st point buyable purchases"],
    }},
    requires() { return new Decimal(1) }, // Can be a function that takes requirement increases into account
    resource: "Time Points", // Name of prestige currency
    type: "custom", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    getResetGain() {
        gain = player.points.add(1).log10()
        gain = gain.pow(tmp.t.getExp)
        gain = gain.times(tmp.t.getMult)
        return gain
    },
    getMult() {
        let mult = new Decimal(1)
        if(hasUpgrade("t", 12)) mult = mult.times(tmp.t.upgrades[12].effect)
        if(hasUpgrade("t", 13)) mult = mult.times(tmp.t.upgrades[13].effect)
        return mult
    },
    getExp() {
        let exp = new Decimal(1)
        return exp
    },
	effect() {
		eff = new Decimal(1)
		return eff
	},
	effectDescription() { return "" },
    passiveGeneration() { return true },
    doReset(resettingLayer){
        let keep = []
        if (layers[resettingLayer].row > this.row) layerDataReset(this.layer, keep)
    },
    upgrades: {
        11: {
            title: "The first reset",
            description: "Gain 3x points",
            cost() { return new Decimal(1000) },
            unlocked() { return getBuyableAmount("p", 11).gte(3) || hasUpgrade("t", 11) },
            onPurchase() { TimeUpgradePurchase() },
        },
        12: {
            title: "The second reset",
            description: "Time points boost their own gain",
            cost() { return new Decimal(2000) },
            unlocked() { return (getBuyableAmount("p", 11).gte(20) || hasUpgrade("t", 12)) && hasUpgrade("t", 11) },
            effect() { 
				eff = new Decimal(player.t.points.add(1).log10().add(1))
                return eff
            },
            effectDisplay() { return "*" + format(tmp.t.upgrades[12].effect) + " to time point gain" },
            onPurchase() { TimeUpgradePurchase() },
        },
        13: {
            title: "The third reset",
            description: "Points boost time point gain",
            cost() { return new Decimal(8000) },
            unlocked() { return (hasUpgrade("s", 11) || hasUpgrade("t", 13)) && hasUpgrade("t", 12) },
            effect() { 
				eff = new Decimal(player.p.points.add(1).log10().add(1).pow(0.25))
                return eff
            },
            effectDisplay() { return "*" + format(tmp.t.upgrades[13].effect) + " to time point gain" },
            onPurchase() { TimeUpgradePurchase() },
        },
        14: {
            title: "The fourth reset",
            description: "Time points boost point gain",
            cost() { return new Decimal(17500) },
            unlocked() { return (getBuyableAmount("p", 11).gte(30) || hasUpgrade("t", 14)) && hasUpgrade("t", 13) },
            effect() { 
				eff = new Decimal(player.t.points.add(1).log10().add(1).log10().add(1).pow(5))
                return eff
            },
            effectDisplay() { return "*" + format(tmp.t.upgrades[14].effect) + " to point gain" },
            onPurchase() { TimeUpgradePurchase() },
        },
    },
})
addLayer("p", {
    tabFormat: {
        "Main": {
            content:[
                "main-display",
                "blank",
                ["display-text", function() { return "You Are Gaining <h2><b>" + format(getResetGain("p")) + "</b></h2> Points Per Second" },],
                "blank",
                ["display-text", function() { return "Point Gain Formula : Log10(Time Points + 1)" + (tmp.p.getExp.eq(1) ? "":"<sup>" + format(tmp.p.getExp) + "</sup>") + ((tmp.p.getMult.eq(1) ? "":" * " + format(tmp.p.getMult))) },],
            ],
        },
        "Upgrades": {
            content: [
                "main-display",
                "blank",
                "upgrades",
            ],
        },
        "Buyables": {
            content: [
                "main-display",
                "blank",
                "buyables",
            ],
            unlocked() { return hasUpgrade("p", 13) },
        },
    },
    name: "Points", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
    row: 0, // Row the layer is in on the tree (0 is the first row)
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    color: "#e66666",
    layerShown(){return true},
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
        best: new Decimal(0),
    }},
    requires() { return new Decimal(1) }, // Can be a function that takes requirement increases into account
    resource: "Points", // Name of prestige currency
    type: "custom", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    getResetGain() {
        gain = player.t.points.add(1).log10()
        gain = gain.pow(tmp.p.getExp)
        gain = gain.times(tmp.p.getMult)
        return gain
    },
    getMult() {
        let mult = new Decimal(1)
        if(hasUpgrade("p", 11)) mult = mult.times(tmp.p.upgrades[11].effect)
        if(hasUpgrade("p", 12)) mult = mult.times(tmp.p.upgrades[12].effect)
        if(hasUpgrade("p", 21)) mult = mult.times(5)
        if(hasUpgrade("t", 11)) mult = mult.times(3)
        mult = mult.times(tmp.p.buyables[11].effect)
        mult = mult.times(tmp.s.effect)
        return mult
    },
    getExp() {
        let exp = new Decimal(1)
        if(hasUpgrade("p", 14)) exp = exp.times(tmp.p.upgrades[14].effect)
        if(hasUpgrade("p", 23)) exp = exp.add(tmp.p.upgrades[23].effect)
        return exp
    },
	effect() {
		eff = new Decimal(1)
		return eff
	},
	effectDescription() { return "" },
    passiveGeneration() { return true },
    doReset(resettingLayer){
        let keep = []
        if (layers[resettingLayer].row > this.row) layerDataReset(this.layer, keep)
    },
    upgrades: {
        11: {
            title: "P",
            description: "Points boost point gain",
            cost() { return new Decimal(50) },
            unlocked() { return player.p.unlocked || hasUpgrade("p", 11) },
            effect() { 
				eff = new Decimal(player.p.points.add(1).log10().add(1))
                return eff
            },
            effectDisplay() { return "*" + format(tmp.p.upgrades[11].effect) + " to point gain" },
        },
        12: {
            title: "O",
            description: "Time boosts point gain",
            cost() { return new Decimal(500) },
            unlocked() { return player.p.unlocked || hasUpgrade("p", 12) },
            effect() { 
				eff = new Decimal(player.points.add(1).log10().add(1).log10().add(1).pow(3))
                return eff
            },
            effectDisplay() { return "*" + format(tmp.p.upgrades[12].effect) + " to point gain" },
        },
        13: {
            title: "I",
            description: "Unlock a point buyable",
            cost() { return new Decimal(1000) },
            unlocked() { return player.p.unlocked || hasUpgrade("p", 13) },
        },
        14: {
            title: "N",
            description: "Point base gain is raised to a power based on time points",
            cost() { return new Decimal(50000) },
            unlocked() { return hasUpgrade("t", 11) || hasUpgrade("p", 14) },
            effect() { 
				eff = new Decimal(5).minus(new Decimal(4).div(player.t.points.add(1).pow(0.05)))
                return eff
            },
            effectDisplay() { return "^" + format(tmp.p.upgrades[14].effect) + " to base point gain" },
        },
        15: {
            title: "T",
            description: "Add 0.1 to the base effect of the first buyable",
            cost() { return new Decimal("5e6") },
            unlocked() { return hasUpgrade("t", 11) || hasUpgrade("p", 15) },
        },
        21: {
            title: "More points",
            description: "Multiply point gain by 5",
            cost() { return new Decimal("1e8") },
            unlocked() { return (hasUpgrade("t", 11) && player.p.points.gte("1e7")) || hasUpgrade("t", 12) || hasUpgrade("p", 21) },
        },
        22: {
            title: "New Layer",
            description: "Unlock the next layer",
            cost() { return new Decimal("1e10") },
            unlocked() { return (hasUpgrade("t", 12) && hasUpgrade("p", 21)) || hasUpgrade("t", 13) || hasUpgrade("p", 22) },
        },
        23: {
            title: "Speedy points",
            description: "Speed points boost the base gain exponent",
            cost() { return new Decimal("1e12") },
            unlocked() { return (hasUpgrade("t", 13) && hasUpgrade("s", 11)) || hasUpgrade("t", 14) || hasUpgrade("p", 23) },
            effect() { 
				eff = new Decimal(player.s.points.add(1).log10().add(1).log10().add(1).pow(0.75))
                return eff
            },
            effectDisplay() { return "+" + format(tmp.p.upgrades[23].effect) + " to base point gain exponent" },
        },
    },
    buyables: {
        11: {
            title: "Points+",
            display() {
                return "Boosts point gain by " + format(tmp.p.buyables[11].effect) + "x<br>Cost : " + format(this.cost(getBuyableAmount("p", 11))) + " points"
            },
            unlocked() { return hasUpgrade("p", 13) },
            cost(x) {
                return new Decimal(1000).times(new Decimal(2).add(x.times(0.01)).pow(x))
            },
            canAfford() { 
                return player.p.points.gte(this.cost(getBuyableAmount("p", 11)))
            },
            buy() { 
                player.p.points = player.p.points.minus(this.cost(getBuyableAmount("p", 11)))
                setBuyableAmount("p", 11, getBuyableAmount("p", 11).add(1))
            },
            effect() { 
                eff = new Decimal(1.5)
                if(hasUpgrade("p", 15)) eff = eff.add(0.1)
                eff = eff.pow(getBuyableAmount("p", 11))
                return eff
            }
        },
    },
})
addLayer("s", {
    tabFormat: {
        "Main": {
            content:[
                "main-display",
                "blank",
                ["display-text", function() { return "You Are Gaining <h2><b>" + format(getResetGain("s")) + "</b></h2> Speed Points Per Second" },],
                "blank",
                ["display-text", function() { return "Speed Point Gain Formula : Log10(Log10(Points + 1) * Time Points<sup>0.5</sup> + 1)" + (tmp.s.getExp.eq(1) ? "":"<sup>" + format(tmp.s.getExp) + "</sup>") + ((tmp.s.getMult.eq(1) ? "":" * " + format(tmp.s.getMult))) },],
            ],
        },
        "Upgrades": {
            content: [
                "main-display",
                "blank",
                "upgrades",
            ],
        },
    },
    name: "Speed Points", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "S", // This appears on the layer's node. Default is the id with the first letter capitalized
    row: 1, // Row the layer is in on the tree (0 is the first row)
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    color: "#e77e00",
    layerShown(){return hasUpgrade("p", 22)},
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
        best: new Decimal(0),
    }},
    requires() { return new Decimal(1) }, // Can be a function that takes requirement increases into account
    resource: "Speed Points", // Name of prestige currency
    type: "custom", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    getResetGain() {
        gain = player.p.points.add(1).log10().times(player.t.points.pow(0.5)).add(1).log10()
        gain = gain.pow(tmp.s.getExp)
        gain = gain.times(tmp.s.getMult)
        return gain
    },
    getMult() {
        let mult = new Decimal(1)
        if(hasUpgrade("s", 11)) mult = mult.times(tmp.s.upgrades[11].effect)
        if(hasUpgrade("s", 12)) mult = mult.times(tmp.s.upgrades[12].effect)
        return mult
    },
    getExp() {
        let exp = new Decimal(1)
        return exp
    },
	effect() {
		eff = new Decimal(1)
        eff = eff.times(player.s.points.add(1).log10().add(1))
		return eff
	},
	effectDescription() { return "Which are boosting point gain by " + format(tmp.s.effect) + "x" },
    passiveGeneration() { return hasUpgrade("p", 22) },
    doReset(resettingLayer){
        let keep = []
        if (layers[resettingLayer].row > this.row) layerDataReset(this.layer, keep)
    },
    upgrades: {
        11: {
            title: "I am speed",
            description: "Speed points are gained faster based on time",
            cost() { return new Decimal(250) },
            unlocked() { return (hasUpgrade("t", 12) && hasUpgrade("p", 22)) || hasUpgrade("t", 13) || hasUpgrade("s", 11) },
            effect() { 
				eff = new Decimal(player.points.add(1).log10().pow(1/3).add(1))
                return eff
            },
            effectDisplay() { return "*" + format(tmp.s.upgrades[11].effect) + " to speed point gain" },
        },
        12: {
            title: "Faster",
            description: "Time points boost speed point gain",
            cost() { return new Decimal(500) },
            unlocked() { return (hasUpgrade("t", 13) && hasUpgrade("s", 11)) || hasUpgrade("t", 14) || hasUpgrade("s", 12) },
            effect() { 
				eff = new Decimal(player.t.points.add(1).log10().add(1).log10().add(1).pow(2))
                return eff
            },
            effectDisplay() { return "*" + format(tmp.s.upgrades[12].effect) + " to speed point gain" },
        },
    },
})
