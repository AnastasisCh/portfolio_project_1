'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

const cookieMessage = document.createElement('div');
cookieMessage.classList.add('cookie-message');

cookieMessage.innerHTML =
  ' This website is using cookies.<button class="btn btn--close-cookie">Okay</button>';

document.querySelector('header').append(cookieMessage);

//OR

// document
//   .querySelector('header')
//   .insertAdjacentHTML(
//     'beforeend',
//     `<div class='cookie-message'> This website is using cookies <button class='btn btn--close-cookie'>Okay</button> </div>`
//   );
document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', () => cookieMessage.remove());

cookieMessage.style.backgroundColor = 'red';
cookieMessage.style.width = '120%';
// console.log(Object.values(getComputedStyle(cookieMessage)));
cookieMessage.style.setProperty('background-color', '#646262');
cookieMessage.style.height =
  Number.parseInt(getComputedStyle(cookieMessage).height) + 20 + 'px';

// document.getElementById('')

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

btnScrollTo.addEventListener('click', function (e) {
  const s1Cords = section1.getBoundingClientRect();

  //1st Way

  // window.scrollTo(
  //   s1Cords.x + window.pageXOffset,
  //   s1Cords.y + window.pageYOffset
  // );

  //smooth behavior

  // window.scrollTo({
  //   left: s1Cords.x + window.pageXOffset,
  //   top: s1Cords.y + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  //modern fast way

  section1.scrollIntoView({ behavior: 'smooth' });
});

//remove event listener
const h1 = document.querySelector('h1');
h1.addEventListener('mouseenter', function handler(e) {
  //alert('You read H1');
  h1.removeEventListener('mouseenter', handler);
  setTimeout(() => {}, 1000);
});

//scrolin smoothly from nav links to sections

//1st way,only one event listener

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  e.target.classList.contains('nav__link')
    ? document
        .querySelector(e.target.getAttribute('href')) //=>'(#section--1).'
        .scrollIntoView({ behavior: 'smooth' })
    : '';
});

//2nd way , multiple event listeners,not efficient

// document.querySelectorAll('.nav__link').forEach(el => {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     console.log(e.target);
//     e.target.classList.contains('nav__link')
//       ? document
//           .querySelector(e.target.getAttribute('href'))
//           .scrollIntoView({ behavior: 'smooth' })
//       : '';
//   });
// });

const tabContainer = document.querySelector('.operations__tab-container');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContent = document.querySelectorAll('.operations__content');

//tab effect on click and content

tabContainer.addEventListener('click', function (e) {
  e.preventDefault();
  //selecting from the ancestors of e.target the ancestor 'operations__tab'
  const clickedOn = e.target.closest('.operations__tab');

  //or
  // [...tabContainer.children].forEach(t =>
  //   t.classList.remove('operations__tab--active')
  // );

  //add tab effect
  if (!clickedOn) return;

  //remove tab effeccts
  tabs.forEach(t => t.classList.remove('operations__tab--active'));

  //add tab effect

  clickedOn.classList.add('operations__tab--active');

  //remove tab contents
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  //add tab content
  document
    .querySelector(`.operations__content--${clickedOn.dataset.tab}`)
    .classList.add('operations__content--active');
});

const nav = document.querySelector('.nav');
const navLinks = document.querySelectorAll('.nav__links');

const handleHover = function (e) {
  e.preventDefault();
  if (e.target.classList.contains('nav__link')) {
    const linkClicked = e.target;

    const linksNotClicked = nav.querySelectorAll('.nav__link');
    linksNotClicked.forEach(l =>
      l !== linkClicked ? (l.style.opacity = this) : null
    );
  }
};

nav.addEventListener('mouseover', handleHover.bind(0.5));
//it calls handleHover(e) , e is passed automatically by the browser
//bind method sets the this keyword as 0.5 and returns a NEW function not function CALL
nav.addEventListener('mouseout', handleHover.bind(1));

const section1Y = section1.getBoundingClientRect();
//object that includes X,Y,height,top,width etc and coordinates for an element

// not efficient window object runs all the time

// window.addEventListener('scroll', function (e) {
//   console.log(window.scrollY);
//   console.log('fff', section1Y.top);
//   if (this.window.scrollY > section1Y.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });

const obsCbFunc = entries => {
  entries.forEach(entry => {
    !entry.isIntersecting
      ? nav.classList.add('sticky')
      : nav.classList.remove('sticky');
  });
};

const obs = {
  root: null,
  threshold: 0,
  rootMargin: `-${getComputedStyle(nav).height}`,
};

const observer = new IntersectionObserver(obsCbFunc, obs);
observer.observe(document.querySelector('.header'));

//--------------------------------------------------------//

const sectionCb = function (entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.remove('section--hidden');
    else return;
    observer.unobserve(entry.target); //terminates excesive runs of the observer , efficient
  });
};

const allSections = document.querySelectorAll('.section');

const sectionObserver = new IntersectionObserver(sectionCb, {
  root: null,
  threshold: 0.2,
});

allSections.forEach(section => {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

//Lazy img IMPLEMENTATION

const lazyImages = document.querySelectorAll('img[data-src]');

const lazyImageCb = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};

const lazyImageObserver = new IntersectionObserver(lazyImageCb, {
  root: null,
  threshold: 0,
});

lazyImages.forEach(img => lazyImageObserver.observe(img));

const slide = function () {
  let currSlide = 0;
  const slides = document.querySelectorAll('.slide');
  const sliderRightBtn = document.querySelector('.slider__btn--right');
  const sliderLeftBtn = document.querySelector('.slider__btn--left');
  // slides[0].style.transform = 'translateX(80%)';
  // slides[1].style.transform = 'translateX(80%)';

  const slideLimit = slides.length;

  const goToSlide = function (currSlide) {
    slides.forEach((slide, index) => {
      slide.style.transform = `translateX(${(index - currSlide) * 100}%)`;
    });
  };

  goToSlide(currSlide);
  //initialization of slides

  const leftSlide = function (e) {
    e.preventDefault();
    if (currSlide === 0) currSlide = 2;
    else currSlide--;
    goToSlide(currSlide);
    activateCurrDot(currSlide);
  };

  //'1'=> 0,100,200 '2'=>-200,-100,0 '3'=> -100,0,-200 '4'=>0,100,200);

  const rightSlide = function (e) {
    e.preventDefault();
    if (currSlide === slideLimit - 1) {
      currSlide = 0;
    } else {
      currSlide++;
    }

    goToSlide(currSlide);
    activateCurrDot(currSlide);
  };

  //'1'=>0,100,200 '2'==>-100,0,100 '3'=>-200,-100,0 '4'=>0,100,200

  sliderRightBtn.addEventListener('click', rightSlide);

  sliderLeftBtn.addEventListener('click', leftSlide);

  //DOTS IMPLEMENTATION
  const dotContainer = document.querySelector('.dots');
  slides.forEach((_, i) =>
    dotContainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide='${i}'></button>`
    )
  );

  const activateCurrDot = function (slide) {
    const dots = document.querySelectorAll('.dots__dot');
    dots.forEach(dot => dot.classList.remove('dots__dot--active'));

    dots[slide].classList.add('dots__dot--active');
  };
  activateCurrDot(0);

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      currSlide = Number(slide);

      activateCurrDot(slide);
      goToSlide(slide);
    }
  });

  //Slide with keyPresses IMPLEMENTAION
  // handle slide with keypresses but only when in view

  const slideObserveCb = function (entries) {
    const [entry] = entries;
    if (entry.isIntersecting) {
      // Now that the section is in view, we can listen for keypress events
      document.addEventListener('keydown', handleKeypress);
    } else {
      // When the section is out of view, stop listening for keypress events
      document.removeEventListener('keydown', handleKeypress);
    }
  };

  // Function to handle keypresses
  const handleKeypress = function (e) {
    if (e.key === 'ArrowRight') {
      rightSlide(e); // Function to go to the next slide
    } else if (e.key === 'ArrowLeft') {
      leftSlide(e); // Function to go to the previous slide
    }
  };
  const slideObserver = new IntersectionObserver(slideObserveCb, {
    root: null,
    threshold: 0.1,
  });

  slideObserver.observe(document.querySelector('#section--3'));
};
slide();

//ask user for leaving page

// window.addEventListener('beforeunload', function (event) {
//   // Display a confirmation dialog before the page unloads
//   event.preventDefault(); // Modern browsers require this to trigger the dialog

//   // Set the returnValue property for older browsers (required for some)
//   event.returnValue = ''; // This ensures the dialog is shown in all browsers
//   console.log('fd');

//   // For some older browsers like Chrome and Firefox, just setting returnValue works.
// });

////////////////////////////////////////////////////////////////////////////

//bubbling phase

// document
//   .querySelector('.section__title')
//   .addEventListener('click', function (e) {
//     //alert('hey yo');
//     //e.stopImmediatePropagation();

//     this.style.setProperty('background-color', 'rgb(255,221,211');
//   });
// document.querySelector('.section').addEventListener(
//   'click',
//   function (e) {
//     //alert('hey');

//     this.style.setProperty('background-color', 'rgb(255,21,211');
//   },
//   true
// );

// //DOM-Traversing

// //downwards
// const h1Children = h1.querySelectorAll('.highlight');
// console.log(h1Children, h1.children);
// //upwards
// console.log(h1.closest('.header__title'));
// console.log(h1.parentElement.parentElement.parentElement.parentElement);
// //sideways,only direct sibling though
// console.log(h1.nextElementSibling, h1.previousElementSibling);
// //mix it up!
// console.log(h1.parentElement.children);
// [...h1.parentElement.children].forEach(el => {
//   if (el !== h1) el.style.backgroundColor = 'rgb(221,4,54)';
// });
