class SimpleChart {
    constructor() {
        this.canvas = document.createElement("canvas");
        this.context = this.canvas.getContext("2d");

        this.container = null;
        this.dataSet = [];
        this.color = "#fff";
    }

    append = container => {
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

    #setSize = () => {
        this.canvas.style.width = "100%";
        this.canvas.style.height = "100%";
        this.canvas.width = this.canvas.offsetWidth * 2;
        this.canvas.height = this.canvas.offsetHeight * 2;
        this.#draw();
    }

    #draw = () => {
        this.context.fillStyle = this.color;
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
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
            let x = 0;
            const xStep = this.canvas.width / (data.arr.length - 1);

            let yPercentage = (data.arr[0] - yLow) / (yHigh - yLow) * 100;
            let y = this.canvas.height - this.canvas.height / 100 * yPercentage;

            this.context.strokeStyle = data.color;
            this.context.beginPath();

            for (let i = 0; i < data.arr.length; i++) {
                this.context.moveTo(x, y);
                x += xStep;

                if (i + 1 < data.arr.length) {
                    yPercentage = (data.arr[i + 1] - yLow) / (yHigh - yLow) * 100;
                    y = this.canvas.height - this.canvas.height / 100 * yPercentage;
                    
                    this.context.lineTo(x, y);
                    this.context.stroke();
                }
            }
        }
    }
}
