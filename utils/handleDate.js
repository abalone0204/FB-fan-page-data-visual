export function getFormatedDate(date) {
    // "yyyy-mm-dd"
    var dateObject = new Date(date);
    var year = dateObject.getFullYear();
    var month = prependZero(dateObject.getMonth());
    var date = prependZero(dateObject.getDate());
    var result = `${year}-${month}-${date}`;
    return result
}

function prependZero(number) {
    if (number) {
        return number < 10 ? `0${number}` : number;
    }
}
