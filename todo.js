var gCheckDatetime = {};


function init() {
	try {
		const checkDatetime = JSON.parse(localStorage.checkDatetime);
		if (typeof checkDatetime == 'object')
			gCheckDatetime = checkDatetime;
	} catch (e) {
		gCheckDatetime = {};
	}

	let listdiv = document.getElementById("listDiv");
	const template = document.querySelector("#template-todo-item").innerHTML;
	
	let maxTextId;
	let maxTextLen = 0;
	for (const id in gItemList) {
		if (maxTextLen < gItemList[id]["text"].length) {
			maxTextId = id;
			maxTextLen = gItemList[id]["text"].length;
		}

		let itemhtml = template.replaceAll("{{todo-item-id}}", id)
			.replaceAll("{{todo-item-text}}", gItemList[id]["text"]);

		// 아이템 색상 설정
		if ("color" in gItemList[id])
			itemhtml = itemhtml.replaceAll("{{todo-item-color}}", "background-color: " + gItemList[id]["color"] + " !important;");
		else
			itemhtml = itemhtml.replaceAll("{{todo-item-color}}", "");

/*
		// 이미지 주소 체크
		if ("img-src" in gItemList[id])
			itemhtml = itemhtml.replaceAll("{{todo-item-img-src}}", gItemList[id]["img"]);
		else
			itemhtml = itemhtml.replaceAll("{{todo-item-img-src}}", "./default-item.jpg");
*/

		listdiv.innerHTML += itemhtml;
	}

	let new_style = document.createElement('style');
	document.head.appendChild(new_style);

	let maxLenDiv = document.getElementById("itemDiv_" + maxTextId);
	let fontPercent = 100 * Math.max(
		maxLenDiv.clientWidth / maxLenDiv.firstElementChild.firstElementChild.offsetWidth,
		maxLenDiv.clientHeight / maxLenDiv.firstElementChild.firstElementChild.offsetHeight / 2
	)
	new_style.sheet.insertRule("span {font-size: " + fontPercent + "%;}");

	// 세로폭 조정
	if (document.body.clientHeight > document.getElementById("listDiv").clientHeight) {
		let divHeight = 100 / Math.ceil(Object.keys(gItemList).length / 2)
		new_style.sheet.insertRule("div#listDiv {height: 100% !important;}");
		new_style.sheet.insertRule("div.itemDiv {height: " + divHeight + "% !important;}");
	}

	update();
}


function update() {
	let current = new Date();
	current.setMinutes(0, 0, 0);
	let renewal;

	for (const id in gItemList) {
		// 마지막 기록한 시간 체크

		if (gItemList[id]["term"] == "daily") {
			renewal = current.setHours(gItemList[id]["renewal"]);
		}
		else if (gItemList[id]["term"] == "weekly") {
			let diff = current.getDay() - gItemList[id]["renewal"];
			if (diff < 0) diff += 7;

			renewal = current.setHours(0)
				.setDate(current.getDate() - diff);
		}
		else if (gItemList[id]["term"] == "monthly") {
			renewal = current.setHours(0)
				.setDate(gItemList[id]["renewal"]);
		}
		renewal = new Date(renewal);

		if (id in gCheckDatetime
			&& new Date(gCheckDatetime[id]) > renewal)
			document.getElementById("itemDiv_" + id).classList.add("hidden");
		else
			document.getElementById("itemDiv_" + id).classList.remove("hidden");
	}

	let refreshTime = new Date().setHours(24,0,0,0) - new Date();
	window.setTimeout(update, refreshTime);
}


function toggleItem(id) {
	const res = document.getElementById("itemDiv_" + id).classList.toggle("hidden");

	if (res)
		gCheckDatetime[id] = new Date();
	else
		delete(gCheckDatetime[id]);

	localStorage.checkDatetime = JSON.stringify(gCheckDatetime);
}

