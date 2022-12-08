// import moment from "moment";
const moment = require("../lib/moment")

export const formatTime = function (time){
    const sendTime = moment.unix(time);
    const now = moment()
    const startDate = moment().startOf('day').unix();

    const diff = sendTime.diff(now, 'seconds')

    if (diff < 0 && time > startDate) {
        return sendTime.format('HH:mm')
    }

    if (diff < 0 && time < startDate && (startDate - time) < 86400) {
        return '昨天'
    }

    if (diff < 0 && time < startDate && (startDate - time) > 86400) {
        return sendTime.format('YYYY-MM-DD HH:mm')
    }

    if (diff >= 0) {
        return '刚刚'
    }
}
