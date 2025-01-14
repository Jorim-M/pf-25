function updateClock() {
    const now = new Date();

    // Set the desired time zone (e.g., America/New_York)
    const options = { 
        timeZone: 'Europe/Stockholm', 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        hour12: false // Set to true for 12-hour format
    };

    const formatter = new Intl.DateTimeFormat('en-US', options);
    const timeString = formatter.format(now);

    document.getElementById('clock').textContent = timeString;
}

// Update the clock every second
setInterval(updateClock, 1000);

// Initialize the clock
updateClock();
