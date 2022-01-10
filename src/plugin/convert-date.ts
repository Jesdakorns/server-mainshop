export const ConvertDate = (date: Date = new Date(), format: string = 'full', lang: string = 'en', type: string = 'full') => {
    // type short || full
    // lang th || en
    // format time_passed || full || date || time

    let res

    let thDayShort = ["	อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"]
    let thDayFull = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัส", "ศุกร์", "เสาร์"]
    let thMonthShort = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."]
    let thMonthFull = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"]

    let enDayShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    let enMonthShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    let enDayFull = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    let enMonthFull = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

    let getYear = (lang == 'th' ? date.getFullYear() + 543 : date.getFullYear())
    let getDate = date.getDate()
    let getMonth = date.getMonth()
    let getDay = date.getDay()
    let getHour = date.getHours()
    let getMinute = date.getMinutes()
    let getMillisecond = date.getMilliseconds()

    if (format == 'time_passed') {
        var date1 = new Date(date);
        var date2 = new Date();
        var diff = new Date(date2.getTime() - date1.getTime());

        let year = diff.getUTCFullYear() - 1970;
        let month = diff.getUTCMonth();
        let day = diff.getUTCDate() - 1;
        let week = day / 7;

        let hour = diff.getUTCHours();
        let minute = diff.getUTCMinutes();
        let second = diff.getUTCSeconds();

        if (year !== 0) {
            return (lang == 'th' ? `${year} ปีที่แล้ว` : `${year} years ago`);
        } else if (month !== 0) {
            return (lang == 'th' ? month + ` เดือนที่แล้ว` : `${month} month ago`);
        } else if (week >= 1) {
            return (lang == 'th' ? `${week.toFixed(0)} สัปดาห์ที่แล้ว` : `${week.toFixed(0)} week ago`);
        } else if (day > 1) {
            return (lang == 'th' ? `${day} วันที่แล้ว` : `${day} days ago`);
        } else if (day !== 0) {
            return (lang == 'th' ? `เมื่อวานนี้` : `Yesterday`);
        } else if (hour > 1 && hour <= 24) {
            return (lang == 'th' ? `${hour} ชั่วโมงที่แล้ว` : `${hour} hours ago`);
        } else if (hour !== 0) {
            return (lang == 'th' ? `ชั่วโมงที่แล้ว` : `hour ago`);
        } else if (minute > 1) {
            return (lang == 'th' ? `${minute} นาทีที่แล้ว` : `${minute} minutes ago`);
        } else if (minute === 1) {
            return (lang == 'th' ? `นาทีที่แล้ว` : `minute ago`);
        } else if (second !== 0) {
            return `เมื่อครู่นี้`;
        }

    }

    if (format == 'full' || format == '') {
        if (type == 'full' || type == '') {
            console.log(`full`)
            if (lang == 'en' || lang == '') {
                return `${enDayFull[getDay]} ${getDate} ${enMonthFull[getMonth]} ${getYear}`
            } else if (lang == 'th') {
                return `วัน${thDayFull[getDay]}ที่ ${getDate} ${thMonthFull[getMonth]} ${getYear}`
            }

        }

        if (type == 'short') {
            console.log(`short`)
            let date
            let day
            let month
            let year
            if (lang == 'en' || lang == '') {
                return `${enDayShort[getDay]} ${getDate} ${enMonthShort[getMonth]} ${getYear}`
            } else if (lang == 'th') {
                return `${thDayShort[getDay]} ${getDate} ${thMonthShort[getMonth]} ${getYear}`
            }
        }
    }


    if (format == 'time') {
        console.log(`time`)
        if (type == 'full' || type == '') {
            return (lang == 'th' ? `${getHour}ชั่วโมง ${getMinute}นาที ${getMillisecond}วินาที` : `${getHour}hours ${getMinute}minutes ${getMillisecond}seconds`);
        } else if (type == 'short') {
            return (lang == 'th' ? `${getHour}ชม. ${getMinute}น. ${getMillisecond}ว.` : `${getHour}h ${getMinute}m ${getMillisecond}s`);
        }
    }

    return res
}
