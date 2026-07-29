// home page
const homeHeroSwiper = document.querySelector('.content-home-hero__swiper');

if (homeHeroSwiper) {
	const heroSwiper = new Swiper(homeHeroSwiper, {
		slidesPerView: 1,
		spaceBetween: 15,
		loop: true,
		speed: 500,
		autoplay: {
			delay: 3000,
			pauseOnMouseEnter: true,
			disableOnInteraction: false,
		},
		pagination: {
			el: '.content-home-hero__pagination',
			type: 'bullets',
			clickable: true,
		},
	});
}

const postSwiper = document.querySelector('.home-articles__swiper');

if (postSwiper) {
	const articlesSwiper = new Swiper(postSwiper, {
		slidesPerView: 1,
		spaceBetween: 15,
		loop: true,
		speed: 500,
		autoplay: {
			delay: 3000,
			pauseOnMouseEnter: true,
			disableOnInteraction: false,
		},
		pagination: {
			el: '.home-articles__pagination',
			type: 'bullets',
			clickable: true,
		},
		breakpoints: {
			500: {
				slidesPerView: 1.5,
			},
			690: {
				slidesPerView: 2,
			},
			992: {
				slidesPerView: 3,
			}
		}
	});
}