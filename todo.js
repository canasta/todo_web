var gCheckDatetime = {};

function init() {
	try {
		const checkDatetime = JSON.parse(localStorage.checkDatetime);
		if (typeof checkDatetime == 'object')
			gCheckDatetime = checkDatetime;
	} catch (e) {
		gCheckDatetime = {};
	}

	var listdiv = document.getElementById("listDiv");
	const template = document.querySelector("#template-todo-item").innerHTML;
	for (const id in gItemList) {
		let itemhtml = template.replaceAll("{{todo-item-id}}", id)
			.replaceAll("{{todo-item-text}}", gItemList[id]["text"]);

		// 마지막 기록한 시간 체크
		let current = new Date();
		current.setMinutes(0, 0, 0);
		let renewal;

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
			itemhtml = itemhtml.replaceAll("{{todo-item-visibility}}", "hidden");
		else
			itemhtml = itemhtml.replaceAll("{{todo-item-visibility}}", "");

		// 이미지 주소 체크
		if ("img-src" in gItemList[id])
			itemhtml = itemhtml.replaceAll("{{todo-item-img-src}}", gItemList[id]["img"]);
		else
			itemhtml = itemhtml.replaceAll("{{todo-item-img-src}}", "./default-item.jpg");

		listdiv.innerHTML += itemhtml;
	}
}


function toggleItem(id) {
	const res = document.getElementById(id).classList.toggle("hidden");

	if (res)
		gCheckDatetime[id] = new Date();
	else
		delete(gCheckDatetime[id]);

	localStorage.checkDatetime = JSON.stringify(gCheckDatetime);
}

