class SimpleChart {
    constructor(type = "canvas", mode = "line") {
        this.type = type;
        this.mode = mode;

        this.canvas = null;
        this.context = null;

        if (this.type === "canvas") {
            this.canvas = document.createElement("canvas");
            this.context = this.canvas.getContext("2d");
        }
        else if (this.type === "svg") {
            this.canvas = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        }
        else throw new Error("Invalid chart type\nChart type must be canvas or svg");

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
        this.#draw();
    }

    setMode = mode => {
        this.mode = mode;
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
        if (this.type === "canvas") {
            this.canvas.style.width = "100%";
            this.canvas.style.height = "100%";
            this.canvas.width = this.canvas.offsetWidth * 2;
            this.canvas.height = this.canvas.offsetHeight * 2;
        }
        else {
            this.canvas.setAttribute("width", "100%");
            this.canvas.setAttribute("height", "100%");
        }
        this.#draw();
    }

    #draw = () => {
        if (this.type === "canvas") {
            this.context.fillStyle = this.color;
            this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

            if (this.mode === "line")
                this.#drawData();
        }
        else {
            this.canvas.innerHTML = '';
            const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            rect.setAttribute("width", "100%");
            rect.setAttribute("height", "100%");
            rect.setAttribute("fill", this.color);
            this.canvas.append(rect);

            if (this.mode === "line")
                this.#drawDataLine();
            else if (this.mode === "path")
                this.#drawDataPath();
        }
    }

    #drawData = () => {
        const [yLow, yHigh] = this.getMinMax();
        const [width, height] = this.#getWidthHeight();

        for (const data of this.dataSet) {
            const xStep = width / (data.arr.length - 1);

            let x = 0 + this.strokeWidth / 2;
            let y = this.#getY(data.arr[0], height, yLow, yHigh);

            this.context.strokeStyle = data.color;
            this.context.beginPath();

            for (let i = 1; i < data.arr.length; i++) {
                this.context.moveTo(x, y);
                
                x += xStep;
                y = this.#getY(data.arr[i], height, yLow, yHigh);

                this.context.lineTo(x, y);
                this.context.lineWidth = this.strokeWidth;
                this.context.lineCap = "round";
                this.context.stroke();
            }
        }
    }

    #drawDataPath = () => {
        const [yLow, yHigh] = this.getMinMax();
        const [width, height] = this.#getWidthHeight();

        for (const data of this.dataSet) {
            let x = 0 + this.strokeWidth / 2;
            let y = this.#getY(data.arr[0], height, yLow, yHigh);

            const xStep = width / (data.arr.length - 1);

            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute("fill", "#fff0");
            path.setAttribute("stroke", data.color);
            path.setAttribute("stroke-width", this.strokeWidth);
            path.setAttribute("stroke-linecap", "round");

            let pathCoordinates = `M ${x},${y}`;

            for (let i = 1; i < data.arr.length; i++) {
                x += xStep;
                y = this.#getY(data.arr[i], height, yLow, yHigh);

                pathCoordinates = `${pathCoordinates} L ${x},${y}`;
            }

            path.setAttribute("d", pathCoordinates);

            this.canvas.append(path);
        }
    }

    #drawDataLine = () => {
        const [yLow, yHigh] = this.getMinMax();
        const [width, height] = this.#getWidthHeight();

        for (const data of this.dataSet) {
            let x = 0 + this.strokeWidth / 2;
            let y = this.#getY(data.arr[0], height, yLow, yHigh);

            const xStep = width / (data.arr.length - 1);

            for (let i = 1; i < data.arr.length; i++) {
                const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
                line.setAttribute("x1", x);
                line.setAttribute("y1", y);

                x += xStep;
                y = this.#getY(data.arr[i], height, yLow, yHigh);

                line.setAttribute("x2", x);
                line.setAttribute("y2", y);

                line.setAttribute("stroke", data.color);
                line.setAttribute("stroke-width", this.strokeWidth);
                line.setAttribute("stroke-linecap", "round");
                this.canvas.append(line);
            }
        }
    }

    #getWidthHeight = () => {
        return this.type === "canvas" ?
        [this.canvas.width - this.strokeWidth, this.canvas.height - this.strokeWidth]
        :
        [this.canvas.getBBox().width - this.strokeWidth, this.canvas.getBBox().height - this.strokeWidth];
    }

    #getY = (datum, height, low, high) => {
        const yPercentage = (datum - low) / (high - low) * 100;
        return (height + this.strokeWidth / 2) - height / 100 * yPercentage;
    }
}
