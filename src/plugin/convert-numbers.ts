export const ConvertNumbers = async (number: number, type: string) => {
    let val_number;
    let val_type;
    let val_length = number.toString().split('').length;
    let res;
    console.log(`val_length`, val_length)
    if (val_length < 4) {
        res = await `${number}`
    } else if (val_length >= 4 && val_length <= 6) {
        val_number = number.toString().slice(0, -3)
        val_type = (type == 'th' ? 'พัน' : 'K')
        res = await `${val_number}${val_type}`
    } else if (val_length >= 7 && val_length <= 9) {
        val_number = number.toString().slice(0, -6)
        val_type = (type == 'th' ? 'ล้าน' : 'M')
        res = await `${val_number}${val_type}`
    } else if (val_length >= 10 && val_length <= 12) {
        val_number = number.toString().slice(0, -9)
        val_type = (type == 'th' ? 'พันล้าน' : 'B')
        res = await `${val_number}${val_type}`
    } else if (val_length >= 13 && val_length <= 15) {
        val_number = number.toString().slice(0, -12)
        val_type = (type == 'th' ? 'ล้านล้าน' : 'T')
        res = await `${val_number}${val_type}`
    } else if (val_length >= 16) {
        val_number = number.toString().slice(0, -15)
        val_type = (type == 'th' ? 'ล้านล้านล้าน' : 'Q')
        res = await `${val_number}${val_type}`
    }
    return res;
}