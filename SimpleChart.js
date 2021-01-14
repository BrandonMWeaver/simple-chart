class SimpleChart {
    constructor() {
        this.canvas = document.createElement("canvas");
        this.context = this.canvas.getContext("2d");

        this.container = null;
        this.data = null;
        this.color = "#fff";
    }

    append = container => {
        this.container = container;

        this.container.append(this.canvas);

        this.#setSize();

        window.addEventListener("resize", this.#setSize);
    }

    setData = data => {
        this.data = data;
        this.#drawData();
    }

    setColor = color => {
        this.color = color;
        this.#draw();
    }

    #setSize = () => {
        this.canvas.style.width = "100%";
        this.canvas.style.height = "100%";
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;

        this.setColor(this.color);
    }

    #draw = () => {
        this.context.fillStyle = this.color;
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

        if (this.data) this.#drawData();
    }

    #drawData = () => {
        let x = 0;
        const xStep = this.canvas.width / (this.data.length - 1);

        let yLow = Number.MAX_VALUE;
        let yHigh = Number.MIN_VALUE;
        for (const datum of this.data) {
            if (datum < yLow) yLow = datum;
            if (datum > yHigh) yHigh = datum;
        }

        for (let i = 0; i < this.data.length; i++) {
            let yPercentage = (this.data[i] - yLow) / (yHigh - yLow) * 100;
            let y = this.canvas.height - this.canvas.height / 100 * yPercentage;

            this.context.moveTo(x, y);
            x += xStep;

            if (i + 1 < this.data.length) {
                let yPercentage = (this.data[i + 1] - yLow) / (yHigh - yLow) * 100;
                let y = this.canvas.height - this.canvas.height / 100 * yPercentage;

                this.context.lineTo(x, y);
                this.context.stroke();
            }
        }
    }
}
