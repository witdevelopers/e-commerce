import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent implements OnInit {

  slides = [
    { src: 'assets/images/spin-game.jpeg', alt: 'Image 1' },
    { src: 'assets/images/spin-game.jpeg', alt: 'Image 2' },
    { src: 'assets/images/spin-game.jpeg', alt: 'Image 3' }
  ];
  currentSlide = 0;


  constructor() {}


  ngOnInit(): void {}


  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }


  prevSlide(): void {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
  }


}
