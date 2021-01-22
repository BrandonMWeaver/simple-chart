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

        this.canvas.style.boxSizing = "border-box";
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

    setBorder = border => {
        this.canvas.style.border = border;
    }

    setStrokeWidth = strokeWidth => {
        this.strokeWidth = strokeWidth;
    }

    getMinMax = () => {
        let min = Number.MAX_VALUE;
        let max = Number.MIN_VALUE;
        for (const data of this.dataSet) {
            for (const datum of data.arr) {
                if (datum < min) min = datum;
                if (datum > max) max = datum;
            }
        }
        return [min, max];
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
        let [yLow, yHigh] = this.getMinMax();

        for (const data of this.dataSet) {
            let line = null;

            let [width, height] = this.context ? [this.canvas.width, this.canvas.height] : [this.canvas.getBBox().width, this.canvas.getBBox().height];
            width -= this.strokeWidth;
            height -= this.strokeWidth;

            const xStep = width / (data.arr.length - 1);

            let x = 0 + this.strokeWidth / 2;
            let y = this.#getY(data.arr[0], height, yLow, yHigh);

            if (this.context) {
                this.context.strokeStyle = data.color;
                this.context.beginPath();
            }

            for (let i = 1; i < data.arr.length; i++) {
                if (this.context)
                    this.context.moveTo(x, y);
                else {
                    line = document.createElementNS("http://www.w3.org/2000/svg", "line");
                    line.setAttribute("x1", x);
                    line.setAttribute("y1", y);
                }
                x += xStep;

                y = this.#getY(data.arr[i], height, yLow, yHigh);
                
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

    #getY = (datum, height, low, high) => {
        const yPercentage = (datum - low) / (high - low) * 100;
        return (height + this.strokeWidth / 2) - height / 100 * yPercentage;
    }
}
