const servicesButtons = document.querySelectorAll(".services__bottom-button, .team__item-button");

servicesButtons.forEach((button) => {
	button.addEventListener("click", (e) => {
	e.preventDefault();
	const yButton = document.querySelector(".yButton");
	if (yButton) {
		yButton.click();
		} else {
			console.warn("yButton does not yet exist in the DOM");
		}
	});
});
