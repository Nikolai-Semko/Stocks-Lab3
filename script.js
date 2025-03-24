class Animation {
  constructor(svg) {
    this.svg = svg;
    this.minY = 50.5;
    this.maxY = 880;
    this._minY = 1e9;
    this._maxY = -1e9;
    this.points = [];
    this.amplitude = [];
    this.period = [];
    this.shift = [];
    this.total_harm = 30;
    this.stepX = 2.0;
    this.n = 300;
    this.speed = 5;
    this.size = { w: 0, h: 0, cx: 0, cy: 0 };
    this.c = document.querySelector("#curve");
    this.c1 = document.querySelector("#curve1");
    this.cur = 0;
  }
  init() {
    this.amplitude[0] = 100;
    this.period[0] = 200;
    this.shift[0] = Math.random() * 10;
    for (let i = 1; i < this.total_harm; i++) {
      this.amplitude[i] = this.amplitude[i - 1] / 1.4;
      this.period[i] = this.period[i - 1] / 1.4;
      this.shift[i] = Math.random() * this.period[i] * 10;
    }
    this.calc();
    this.updateAnimation();
  }
  calc() {
    this._minY = 1e9;
    this._maxY = -1e9;
    for (let i = 0; i <= this.n; i++) {
      let sum = 0;
      let kk = 1.5;
      for (let j = 1; j < this.total_harm; j++) {
        sum += this.amplitude[j] * Math.sin((this.shift[j] + (i + this.cur) * kk) / this.period[j]);
      }
      if (this._maxY < sum) this._maxY = sum;
      if (this._minY > sum) this._minY = sum;
      this.points[i] = sum;
    }
  } 

  updateCurves() {
    let right = "1848";
    let left = "55.5";
    let l = 55.5;
    let down = "946";
    let k = (this.maxY - this.minY) / (this._maxY - this._minY);
    let step = 1792.5 / this.n;
    let curve = right + " " + (this.minY + this.points[this.n] * k).toFixed(1) + " " + right + " " + down + " " + left + " " + down + " ";
    for (let i = 0; i <= this.n; i++) curve += (l + i * step).toFixed(1) + " " + (this.minY + (this.points[i] - this._minY) * k).toFixed(1) + " ";
    this.c.attributes[1].nodeValue = curve;
    this.c1.attributes[1].nodeValue = curve;
  }

  updateAnimation() {
    //let time = performance.now();
    this.updateCurves();
    this.cur += this.speed;
    this.calc();
    window.requestAnimationFrame(() => this.updateAnimation());
    //time = Math.round((performance.now() - time) * 1000);
    //console.log("frame time = ", time, " μs");
  }
}

function ReSize(svg, box) {
  let w = window.innerWidth;
  let h = window.innerHeight;
  let k = box.width / box.height;
  if (k > w / h) svg.setAttribute("width", w.toString() + "px");
  else  svg.setAttribute("height", h.toString() + "px");
}

window.onload = () => {
  let svg = document.querySelector("svg");
  let svg2 = document.querySelector("#smallwin");
  let box = svg.viewBox.baseVal;
  let box2 = svg2.viewBox.baseVal;
  let click = false;
  let btn = document.querySelector("#button");
  let grad = document.querySelector("#linear-gradient-3");
  let delta = btn.children[0].cx.baseVal.value - grad.x1.baseVal.value;
  let line_slider = document.querySelector("#slider");
  let left = line_slider.x.baseVal.value;
  let right = left + line_slider.width.baseVal.value;
  let anime = new Animation(svg);
  anime.init();
  anime.speed = 0.1 + Math.round((btn.children[0].cx.baseVal.value - left) / 100);
  ReSize(svg, box);
  window.addEventListener("resize", () => {
    ReSize(svg, box);
  });
  btn.addEventListener("mousedown", () => {
    click = true;
  });
  window.addEventListener("mouseup", () => {
    click = false;
  });
  svg.addEventListener("mousemove", (event) => {
    if (click) {
      let k = box.width / svg.clientWidth;
      let cur = event.offsetX * k;
      if (cur > left && cur < right) {
        grad.x1.baseVal.value = cur - delta;
        grad.x2.baseVal.value = cur + delta;
        btn.children[0].cx.baseVal.value = cur;
        btn.children[1].cx.baseVal.value = cur;
        anime.speed = 0.1 + (btn.children[0].cx.baseVal.value - left) / 100;
      }
    }
  });
};
