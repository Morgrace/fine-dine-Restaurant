'use strict';
const header = document.querySelector('.header');
const navLinks = header.querySelectorAll('.header__navigation-link');
const hamburger = document.querySelector('.hamburger__background');
const hamburgerMain = document.querySelector('.hamburger');
const sectionAbout = document.querySelector('.about__box');
const headerBox = document.querySelector('.header__box');
const lazyImg = document.querySelectorAll('img[data-src]');
const events = document.querySelector('.events');
const sections = document.querySelectorAll('section');
class Webflow {
  #mediaQuery = window.matchMedia(
    '(min-resolution: 192dpi) and (min-width: 600px), (min-width: 75em)'
  );
  constructor() {
    // for header navigation
    header.addEventListener('click', this._scrollTo);
    //for hamburger navigation
    hamburger.addEventListener('click', this._scrollTo);

    headerBox.addEventListener('mouseover', this._hoverHandler.bind('0.2'));
    headerBox.addEventListener('mouseout', this._hoverHandler.bind('1'));
    //header image lazy load
    this._headerImg();
    //event image lazy load
    this._eventImg();
    //navigation observer
    this.obsHeaderBox = new IntersectionObserver(this._obsHeaderBoxFn, {
      root: null,
      threshold: 0,
      rootMargin: `-${getComputedStyle(headerBox).height}`,
    });
    //menu image observer
    this.menuImgObs = new IntersectionObserver(this._menuImg, {
      root: null,
      threshold: 0,
      rootMargin: `${250}px`,
    });
    this.obsHeaderBox.observe(header);
    lazyImg.forEach(img => {
      this.menuImgObs.observe(img);
      img.style.transition = 'filter .3s';
      img.classList.add('lazy-img');
    });
    this.sectionObs = new IntersectionObserver(this._sectionObsFn, {
      root: null,
      threshold: 0,
    });
    sections.forEach(sec => {
      sec.classList.add('section--hidden');
      sec.style.transition = 'transform 1s';
      this.sectionObs.observe(sec);
    });
  }
  _sectionObsFn(entries, observer) {
    entries.forEach(sec => {
      if (!sec.isIntersecting) return;
      sec.target.classList.remove('section--hidden');
      observer.unobserve(sec.target);
    });
  }
  _scrollTo(e) {
    e.preventDefault();
    if (
      e.target.classList.contains('header__navigation-link') &&
      e.target.getAttribute('href').length > 1
    ) {
      const gotoID = e.target.getAttribute('href');
      const section = document.getElementById(gotoID.slice(1));
      section.scrollIntoView({ behavior: 'smooth' });
    }
  }
  _obsHeaderBoxFn(entries, observer) {
    const [ent] = entries;
    if (getComputedStyle(hamburgerMain).display !== 'none') return;
    //make the nav sticky
    if (!ent.isIntersecting) headerBox.classList.add('sticky');
    else headerBox.classList.remove('sticky');
  }
  _hoverHandler(e) {
    if (e.target.classList.contains('header__navigation-link')) {
      navLinks.forEach(l => {
        l.style.opacity = this;
      });
      e.target.style.opacity = '1';
    }
  }
  _headerImg() {
    // image tag creation
    const heroImgLarge = new Image();
    const heroImgSmall = new Image();
    //image source
    heroImgSmall.src = '../img/hero-small.png';
    heroImgLarge.src = '../img/hero-large.png';
    const imageToLoad = this.#mediaQuery.matches ? heroImgLarge : heroImgSmall;
    // listening for load event
    imageToLoad.addEventListener('load', function () {
      header.style.backgroundImage = `linear-gradient(to bottom, transparent 75%, #101A1E), url(${imageToLoad.getAttribute(
        'src'
      )})`;
    });
  }
  _menuImg(entries, observer) {
    entries.forEach(ent => {
      if (!ent.isIntersecting) return;
      ent.target.src = ent.target.getAttribute('data-src');
      ent.target.addEventListener('load', () =>
        ent.target.classList.remove('lazy-img')
      );
      observer.unobserve(ent.target);
    });
  }
  _eventImg() {
    const eventImgLarge = new Image();
    eventImgLarge.src = '../img/img-3-large.webp';
    if (!this.#mediaQuery.matches) return;
    eventImgLarge.addEventListener(
      'load',
      () =>
        (events.style.backgroundImage = `linear-gradient(rgba(0,0,0, .5), rgba(0,0,0, .5)), url(${eventImgLarge.getAttribute(
          'src'
        )})`)
    );
  }
}
const fineDine = new Webflow();
