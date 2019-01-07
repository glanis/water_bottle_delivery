var monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN",
    "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
];

function getFormattedDate() {

    var todayTime = new Date();

    var month = (todayTime.getMonth());

    var day = (todayTime.getDate());

    var year = (todayTime.getFullYear());

    return day + "-" + monthNames[month] + "," + year;

}
module.exports = {getFormattedDate}