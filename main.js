const column = document.querySelector(".small-12.large-4.columns");


function getPeriodLength(periodTime) {
    const [startTimeStr, endTimeStr] = periodTime.split("–");

    const parseTime = (timeStr) => {
        const [hours, minutes] = timeStr.match(/\d+/g).map(Number);
        const isPM = timeStr.toLowerCase().includes("pm");

        const date = new Date();
        date.setHours(isPM ? hours + 12 : hours);
        date.setMinutes(minutes);
        date.setSeconds(0);

        return date;
    };

    const startTime = parseTime(startTimeStr);
    const timeLeft = parseTime(endTimeStr);

    const timeDifference = timeLeft - startTime;

    return Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
}


function getTimeToEnd(timeLeft) {
    const [hour, minute] = timeLeft.match(/\d+/g).map(Number);
    const isPM = timeLeft.toLowerCase().includes("pm");

    const targetTime = new Date();
    targetTime.setHours(isPM ? hour + 12 : hour);
    targetTime.setMinutes(minute);
    targetTime.setSeconds(0);

    const currentTime = new Date();
    const timeDifference = targetTime - currentTime;

    if (timeDifference > 0) {
        const minutesRemaining = Math.floor((timeDifference % (60 * 60 * 1000)) / (60 * 1000));
        const secondsRemaining = Math.floor((timeDifference % (60 * 1000)) / 1000);

        if (minutesRemaining === 1 && secondsRemaining === 1) {
            return `${minutesRemaining} minute, ${secondsRemaining} second`;
        } else if (minutesRemaining === 1) {
            return `${minutesRemaining} minute, ${secondsRemaining} seconds`;
        } else if (secondsRemaining === 1) {
            return `${minutesRemaining} minutes, ${secondsRemaining} second`;
        }

        return `${minutesRemaining} minutes, ${secondsRemaining} seconds`;
    } else {
        return "Class finished";
    }
}


if (window.location.pathname === "/" && column) {
    const container = document.createElement("div");

    let period;
    let periodTime;
    let progress;
    let periodTextElement;
    let periodInfoElement;
    let periodElement;
    let timetableElements;

    function createClock() {
        // Create frame title
        const h2 = document.createElement("h2");
        h2.classList.add("subheader");
        h2.textContent = "Clock";

        // Create frame
        const frame = document.createElement("iframe");
        frame.src = "about:blank";
        frame.width = "100%";
        frame.height = "264";

        // Add frame to page
        container.appendChild(h2);
        container.appendChild(frame);
        column.insertBefore(container, column.firstChild);

        // Access document
        const iframeDocument = frame.contentDocument || frame.contentWindow.document;
        iframeDocument.body.style.backgroundColor = "#fff";
        iframeDocument.body.style.padding = "12px";

        // Add CSS to style the text
        const style = iframeDocument.createElement("style");
        style.innerHTML = `
            h1 {
                font-family: Roboto, sans-serif;
                font-size: 32px;
                color: #303030;
            }

            h2, body {
                font-family: Roboto, sans-serif;
                font-size: 20px;
                color: #303030;
            }

            h3 {
                font-family: Roboto, sans-serif;
                font-size: 10px;
                color: #909090;
                font-weight: normal;
            }
        `;

        iframeDocument.head.appendChild(style);

        // Header
        const header = iframeDocument.createElement("h1");
        header.textContent = "Schoolbox Clock";
        iframeDocument.body.appendChild(header);

        // Add periods
        periodTextElement = iframeDocument.createElement("h2");
        iframeDocument.body.appendChild(periodTextElement);

        periodInfoElement = iframeDocument.createElement("p");
        periodInfoElement.style.width = '90%';
        iframeDocument.body.appendChild(periodInfoElement);

        // Add progress bar element
        const progressBar = iframeDocument.createElement('div');
        progressBar.style.width = '100%';
        progressBar.style.height = '25px';
        progressBar.style.border = '3px solid #303030';
        progressBar.style.borderRadius = '5px';
        progressBar.style.backgroundColor = '#d9d9d9';
        iframeDocument.body.appendChild(progressBar);

        // Add progrees bar
        progress = iframeDocument.createElement('div');
        progress.style.width = '0%';
        progress.style.height = '100%';
        progress.style.backgroundColor = '#353535';
        progressBar.appendChild(progress);

        // Add credits
        creditElement = iframeDocument.createElement("h3");
        creditElement.innerHTML = "Made by Felix S";
        iframeDocument.body.appendChild(creditElement);
    }


    function updateClock() {
        timetableElements = document.getElementsByClassName("timetable-subject-active");
        periodElement = document.getElementsByClassName("timetable-period-active");

        if (timetableElements.length > 0) {
            let periodInfoText;
            if (timetableElements.length > 2) {
                periodInfoText = periodElement[1].innerText;
                period = timetableElements[1].innerText.split("\n")[0];
            } else {
                periodInfoText = periodElement[0].innerText;
                period = timetableElements[0].innerText.split("\n")[0];
            }

            const periodNumber = periodInfoText.split("\n")[0];
            periodTime = periodInfoText.split("\n")[1];

            const timeLeft = getTimeToEnd(periodTime.split("–")[1]);
            console.log(timeLeft);
            const timeLeftPer = ((Number(timeLeft.split(" minutes")[0]) / getPeriodLength(periodTime)) - 1) * -100;

            progress.style.width = timeLeftPer + '%';

            periodTextElement.textContent = period;
            periodInfoElement.innerHTML = `<b>${periodNumber}</b> (${periodTime}) will end in, <b>${timeLeft}</b>`;
        } else if (timetableElements.length === 0) {
            const simpleTime = new Date().toLocaleString('en-NZ', {
                day: '2-digit',
                month: '2-digit',
                year: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
            });

            periodTextElement.textContent = 'No Classes';
            periodInfoElement.style.fontSize = '20px';
            periodInfoElement.innerHTML = simpleTime;

            progress.style.width = '0px';
        }
    }


    createClock();
    setInterval(updateClock, 1000);
}
