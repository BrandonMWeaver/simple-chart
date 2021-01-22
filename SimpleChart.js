class SimpleChart {
    constructor(type = "canvas") {
        this.canvas = null;
        this.context = null;
        if (type === "canvas") {
            this.canvas = document.createElement("canvas");
            this.context = this.canvas.getContext("2d");
        }
        else if (type === "svg") {
            this.canvas = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        }
        else throw new Error("Invalid chart type\nChart type must be either canvas or svg");

        this.container = null;
        this.dataSet = [];
        this.color = "#fff0";
        this.strokeWidth = 1;
    }

    appendTo = container => {
        this.container = container;
        this.container.append(this.canvas);

        this.setColor(this.color);
        this.#setSize();

        window.addEventListener("resize", this.#setSize);
    }

    addData = data => {
        this.dataSet.push(data);
        this.#setSize();
    }

    setColor = color => {
        this.color = color;
    }

    setStrokeWidth = strokeWidth => {
        this.strokeWidth = strokeWidth;
    }

    #setSize = () => {
        if (this.context) {
            this.canvas.style.width = "100%";
            this.canvas.style.height = "100%";
            this.canvas.width = this.canvas.offsetWidth * 2;
            this.canvas.height = this.canvas.offsetHeight * 2;
        }
        else {
            this.canvas.setAttributeNS(null, "width", "100%");
            this.canvas.setAttributeNS(null, "height", "100%");
        }
        this.#draw();
    }

    #draw = () => {
        if (this.context) {
            this.context.fillStyle = this.color;
            this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
        else {
            this.canvas.innerHTML = '';
            const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            rect.setAttributeNS(null, "width", "100%");
            rect.setAttributeNS(null, "height", "100%");
            rect.setAttributeNS(null, "fill", this.color);
            this.canvas.append(rect);
        }
        
        this.#drawData();
    }

    #drawData = () => {
        let yLow = Number.MAX_VALUE;
        let yHigh = Number.MIN_VALUE;
        for (const data of this.dataSet) {
            for (const datum of data.arr) {
                if (datum < yLow) yLow = datum;
                if (datum > yHigh) yHigh = datum;
            }
        }

        for (const data of this.dataSet) {
            let line = null;
            let [width, height] = this.context ? [this.canvas.width, this.canvas.height] : [this.canvas.getBBox().width, this.canvas.getBBox().height];
            width -= this.strokeWidth;
            height -= this.strokeWidth;

            let x = 0 + this.strokeWidth / 2;
            const xStep = width / (data.arr.length - 1);

            let yPercentage = (data.arr[0] - yLow) / (yHigh - yLow) * 100;
            let y = (height + this.strokeWidth / 2) - height / 100 * yPercentage;

            if (this.context) {
                this.context.strokeStyle = data.color;
                this.context.beginPath();
            }

            for (let i = 0; i < data.arr.length; i++) {
                if (this.context)
                    this.context.moveTo(x, y);
                else {
                    line = document.createElementNS("http://www.w3.org/2000/svg", "line");
                    line.setAttribute("x1", x);
                    line.setAttribute("y1", y);
                }
                x += xStep;

                if (i + 1 < data.arr.length) {
                    yPercentage = (data.arr[i + 1] - yLow) / (yHigh - yLow) * 100;
                    y = (height + this.strokeWidth / 2) - height / 100 * yPercentage;
                    
                    if (this.context) {
                        this.context.lineTo(x, y);
                        this.context.lineWidth = this.strokeWidth;
                        this.context.lineCap = "round";
                        this.context.stroke();
                    }
                    else {
                        line.setAttribute("x2", x);
                        line.setAttribute("y2", y);
                        line.setAttribute("stroke", data.color);
                        line.setAttribute("stroke-width", this.strokeWidth);
                        line.setAttribute("stroke-linecap", "round");
                        this.canvas.append(line);
                    }
                }
            }
        }
    }
}
