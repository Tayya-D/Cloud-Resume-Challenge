
// JavaScript code that gets the count number or in this case the number of views from our AWS DynamoDB in eu-west-2
const counter = document.querySelector(".counter-number")
async function updateCounter() {
	let response = await fetch ("https://z4qype23yt4bd32v54kyt4pexu0mmpci.lambda-url.eu-west-2.on.aws/")
	let data = await response.json();
	counter.innerHTML = 'Views: ${data}';
}
updateCounter();