import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'kiktab-gallery',
  styleUrl: 'kiktab-gallery.css',
  shadow: true,
})
export class KiktabGallery {
  @Prop() cheight: string;
  @Prop() cwidth: string;
  canvasEl: any;
  ctx: any;
  image: any;
  mousedown: boolean;
  panX = 0;
  panY = 0;
  startPanY = 0;
  startPanX = 0;
  isDragging: boolean;
  zoom = 1;

  constructor() {
  }

  componentDidLoad() {
    this.ctx = this.canvasEl.getContext('2d');
    const widthNum = parseInt(this.cwidth);
    const heightNum = parseInt(this.cheight);
    this.loadImage(`https://loremflickr.com/cache/resized/65535_49953967751_3cd51369d4_320_240_nofilter.jpg`, widthNum, heightNum).then((image) => {
      this.ctx.drawImage(image, 0, 0);
      this.image = image;
      this.setupListeners();
    });
  }

  async loadImage(src: string, width: number, height: number) {
    const image = new Image();
    image.src = src;
    image.width = width;
    image.height = height;

    return new Promise((resolve, reject) => {
      image.onload = () => {
        resolve(image);
      }
    })
  }

  setupListeners() {
    this.canvasEl.addEventListener('mousedown', (e: MouseEvent) => this.handleMouseDown(e));
    this.canvasEl.addEventListener('mouseup', (e: MouseEvent) => this.handleMouseUp(e));
    this.canvasEl.addEventListener('mousemove', (e: MouseEvent) => this.handleMouseMove(e));
    this.canvasEl.addEventListener('mousewheel', (e: MouseEvent) => this.handleMouseWheel(e));
  }

  handleMouseDown(event: MouseEvent) {
    this.mousedown = true;
    this.startPanX = event.clientX;
    this.startPanY = event.clientY;
  }

  handleMouseMove(event: MouseEvent) {
    if (!this.mousedown) {
      return;
    }

    const deltaX = (this.startPanX - event.clientX) / 2;
    const deltaY = (this.startPanY - event.clientY) / 2;
    this.panX += deltaX;
    this.panY += deltaY;
    this.startPanX = event.clientX;
    this.startPanY = event.clientY;
    this.redraw(this.image, this.zoom);
  }

  handleMouseWheel(event: any) {
    event.preventDefault();
    this.mousedown = false;
    const zoomChange = -event.deltaY;
    this.zoom += (zoomChange / 4);

    if (this.zoom < 0.75) { this.zoom = 0.75; }
    if (this.zoom > 3) { this.zoom = 3; }
    this.redraw(this.image, this.zoom);
  }

  redraw(image = this.image, zoom: number = 1) {
    if (!this.ctx) { return; }
    this.ctx.clearRect(0, 0, this.canvasEl.width, this.canvasEl.height); // Clear canvas
    const perceivedWidth = this.image.width * zoom;
    const perceivedHeight = this.image.height * zoom;

    let dx = 0;
    let dy = 0;
    if (this.zoom > 1) {
      dx = -perceivedWidth / 4;
      dy = -perceivedHeight / 4;
    } else {
      dx = 0;
      dy = 0;
    }

    console.log(this.panX);
    console.log(this.panY);
    this.boundPan();
    this.ctx.drawImage(image, this.panX, this.panY, image.width, image.height, dx, dy, perceivedWidth, perceivedHeight);
  }

  boundPan() {
    const padding = 50 * this.zoom;
    if ((this.panX - padding) < -this.image.width) {
     this.panX = -this.image.width + padding;
    }

    if ((this.panX + padding) > this.image.width) {
      this.panX = this.image.width - padding;
    }

    if ((this.panY - padding) < -this.image.height) {
      this.panY = -this.image.height + padding;
     }
 
     if ((this.panY + padding) > this.image.height) {
       this.panY = this.image.height - padding;
     }
  }

  handleMouseUp(event: MouseEvent) {
    this.mousedown = false;
    this.isDragging = false;
  }

  getImage(src: string) {
    const image = new Image();
    image.src = src;
    return image;
  }

  getCanvas() {
    return document.getElementById('canvas');
  }

  render() {
    return (
      <div>
        <canvas 
        id="canvas" 
        width={this.cwidth} 
        height={this.cheight}
        ref={el => this.canvasEl = el} 
        ></canvas>
      </div>
    );
  }
}
