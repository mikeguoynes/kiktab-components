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

  constructor() {
  }

  componentDidLoad() {
    this.ctx = this.canvasEl.getContext('2d');
    const widthNum = parseInt(this.cwidth);
    const heightNum = parseInt(this.cheight);
    this.loadImage('https://images.pexels.com/photos/4622893/pexels-photo-4622893.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500', widthNum, heightNum).then((image) => {
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
    this.panX += deltaX;
    this.startPanX = event.clientX;
    console.log(this.panX);
    this.redraw(this.image);
  }

  redraw(image = this.image) {
    if (!this.ctx) { return; }
    this.ctx.clearRect(0, 0, this.canvasEl.width, this.canvasEl.height);
    this.ctx.drawImage(image, this.panX, this.panY, image.width, image.height, 0, 0, this.canvasEl.width, this.canvasEl.height);
  }

  handleMouseUp(event: MouseEvent) {
    this.mousedown = false;
    // this.startPanX = 0;
    // this.startPanY = 0;
    // this.panX = 0;
    // this.panY = 0;
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
