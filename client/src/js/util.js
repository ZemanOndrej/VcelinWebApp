/**
 * Created by zeman on 13-May-17.
 */
export function removeDuplicates(data) {
    return data.reduce((accumulator, current) => {
        if (accumulator.some((item) => {
                return (item.ID === current.ID);
            })) {
            return accumulator;
        } else {
            return [...accumulator, current];
        }
    }, []);
}

export function formatTimeSince(time) {
    let date = new Date(time);
    let hrs = Math.floor((Date.now() - date) / 36e5);
    let mins = Math.floor((Date.now() - date) / 6e4);
    let days = Math.floor((Date.now() - date) / 864e5);
    let secs = Math.floor((Date.now() - date) / 1000);

    let timeText = "";
    if (mins === 0) {
        timeText = secs + " seconds"

    } else if (mins < 60) {
        timeText = mins + " minutes"
    } else if (hrs !== 0) {
        timeText = hrs + " hours"

    } else if (days !== 0) {
        timeText = days + " days"
    }
    return timeText
}