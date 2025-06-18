gsap.registerPlugin(ScrollTrigger);

const team = document.querySelector(".team");
const teamItems = team.querySelectorAll(".team__item");
const teamToggles = team.querySelectorAll(".team__item-toggle");
const activeContent = team.querySelector(".team__item-content.active");
const header = document.querySelector(".header");
const burger = header.querySelector(".header__burger");
let isMobile = window.innerWidth < 768;

// animate team
(isMobile ? teamItems : Array.from(teamItems).reverse()).forEach((item, index) => {
	gsap.fromTo(item, { opacity: 0, x: "-100%" }, { opacity: 1, x: 0, duration: 1 }, index * 0.5);
});

gsap.fromTo(
	activeContent,
	{ opacity: 0, y: "100%" },
	{
		opacity: 1,
		y: 0,
		onComplete: () => {
			activeContent.removeAttribute("style");
		}
	},
	isMobile ? 1 : 3
);

gsap.fromTo(header, { opacity: 0, y: "-100%" }, { opacity: 1, y: 0, duration: 1 }, isMobile ? 1 : 3.5);

if (teamItems) {
	function setActiveItem(element) {
		if (element.classList.contains("active")) return;
		teamItems.forEach((item) => {
			item.querySelector(".team__item-content").classList.remove("active");
			item.classList.remove("active");
		});
		element.classList.add("active");
		setTimeout(() => {
			element.querySelector(".team__item-content").classList.add("active");
		}, 500);
	}
}

function setLogoLangColor(isWhiteLogoColor) {
	if (isWhiteLogoColor) {
		document.querySelector(".header__logo-image").classList.add("white-color");
		document.querySelector(".header__lang-link").classList.add("white-color");
		burger.querySelectorAll(".toggle-line").forEach((line) => line.classList.add("white-color"));
	} else {
		document.querySelector(".header__logo-image").classList.remove("white-color");
		document.querySelector(".header__lang-link").classList.remove("white-color");
		burger.querySelectorAll(".toggle-line").forEach((line) => line.classList.remove("white-color"));
	}
}

burger.addEventListener("click", () => {
	setTimeout(() => {
		burger.closest(".w--open") ? setLogoLangColor(false) : setLogoLangColor(true);
	}, 300);
});

teamToggles.forEach((toggle) => {
	toggle.addEventListener("click", function (e) {
		e.target.closest(".team__item-toggle").classList.toggle("open");
		e.target.closest(".team__item").querySelector(".team__item-text").classList.toggle("open");
	});
});

function changeActiveItem() {
	teamItems.forEach((item) => {
		item.addEventListener("click", function (e) {
			setActiveItem(e.target.closest(".team__item"));
		});
	});
}

let swiper = new Swiper(".swiper", {
	grabCursor: true,
	slidesPerView: 1.2
});

swiper.on("slideChange", function (e) {
	setActiveItem(teamItems[e.activeIndex]);
});

document.addEventListener("DOMContentLoaded", () => {
	if (window.innerWidth > 768) {
		swiper && swiper.destroy();
		changeActiveItem();
	}
});
