function mouseWheel(event) {
    mainHandler.inventory.deltaScroll(event.delta);
}

class Menu {
    constructor() {
        this.size = createVector(60, window.innerHeight);
        this.pos = createVector(window.innerWidth - this.size.x, 0);

        this.scroll = 0;

        this.items = [
            "LogicAnd",
            "LogicOr",
            "LogicNot", 
            "LogicXor",
            "LogicTimer",
            "LogicCounter",
            "LogicSelector",
            "LogicBattery",
            "LogicSwitch",
            "LogicSplitter",
            "LogicCombiner",
            "LogicKeyInput",
            "Light"
        ];

        this.itemSize = createVector(this.size.x, 60);
        this.itemSpacing = 4;

        this.maxScroll = this.items.length * (this.itemSize.y + this.itemSpacing) - this.size.y - this.itemSpacing;
    }

    deltaScroll(delta) {
        this.scroll += delta;
        if (this.scroll < 0) {
            this.scroll = 0;
        } else if (this.scroll > this.maxScroll) {
            this.scroll = this.maxScroll;
        }
    }

    draw() {

        push();

        fill(20);
        noStroke();

        translate(this.pos.x, this.pos.y);
        rect(0, 0, this.size.x , this.size.y);

        translate(0, -this.scroll);
        fill(100);

        let viewStart = this.scroll - this.itemSize.y;
        let viewEnd = this.scroll + this.size.y;

        for (var i = 0; i < this.items.length; i++) {
            let y = i * (this.itemSize.y + this.itemSpacing);
            if (y >= viewStart && y <= viewEnd) {
                rect(0, y, this.itemSize.x, this.itemSize.y);
            } 
            
        }

        pop();
    }
}

