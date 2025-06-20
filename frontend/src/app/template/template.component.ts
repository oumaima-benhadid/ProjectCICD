import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

declare var AOS: any;
declare var GLightbox: any;
declare var Swiper: any;

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.css']
})
export class TemplateComponent implements AfterViewInit {
  constructor(public router: Router) {}

  isHomePage(): boolean {
    const path = this.router.url.split('?')[0].split('#')[0];
    return path === '/';
  }
  
 ngAfterViewInit(): void {
  // AOS animations
  AOS.init();

  // Lightbox
  GLightbox({ selector: '.glightbox' });

  // Swiper slider full background fade
  new Swiper('.init-swiper', {
    loop: true,
    speed: 1000,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true
    },
    effect: 'fade',
    fadeEffect: { crossFade: true }
  });
}

  

  /*ngAfterViewInit(): void {
    // AOS animations
    AOS.init();

    // Lightbox
    GLightbox({ selector: '.glightbox' });

    // Swiper
    new Swiper('.init-swiper', {
      loop: true,
      speed: 600,
      autoplay: { delay: 5000 },
      slidesPerView: 'auto',
      pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
        clickable: true
      },
      breakpoints: {
        320: { slidesPerView: 2, spaceBetween: 40 },
        480: { slidesPerView: 3, spaceBetween: 60 },
        640: { slidesPerView: 4, spaceBetween: 80 },
        992: { slidesPerView: 5, spaceBetween: 120 },
        1200: { slidesPerView: 6, spaceBetween: 120 }
      }
    });
  }*/
}
