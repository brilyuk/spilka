gsap.registerPlugin(ScrollTrigger);

const wrapper = document.querySelector(".scroll__track");
const container = document.querySelector(".scroll__frame");
const sections = gsap.utils.toArray(".scroll__section");
const links = document.querySelectorAll(".header__menu-aside-link");
const contactsSection = document.querySelector(".contacts__section");
const body = document.querySelector("body");
const preloader = document.querySelector(".preloader");
const preloaderLogo = preloader.querySelector(".preloader__logo");
const preloaderTitle = preloader.querySelector(".preloader__title");
const toggl = document.querySelector(".header__toggl");
const servicesButton = document.querySelector(".services__bottom-button");
const serviceSectionLink = document.querySelector("[data-href='#services-section']");
let isPreloaderShow = localStorage.getItem("isPreloaderShow");
let horizontalScroll;
let isMobile = window.innerWidth < 768;
let mm = gsap.matchMedia();

// always reset scroll to the top
ScrollTrigger.clearScrollMemory("manual");
window.scrollTo(0, 0);

function setActive(element) {
	document.querySelectorAll(".header__menu-aside-link").forEach((link) => link.classList.remove("active"));
	element.classList.add("active");
}

function setHeaderMenuColor(isWhiteMenuColor) {
	if (isWhiteMenuColor) {
		document.querySelectorAll(".header__menu-link").forEach((link) => link.classList.add("white-color"));
	} else {
		document.querySelectorAll(".header__menu-link").forEach((link) => link.classList.remove("white-color"));
	}
}

function setLogoLangColor(isWhiteLogoColor) {
	if (isWhiteLogoColor) {
		document.querySelector(".header__logo-image").classList.add("white-color");
		document.querySelector(".header__lang-link").classList.add("white-color");
		document.querySelector(".header__toggl-icon").classList.add("white-color");
	} else {
		document.querySelector(".header__logo-image").classList.remove("white-color");
		document.querySelector(".header__lang-link").classList.remove("white-color");
		document.querySelector(".header__toggl-icon").classList.remove("white-color");
	}
}

mm.add("(min-width: 1024px)", () => {
	
	// main horizontal scroll animation
	horizontalScroll = gsap.to(sections, {
		xPercent: -100 * (sections.length - 1),
		ease: "none",
		scrollTrigger: {
			trigger: ".scroll__frame",
			pin: true,
			pinSpacing: true,
			start: "top top",
			scrub: 2,
			end: () => "+=" + (container.offsetWidth - innerWidth),
			onUpdate: (self) => {
				let activeIndex = Math.round(self.progress * (sections.length - 1));
				const activeSection = sections[activeIndex];
				const isWhiteMenuColor = activeSection.getAttribute("data-header-white-color") === "true";
				const isWhiteLogoColor = activeSection.getAttribute("data-logo-white-color") === "true";
				setHeaderMenuColor(isWhiteMenuColor);
				setLogoLangColor(isWhiteLogoColor);
				setActive(links[activeIndex]);
			}
		}
	});
	
	// contacts section menu items color animation
	gsap.to(contactsSection, {
		scrollTrigger: {
			trigger: contactsSection,
			duration: 1,
			onUpdate: (self) => {
				if (self.progress > 0.45) {
					const isWhiteMenuColor = contactsSection.getAttribute("data-header-white-color") === "true";
					const isWhiteLogoColor = contactsSection.getAttribute("data-logo-white-color") === "true";
					setHeaderMenuColor(isWhiteMenuColor);
					setLogoLangColor(isWhiteLogoColor);
					setActive(links[sections.length]);
					isContactsSectionActive = true;
				} else {
					setHeaderMenuColor(false);
					setLogoLangColor(false);
					setActive(links[sections.length - 1]);
					isContactsSectionActive = false;
				}
			}
		}
	});
});

// on mobile change header color on scroll sections
function mobileScroll() {
	mm.add("(max-width: 768px)", () => {
		Array.from(document.querySelectorAll("section")).forEach((section) => {
			gsap.to("body", {
				scrollTrigger: {
					trigger: section,
					start: "top 10%",
					end: "bottom 10%",
					onToggle: (self) => {
						if (self.isActive) {
							const isWhiteLogoColor = self.trigger.getAttribute("data-logo-white-color") === "true";
							setLogoLangColor(isWhiteLogoColor);
						} else {
							setLogoLangColor(false);
						}
					}
				}
			});
		});
	});
}

// mobile toggl click
toggl.addEventListener("click", () => {
	setTimeout(() => {
		toggl.closest(".w--open") ? setLogoLangColor(false) : mobileScroll();
	}, 300);
});

// links click scroll to sections
function scrollToSection(e) {
	e.preventDefault();
	let targetElem = document.querySelector(e.target.getAttribute("data-href"));
	let y = targetElem;
	if (targetElem && container.isSameNode(targetElem.parentElement)) {
		let totalScroll = horizontalScroll.scrollTrigger.end - horizontalScroll.scrollTrigger.start,
			totalMovement = (sections.length - 1) * targetElem.offsetWidth;
		y = Math.round(horizontalScroll.scrollTrigger.start + (targetElem.offsetLeft / totalMovement) * totalScroll);
	}
	gsap.to(window, {
		scrollTo: {
			y: y,
			autoKill: false
		}
	});
}

links.forEach((anchor) => {
	anchor.addEventListener("click", function (e) {
		scrollToSection(e);
	});
});

serviceSectionLink.addEventListener("click", (e) => {
	if (isMobile) {
		toggl.click();
		gsap.to(window, { scrollTo: { y: e.target.getAttribute("data-href"), autoKill: false } });
	} else {
		scrollToSection(e);
	}
});

// hide preloader
function removePreloader() {
	preloader.classList.remove("show");
	body.classList.remove("show-preloader");
}

// animate preloader
function animatePreloader() {
	if (isPreloaderShow !== "true") {
		// if (isPreloaderShow) {
		gsap.to(preloaderLogo, { opacity: 1, duration: 0.5 }, 0.5);
		gsap.fromTo(preloaderLogo, { y: "100%" }, { y: 0, duration: 0.5 }, 1);
		gsap.to(preloaderTitle, { opacity: 1, duration: 0.5 }, 1.5);
		gsap.to(
			preloader,
			{
				opacity: 0,
				duration: 1,
				onComplete: () => {
					removePreloader(), animateIntroSection(), !isPreloaderShow && localStorage.setItem("isPreloaderShow", true);
				}
			},
			4
		);
	} else {
		removePreloader();
		animateIntroSection();
	}
}

// animate intro section
function animateIntroSection() {
	const intro = document.querySelector(".intro");
	const introBg = intro.querySelector(".intro__bg");
	const introBox = intro.querySelector(".intro__box");
	const mainMenu = document.querySelector(".header__menu-main");
	const introBoxImage = intro.querySelector(".intro__box-image");
	const introBoxTitle = intro.querySelector(".intro__box-title");
	const introTexts = document.querySelectorAll(".intro__box-text");
	const TL = gsap.timeline({
		scrollTrigger: {
			trigger: intro,
			toggleActions: "restart none none none",
			start: "top right"
		}
	});
	TL.fromTo(mainMenu, { y: "-100%", opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, 2);
	TL.to(introBg, { scale: 1.05, duration: 1.5 }, 0.5);
	TL.fromTo(introBox, { y: "-100%", opacity: 0 }, { y: 0, opacity: 1, duration: 2.5, ease: "power4.out" }, 1);
	TL.fromTo(introBoxImage, { y: "100%" }, { y: 0, duration: 1, ease: "power4.out" }, 2.5);
	TL.fromTo(introBoxTitle, { y: "100%" }, { y: 0, duration: 1, ease: "power4.out" }, 3);
	introTexts.forEach((text) => {
		TL.fromTo(text, { y: "100%" }, { y: 0, duration: 1, ease: "power4.out" }, 3);
	});
	mm.add("(min-width: 1024px)", () => {
		TL.fromTo(".header__menu-aside", { x: "100%", opacity: 0 }, { x: 0, opacity: 1, duration: 0.5 }, 2);
	});
}

// animate about section
function animateAboutSection() {
	const about = document.querySelector(".about");
	const aboutBg = about.querySelector(".about__inner-bg");
	const aboutTitle = about.querySelector(".about__box-title");
	const aboutText = about.querySelector(".about__box-top-text");
	const aboutBoxBottom = about.querySelectorAll(".about__box-bottom");
	const aboutImage = about.querySelector(".about__image");
	const TL = gsap.timeline(
		isMobile
			? {
					scrollTrigger: {
						trigger: about,
						toggleActions: "restart pause resume reverse",
						start: "top 70%"
					}
			  }
			: {
					scrollTrigger: {
						trigger: about,
						toggleActions: "restart pause resume reverse",
						start: "left 40%",
						containerAnimation: horizontalScroll
					}
			  }
	);
	TL.fromTo(
		aboutBg,
		{ y: "-100%", opacity: 0 },
		{ y: 0, opacity: 1, duration: isMobile ? 0.5 : 1.5, ease: "power4.out" }
	);
	TL.fromTo(aboutTitle, { opacity: 0, x: "50%" }, { opacity: 1, x: 0, duration: 0.5 });
	TL.fromTo(aboutText, { opacity: 0, x: "50%" }, { opacity: 1, x: 0, duration: 0.5 });
	TL.fromTo(aboutImage, { opacity: 0, x: "50%" }, { opacity: 1, x: 0, duration: 0.5 }, isMobile ? null : 0.5);
	aboutBoxBottom.forEach((item) => {
		const bg = item.querySelector(".about__box-bottom-bg");
		const text = item.querySelector(".about__box-text");
		TL.fromTo(bg, { opacity: 0, y: "100%" }, { opacity: 1, y: 0, duration: 0.5 }, isMobile ? null : 1);
		TL.fromTo(text, { y: "100%" }, { y: 0, duration: 0.5 }, isMobile ? null : 1.5);
	});
}

// animate services section
function animateServicesSection() {
	const services = document.querySelector(".services");
	const servicesBg = services.querySelector(".services__bg");
	const servicesTitle = services.querySelector(".services__title");
	const servicesItemsLine = Array.from(services.querySelectorAll(".services__item-line"));
	const servicesItemsContent = Array.from(services.querySelectorAll(".services__item-content"));
	const servicesButton = services.querySelector(".services__bottom-button");
	const about = document.querySelector(".about");
	const aboutBox = document.querySelector(".about__box");
	const aboutImage = document.querySelector(".about__image");
	const serviceBgOffset = isMobile ? 0 : (about.offsetWidth - aboutBox.offsetWidth - aboutImage.offsetWidth) / 2;
	const TL = gsap.timeline(
		isMobile
			? {
					scrollTrigger: {
						trigger: services,
						toggleActions: "restart pause resume reverse",
						start: "top 70%"
					}
			  }
			: {
					scrollTrigger: {
						trigger: services,
						toggleActions: "restart pause resume reverse",
						start: "left 30%",
						containerAnimation: horizontalScroll
					}
			  }
	);
	TL.fromTo(
		servicesBg,
		{ x: "100%", width: "100%" },
		{ x: -serviceBgOffset, width: `calc(100% + ${serviceBgOffset}px)`, duration: 1.2 }
	);
	TL.fromTo(servicesTitle, { opacity: 0, x: "50%" }, { opacity: 1, x: 0, duration: 0.5 });
	TL.fromTo(servicesButton, { opacity: 0 }, { opacity: 1, duration: 0.5 }, 2);
	(isMobile ? servicesItemsLine : servicesItemsLine.reverse()).forEach((line, index) => {
		TL.fromTo(line, { x: "100%" }, { x: 0, duration: 0.5 }, index * 1 * 0.3);
	});
	(isMobile ? servicesItemsContent : servicesItemsContent.reverse()).forEach((elem, index) => {
		TL.fromTo(elem, { opacity: 0, y: "50%" }, { opacity: 1, y: 0, duration: 0.5 }, index * 1 * 0.3);
	});
}

// animate gallery section
function animateGallerySection() {
	const gallery = document.querySelector(".gallery");
	const bg = gallery.querySelector(".gallery__bg");
	const titleText = gallery.querySelector(".gallery__title-text");
	const titleImage = gallery.querySelector(".gallery__title-image");
	const bottomText = gallery.querySelector(".gallery__bottom-text");
	const button = gallery.querySelector(".gallery__bottom-button");
	const sliderItem = gallery.querySelectorAll(".gallery__slider-item");
	const sliderButtons = gallery.querySelector(".gallery__slider-buttons");
	const TL = gsap.timeline(
		isMobile
			? {
					scrollTrigger: {
						trigger: gallery,
						toggleActions: "restart pause resume reverse",
						start: "top 50%"
					}
			  }
			: {
					scrollTrigger: {
						trigger: gallery,
						toggleActions: "restart pause resume reverse",
						start: "left 40%",
						containerAnimation: horizontalScroll
					}
			  }
	);
	TL.fromTo(bg, { y: "-100%", opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power4.out" });
	sliderItem.forEach((item, index) => {
		if (index <= 3) {
			TL.fromTo(item, { x: "50%", opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, ease: "power4.out" });
		}
	});
	TL.fromTo(sliderButtons, { y: "100%" }, { y: 0, duration: 0.5 });
	TL.fromTo(titleText, { x: "50%", opacity: 0 }, { x: 0, opacity: 1, duration: 0.5 }, 0.5);
	TL.fromTo(titleImage, { opacity: 0 }, { opacity: 1, duration: 0.5 }, 0.6);
	TL.fromTo(bottomText, { x: "50%", opacity: 0 }, { x: 0, opacity: 1, duration: 0.5 });
	TL.fromTo(button, { opacity: 0 }, { opacity: 1, duration: 0.5 });
}

// animate contacts section
function animateContactsSection() {
	const contacts = document.querySelector(".contacts");
	const wrap = contacts.querySelector(".contacts__wrap");
	const wrapTitle = contacts.querySelector(".contacts__wrap-title");
	const map = contacts.querySelector(".contacts__map");
	const mapImage = contacts.querySelector(".contacts__map-image");
	const mapPins = contacts.querySelector(".contacts__map-pins");
	const wrapItems = contacts.querySelector(".contacts__wrap-box").children;
	const TL = gsap.timeline({
		scrollTrigger: {
			trigger: contacts,
			toggleActions: "restart pause resume reverse",
			start: "top 60%"
		}
	});
	const TLMap = gsap.timeline({
		scrollTrigger: {
			trigger: map,
			start: "top 70%",
			end: "+=80%",
			scrub: true
		}
	});
	TL.fromTo(wrap, { y: "-100%", opacity: 0 }, { y: 0, opacity: 1, duration: isMobile ? 0.5 : 1.5, ease: "power4.out" });
	TL.fromTo(wrapTitle, { y: "100%" }, { y: 0, duration: 0.5, ease: "power4.out" });
	Array.from(wrapItems).forEach((item) => {
		TL.fromTo(item, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: "power4.out" });
	});
	TLMap.fromTo(
		mapImage,
		{ yPercent: 0, scale: 1.5, rotateX: "45deg", translateZ: 1000 },
		{ yPercent: -20, scale: 2.5, rotateX: "60deg", translateZ: -1000, ease: "none" }
	);
	TLMap.fromTo(
		mapPins,
		{ yPercent: 0, scale: 1, rotateX: "45deg", translateZ: 1000 },
		{ yPercent: -20, scale: 1.5, rotateX: "50deg", translateZ: -1000, ease: "none" },
		0
	);
}

window.addEventListener("DOMContentLoaded", () => {
	animatePreloader();
	animateAboutSection();
	animateServicesSection();
	animateGallerySection();
	animateContactsSection();
	mobileScroll();
	servicesButton.addEventListener("click", (e) => {
		e.preventDefault();
		const yButton = document.querySelector(".yButton");
		if (yButton) {
			yButton.click();
		} else {
			console.warn("yButton does not yet exist in the DOM");
		}
	});
});

// slider init
var swiper = new Swiper(".swiper", {
	grabCursor: true,
	slidesPerView: 1.2,
	navigation: {
		prevEl: ".gallery__slider-button-prev",
		nextEl: ".gallery__slider-button-next"
	},
	breakpoints: {
		768: {
			slidesPerView: 2
		},
		1024: {
			slidesPerView: 4
		}
	}
});
