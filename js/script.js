

document.addEventListener("DOMContentLoaded", () => {
	// Swooth scroll

	const lenis = new Lenis({
		duration: 1.2,
		easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
		direction: 'vertical',
		gestureDirection: 'vertical',
		smoothHandheld: true,
	});

	function raf(time) {
		lenis.raf(time);
		requestAnimationFrame(raf);
	}
	requestAnimationFrame(raf);

	const anchorLinks = document.querySelectorAll('a[href^="#"]');

	anchorLinks.forEach(link => {
		link.addEventListener('click', (e) => {
			e.preventDefault();

			const targetId = link.getAttribute('href');

			if (targetId === '#') return;

			const targetElement = document.querySelector(targetId);

			if (targetElement) {
				scrollTo(targetElement)
			}
		});
	});

	function scrollTo(targetElement = 0) {
		lenis.scrollTo(targetElement, {
			offset: -header.offsetHeight,
			duration: 1.5,
			immediate: false,
			easing: (t) => 1 - Math.pow(1 - t, 4)
		});
	}
	function lockScroll() {
		lenis.stop();
		document.body.classList.add('_lock');
	}

	function unlockScroll() {
		lenis.start();
		document.body.classList.remove('_lock');
	}
	// preloader
	const preloader = document.querySelector('[data-preloader]');
	if (preloader) {
		const percentageDisplay = document.querySelector('[data-preloader-percentage]');

		if (!preloader || !percentageDisplay) return;

		const images = Array.from(document.images).filter(img => img.loading !== 'lazy');
		const total = images.length;
		let loaded = 0;
		let current = 0;
		let target = total === 0 ? 100 : 0;

		function updateTarget() {
			target = Math.min(100, Math.round((loaded / total) * 100));
		}

		function onResourceDone() {
			loaded++;
			updateTarget();
		}

		images.forEach(img => {
			if (img.complete) {
				onResourceDone();
			} else {
				img.addEventListener('load', onResourceDone, { once: true });
				img.addEventListener('error', onResourceDone, { once: true });
			}
		});

		function forceComplete() {
			target = 100;
		}
		if (document.readyState === 'complete') {
			forceComplete();
		} else {
			window.addEventListener('load', forceComplete, { once: true });
		}

		function animate() {
			if (current < target) {
				current += Math.max(1, Math.ceil((target - current) / 8));
				if (current > target) current = target;
				percentageDisplay.textContent = `${current}%`;
			}

			if (current < 100) {
				requestAnimationFrame(animate);
			} else {
				setTimeout(hidePreloader, 300);
			}
		}

		function hidePreloader() {
			preloader.classList.add('_hide')
			const animElems = document.querySelectorAll('[data-anim-after-loading]');
			if (animElems) {
				animElems.forEach(animElem => {
					animElem.classList.add('--start-anim')
				});
			}
			unlockScroll()
		}

		lockScroll()
		requestAnimationFrame(animate);
	}




	// burger-menu
	const burgerMenu = document.querySelector('.burger-menu'),
		headerWrapper = document.querySelector('.header__wrapper')


	window.addEventListener('click', (e) => {
		let target = e.target
		if (target.closest('.burger-menu')) {
			headerWrapper.classList.add('_active');
			lockScroll()
			return

		} else if (!target.closest('.header__body') || target.closest('.header__close-button')) {
			if (headerWrapper.classList.contains('_active')) {
				headerWrapper.classList.remove('_active');
				unlockScroll()
			}
		}
	});

	// animation header on scroll
	const header = document.querySelector('.header'),
		topscrollButton = document.querySelector('.top-scroll-button')
	if (header) {
		window.addEventListener('scroll', (e) => {
			const scrollDistance = window.scrollY
			if (scrollDistance >= 20) {
				header.classList.add('--on-scroll')
			} else {
				header.classList.remove('--on-scroll')
			}


			if (scrollDistance > window.innerHeight) {
				topscrollButton.classList.add('_active')
			} else {
				topscrollButton.classList.remove('_active')
			}
		})
	}

	// top scroll button

	topscrollButton.addEventListener('click', (e) => {
		scrollTo()
	})
	// pop-ups
	const popUps = document.querySelectorAll('[data-pop-up]');
	if (popUps) {
		popUps.forEach(popUp => {
			const popUpId = popUp.dataset.popUp
			const triggers = document.querySelectorAll(`[data-pop-up-trigger="${popUpId}"]`);
			const closeButton = document.querySelector(`[data-pop-up-close="${popUpId}"]`)
			const path = popUp.querySelector(`[data-pop-up-back="${popUpId}"] path`);
			const dStart = path.getAttribute('d');
			const dEnd = popUp.getAttribute('data-opening');
			const speed = parseInt(popUp.getAttribute('data-speed'), 10) || 400;
			const anchorLinks = getLocalAnchorLinks();
			let isOpen = false;
			let currentAnimation = null;

			const commitPath = (d) => {
				path.setAttribute('d', d);
				if (currentAnimation) {
					currentAnimation.cancel();
					currentAnimation = null;
				}
			};
			if (triggers) {
				triggers.forEach(trigger => {
					trigger.addEventListener('click', () => {
						if (currentAnimation && currentAnimation.playState === 'running') {
							currentAnimation.cancel();
						}

						if (!isOpen) {
							openPopup()
						}
					});
					if (anchorLinks) {
						anchorLinks.forEach(anchorLink => {
							anchorLink.addEventListener('click', (e) => {
								e.preventDefault();

								closePopup()

								setTimeout(() => {
									const targetID = anchorLink.hash.slice(1);
									const targetElement = document.getElementById(targetID);

									scrollTo(targetElement)

								}, 500);
							})
						});
					}

					closeButton.addEventListener('click', closePopup)

					function closePopup() {
						popUp.classList.remove('_active');
						unlockScroll()
						currentAnimation = path.animate(
							[
								{ d: `path("${dEnd}")` },
								{ d: `path("${dStart}")` }
							],
							{
								duration: speed,
								delay: 100,
								easing: 'ease-in-out',
								fill: 'forwards'
							}
						);

						currentAnimation.onfinish = () => commitPath(dStart);
						isOpen = false;
					}
					function openPopup() {
						trigger.classList.add('_active');
						popUp.classList.add('_active');
						lockScroll()
						currentAnimation = path.animate(
							[
								{ d: `path("${dStart}")` },
								{ d: `path("${dEnd}")` }
							],
							{
								duration: speed,
								easing: 'ease-in-out',
								fill: 'forwards'
							}
						);

						currentAnimation.onfinish = () => commitPath(dEnd);
						isOpen = true;
					}

				});
			}



			function getLocalAnchorLinks() {
				const currentPath = window.location.pathname;
				const allLinks = popUp.querySelectorAll('a');

				return Array.from(allLinks).filter(link => {
					const hasHash = link.hash && link.hash !== '#';
					const isSamePage = link.pathname === currentPath;

					return hasHash && isSamePage;
				});
			}


		});
	}

	const animationItems = document.querySelectorAll('[data-animation-on-scroll]');
	if (animationItems) {
		const options = {
			root: null,
			rootMargin: "0px",
			threshold: 0.15
		};

		const callback = (entries, observer) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					entry.target.classList.add("_active");

					observer.unobserve(entry.target);
				}
			});
		};

		const observer = new IntersectionObserver(callback, options);
		animationItems.forEach(animationItem => {
			observer.observe(animationItem);

		});
	}
});

