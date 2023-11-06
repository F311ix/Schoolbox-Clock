const collum = document.querySelector(".small-12.large-4.columns");



function getPeriodLength(periodTime) {
    const startTimeStr = periodTime.split("–")[0];
    const endTimeStr = periodTime.split("–")[1];

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

    const targetTime = new Date();
    const [hour, minute] = timeLeft.match(/\d+/g).map(Number);
    const isPM = timeLeft.toLowerCase().includes("pm");
    targetTime.setHours(isPM ? hour + 12 : hour);
    targetTime.setMinutes(minute);
    targetTime.setSeconds(0);

    const currentTime = new Date();
    const timeDifference = targetTime - currentTime;

    if (timeDifference > 0) {
        const minutesRemaining = Math.floor((timeDifference % (60 * 60 * 1000)) / (60 * 1000));
        const secondsRemaining = Math.floor((timeDifference % (60 * 1000)) / 1000);

        const timeRemainingText = minutesRemaining + " minutes, " + secondsRemaining + " seconds";

        return timeRemainingText;
    } else {
        return "Class finished";
    }

}


if (window.location.pathname === "/" && collum) {
    const container = document.createElement("div");

    let totalTime;

    let period;
    let periodTime;

    let progress;
    let periodElement;
    let timetableElements;


    function createClock() {
        // Create frame title
        const h2 = document.createElement("h2");
        h2.classList.add("subheader");
        h2.appendChild(document.createTextNode("Clock"));

        // Create frame
        const frame = document.createElement("iframe");
        frame.src = "about:blank";
        frame.width = "100%";
        frame.height = "264";

        // Add frame to page
        container.appendChild(h2);
        container.appendChild(frame);
        collum.insertBefore(container, collum.childNodes[0]);

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
            font-weight: bold;
            color: #303030;
        }

        h2 {
            font-family: Roboto, sans-serif;
            font-size: 20px;
            font-weight: bold;
            color: #303030;
        }

        body {
            font-family: Roboto, sans-serif;
            font-size: 20px;
            font-weight: normal;
            color: #303030;
        }
    `;

        iframeDocument.head.appendChild(style);

        // Header
        const header = iframeDocument.createElement("h1");
        header.innerHTML = "Schoolbox Clock";
        iframeDocument.body.appendChild(header);

        // Add periods
        periodElement = iframeDocument.createElement("h2");
        iframeDocument.body.appendChild(periodElement);

        periodInfoElement = iframeDocument.createElement("p");
        iframeDocument.body.appendChild(periodInfoElement);

        // Add progress bar
        const progressBar = iframeDocument.createElement('div');
        progressBar.style.width = '100%';
        progressBar.style.height = '25px';
        progressBar.style.border = '3px solid #303030'; // 'solid' is the border style, 'black' is the border color
        progressBar.style.borderRadius = '5px';
        iframeDocument.body.appendChild(progressBar);

        progress = iframeDocument.createElement('div');
        progress.style.width = '0%';
        progress.style.height = '100%';
        progress.style.backgroundColor = '#353535';
        progressBar.appendChild(progress);
    }

    function updateClock() {
        timetableElements = document.getElementsByClassName("timetable-subject-active");

        if (timetableElements.length > 0) {
            let peroidInfoText;
            if (timetableElements.length > 2) {
                peroidInfoText = document.getElementsByClassName("timetable-period-active")[1].innerText;
                period = timetableElements[1].innerText.split("\n")[0];
            }
            else {
                    peroidInfoText = document.getElementsByClassName("timetable-period-active")[0].innerText;
                    period = timetableElements[0].innerText.split("\n")[0];
            }

            periodNumber = peroidInfoText.split("\n")[0];
            periodTime = peroidInfoText.split("\n")[1];

            totalTime = getPeriodLength(periodTime);
            const timeLeft = getTimeToEnd(periodTime.split("–")[1]);
            const timeLeftPer = ((Number(timeLeft.split(" minutes")[0])/totalTime)-1)*-100;

            progress.style.width = timeLeftPer+'%';

            periodElement.innerHTML = period;
            periodInfoElement.innerHTML = '<b>' + periodNumber + '</b> (' + periodTime + ')' + ' will end in, <br> <b>' + timeLeft + '</b>';
        } else if (timetableElements.length === 0) {
            const simpleTime = new Date().toLocaleString('en-NZ', {
                day: '2-digit',
                month: '2-digit',
                year: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
            });

            periodElement.innerHTML = 'No Classes';
            periodInfoElement.style.fontSize = '20px'; 
            periodInfoElement.innerHTML = simpleTime;
        }
    }

    createClock();
    setInterval(updateClock, 1000);
}
