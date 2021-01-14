class SimpleChart {
    constructor(x1, x2, y1, y2) {
        this.x1 = x1;
        this.x2 = x2;
        this.y1 = y1;
        this.y2 = y2;

        this.canvas = document.createElement("canvas");
        this.context = this.canvas.getContext("2d");

        this.container = null;
        this.color = null;
    }

    append = container => {
        this.container = container;

        this.container.append(this.canvas);

        this.#setSize();

        window.addEventListener("resize", this.#setSize);
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
    }
}
