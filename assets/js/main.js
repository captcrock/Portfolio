/**
* Template Name: Personal - v4.3.0
* Template URL: https://bootstrapmade.com/personal-free-resume-bootstrap-template/
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/
(function() {
	'use strict';

	/**
   * Easy selector helper function
   */
	const select = (el, all = false) => {
		el = el.trim();
		if (all) {
			return [ ...document.querySelectorAll(el) ];
		} else {
			return document.querySelector(el);
		}
	};

	/**
   * Easy event listener function
   */
	const on = (type, el, listener, all = false) => {
		let selectEl = select(el, all);

		if (selectEl) {
			if (all) {
				selectEl.forEach((e) => e.addEventListener(type, listener));
			} else {
				selectEl.addEventListener(type, listener);
			}
		}
	};

	/**
   * Scrolls to an element with header offset
   */
	const scrollto = (el) => {
		window.scrollTo({
			top      : 0,
			behavior : 'smooth'
		});
	};

	/**
   * Mobile nav toggle
   */
	on('click', '.mobile-nav-toggle', function(e) {
		select('#navbar').classList.toggle('navbar-mobile');
		this.classList.toggle('bi-list');
		this.classList.toggle('bi-x');
	});

	/**
   * Scrool with ofset on links with a class name .scrollto
   */
	on(
		'click',
		'#navbar .nav-link',
		function(e) {
			let section = select(this.hash);
			if (section) {
				e.preventDefault();

				let navbar = select('#navbar');
				let header = select('#header');
				let sections = select('section', true);
				let navlinks = select('#navbar .nav-link', true);

				navlinks.forEach((item) => {
					item.classList.remove('active');
				});

				this.classList.add('active');

				if (navbar.classList.contains('navbar-mobile')) {
					navbar.classList.remove('navbar-mobile');
					let navbarToggle = select('.mobile-nav-toggle');
					navbarToggle.classList.toggle('bi-list');
					navbarToggle.classList.toggle('bi-x');
				}

				if (this.hash == '#header') {
					header.classList.remove('header-top');
					sections.forEach((item) => {
						item.classList.remove('section-show');
					});
					return;
				}

				if (!header.classList.contains('header-top')) {
					header.classList.add('header-top');
					setTimeout(function() {
						sections.forEach((item) => {
							item.classList.remove('section-show');
						});
						section.classList.add('section-show');
					}, 350);
				} else {
					sections.forEach((item) => {
						item.classList.remove('section-show');
					});
					section.classList.add('section-show');
				}

				scrollto(this.hash);
			}
		},
		true
	);

	/**
   * Activate/show sections on load with hash links
   */
	window.addEventListener('load', () => {
		if (window.location.hash) {
			let initial_nav = select(window.location.hash);

			if (initial_nav) {
				let header = select('#header');
				let navlinks = select('#navbar .nav-link', true);

				header.classList.add('header-top');

				navlinks.forEach((item) => {
					if (item.getAttribute('href') == window.location.hash) {
						item.classList.add('active');
					} else {
						item.classList.remove('active');
					}
				});

				setTimeout(function() {
					initial_nav.classList.add('section-show');
				}, 350);

				scrollto(window.location.hash);
			}
		}
	});

	/**
   * Skills animation
   */
	let skilsContent = select('.skills-content');
	if (skilsContent) {
		new Waypoint({
			element : skilsContent,
			offset  : '80%',
			handler : function(direction) {
				let progress = select('.progress .progress-bar', true);
				progress.forEach((el) => {
					el.style.width = el.getAttribute('aria-valuenow') + '%';
				});
			}
		});
	}

	/**
   * Testimonials slider
   */
	new Swiper('.testimonials-slider', {
		speed         : 600,
		loop          : true,
		autoplay      : {
			delay                : 5000,
			disableOnInteraction : false
		},
		slidesPerView : 'auto',
		pagination    : {
			el        : '.swiper-pagination',
			type      : 'bullets',
			clickable : true
		},
		breakpoints   : {
			320  : {
				slidesPerView : 1,
				spaceBetween  : 20
			},

			1200 : {
				slidesPerView : 3,
				spaceBetween  : 20
			}
		}
	});

	/**
   * Porfolio isotope and filter
   */
	window.addEventListener('load', () => {
		let portfolioContainer = select('.portfolio-container');
		if (portfolioContainer) {
			let portfolioIsotope = new Isotope(portfolioContainer, {
				itemSelector : '.portfolio-item',
				layoutMode   : 'fitRows'
			});

			let portfolioFilters = select('#portfolio-flters li', true);

			on(
				'click',
				'#portfolio-flters li',
				function(e) {
					e.preventDefault();
					portfolioFilters.forEach(function(el) {
						el.classList.remove('filter-active');
					});
					this.classList.add('filter-active');

					portfolioIsotope.arrange({
						filter : this.getAttribute('data-filter')
					});
				},
				true
			);
		}
	});

	/**
   * Initiate portfolio lightbox 
   */
	const portfolioLightbox = GLightbox({
		selector : '.portfolio-lightbox'
	});

	/**
   * Initiate portfolio details lightbox 
   */
	const portfolioDetailsLightbox = GLightbox({
		selector : '.portfolio-details-lightbox',
		width    : '90%',
		height   : '90vh'
	});

	/**
   * Portfolio details slider
   */
	new Swiper('.portfolio-details-slider', {
		speed      : 400,
		loop       : true,
		autoplay   : {
			delay                : 5000,
			disableOnInteraction : false
		},
		pagination : {
			el        : '.swiper-pagination',
			type      : 'bullets',
			clickable : true
		}
	});

	/** 
   * Animation tag line 
   */

	// jQuery(document).ready(function($){
	//   //set animation timing
	//   var animationDelay = 2500,
	//     //loading bar effect
	//     barAnimationDelay = 3800,
	//     barWaiting = barAnimationDelay - 3000, //3000 is the duration of the transition on the loading bar - set in the scss/css file
	//     //letters effect
	//     lettersDelay = 50,
	//     //type effect
	//     typeLettersDelay = 150,
	//     selectionDuration = 500,
	//     typeAnimationDelay = selectionDuration + 800,
	//     //clip effect
	//     revealDuration = 600,
	//     revealAnimationDelay = 1500;

	//   initHeadline();

	// function initHeadline() {
	//   //insert <i> element for each letter of a changing word
	//   singleLetters($('.cd-headline.letters').find('b'));
	//   //initialise headline animation
	//   animateHeadline($('.cd-headline'));
	// }

	// function singleLetters($words) {
	//   $words.each(function(){
	//     var word = $(this),
	//       letters = word.text().split(''),
	//       selected = word.hasClass('is-visible');
	//     for (i in letters) {
	//       if(word.parents('.rotate-2').length > 0) letters[i] = '<em>' + letters[i] + '</em>';
	//       letters[i] = (selected) ? '<i class="in">' + letters[i] + '</i>': '<i>' + letters[i] + '</i>';
	//     }
	//       var newLetters = letters.join('');
	//       word.html(newLetters).css('opacity', 1);
	//   });
	// }

	// function animateHeadline($headlines) {
	//   var duration = animationDelay;
	//   $headlines.each(function(){
	//     var headline = $(this);

	//     if(headline.hasClass('loading-bar')) {
	//       duration = barAnimationDelay;
	//       setTimeout(function(){ headline.find('.cd-words-wrapper').addClass('is-loading') }, barWaiting);
	//     } else if (headline.hasClass('clip')){
	//       var spanWrapper = headline.find('.cd-words-wrapper'),
	//         newWidth = spanWrapper.width() + 10
	//       spanWrapper.css('width', newWidth);
	//     } else if (!headline.hasClass('type') ) {
	//       //assign to .cd-words-wrapper the width of its longest word
	//       var words = headline.find('.cd-words-wrapper b'),
	//         width = 0;
	//       words.each(function(){
	//         var wordWidth = $(this).width();
	//           if (wordWidth > width) width = wordWidth;
	//       });
	//       headline.find('.cd-words-wrapper').css('width', width);
	//     };

	//     //trigger animation
	//     setTimeout(function(){ hideWord( headline.find('.is-visible').eq(0) ) }, duration);
	//   });
	// }

	// function hideWord($word) {
	//   var nextWord = takeNext($word);

	//   if($word.parents('.cd-headline').hasClass('type')) {
	//     var parentSpan = $word.parent('.cd-words-wrapper');
	//     parentSpan.addClass('selected').removeClass('waiting');
	//     setTimeout(function(){
	//       parentSpan.removeClass('selected');
	//       $word.removeClass('is-visible').addClass('is-hidden').children('i').removeClass('in').addClass('out');
	//     }, selectionDuration);
	//     setTimeout(function(){ showWord(nextWord, typeLettersDelay) }, typeAnimationDelay);

	//   } else if($word.parents('.cd-headline').hasClass('letters')) {
	//     var bool = ($word.children('i').length >= nextWord.children('i').length) ? true : false;
	//     hideLetter($word.find('i').eq(0), $word, bool, lettersDelay);
	//     showLetter(nextWord.find('i').eq(0), nextWord, bool, lettersDelay);

	//   }  else if($word.parents('.cd-headline').hasClass('clip')) {
	//     $word.parents('.cd-words-wrapper').animate({ width : '2px' }, revealDuration, function(){
	//       switchWord($word, nextWord);
	//       showWord(nextWord);
	//     });

	//   } else if ($word.parents('.cd-headline').hasClass('loading-bar')){
	//     $word.parents('.cd-words-wrapper').removeClass('is-loading');
	//     switchWord($word, nextWord);
	//     setTimeout(function(){ hideWord(nextWord) }, barAnimationDelay);
	//     setTimeout(function(){ $word.parents('.cd-words-wrapper').addClass('is-loading') }, barWaiting);

	//   } else {
	//     switchWord($word, nextWord);
	//     setTimeout(function(){ hideWord(nextWord) }, animationDelay);
	//   }
	// }

	// function showWord($word, $duration) {
	//   if($word.parents('.cd-headline').hasClass('type')) {
	//     showLetter($word.find('i').eq(0), $word, false, $duration);
	//     $word.addClass('is-visible').removeClass('is-hidden');

	//   }  else if($word.parents('.cd-headline').hasClass('clip')) {
	//     $word.parents('.cd-words-wrapper').animate({ 'width' : $word.width() + 10 }, revealDuration, function(){
	//       setTimeout(function(){ hideWord($word) }, revealAnimationDelay);
	//     });
	//   }
	// }

	// function hideLetter($letter, $word, $bool, $duration) {
	//   $letter.removeClass('in').addClass('out');

	//   if(!$letter.is(':last-child')) {
	//      setTimeout(function(){ hideLetter($letter.next(), $word, $bool, $duration); }, $duration);
	//   } else if($bool) {
	//      setTimeout(function(){ hideWord(takeNext($word)) }, animationDelay);
	//   }

	//   if($letter.is(':last-child') && $('html').hasClass('no-csstransitions')) {
	//     var nextWord = takeNext($word);
	//     switchWord($word, nextWord);
	//   }
	// }

	// function showLetter($letter, $word, $bool, $duration) {
	//   $letter.addClass('in').removeClass('out');

	//   if(!$letter.is(':last-child')) {
	//     setTimeout(function(){ showLetter($letter.next(), $word, $bool, $duration); }, $duration);
	//   } else {
	//     if($word.parents('.cd-headline').hasClass('type')) { setTimeout(function(){ $word.parents('.cd-words-wrapper').addClass('waiting'); }, 200);}
	//     if(!$bool) { setTimeout(function(){ hideWord($word) }, animationDelay) }
	//   }
	// }

	// function takeNext($word) {
	//   return (!$word.is(':last-child')) ? $word.next() : $word.parent().children().eq(0);
	// }

	// function takePrev($word) {
	//   return (!$word.is(':first-child')) ? $word.prev() : $word.parent().children().last();
	// }

	// function switchWord($oldWord, $newWord) {
	//   $oldWord.removeClass('is-visible').addClass('is-hidden');
	//   $newWord.removeClass('is-hidden').addClass('is-visible');
	// }

	var animationDelay = 2500;

	animateHeadline($('.cd-headline rotate-1'));

	function animateHeadline($headlines) {
		$headlines.each(function() {
			var headline = $(this);
			//trigger animation
			setTimeout(function() {
				hideWord(headline.find('.is-visible'));
			}, animationDelay);
			//other checks here ...
		});
	}

	function hideWord($word) {
		var nextWord = takeNext($word);
		switchWord($word, nextWord);
		setTimeout(function() {
			hideWord(nextWord);
		}, animationDelay);
	}

	function takeNext($word) {
		return !$word.is(':last-child') ? $word.next() : $word.parent().children().eq(0);
	}

	function switchWord($oldWord, $newWord) {
		$oldWord.removeClass('is-visible').addClass('is-hidden');
		$newWord.removeClass('is-hidden').addClass('is-visible');
	}
});
