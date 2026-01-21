export const get3AMExpiry= ()=>{
    const tomorrow3AM = new Date();
    tomorrow3AM.setUTCDate(tomorrow3AM.getUTCDate() + 1);
    tomorrow3AM.setUTCHours(21, 30, 0, 0); // UTC 21:30 = IST 3:00 AM
    return Math.floor(tomorrow3AM.getTime() / 1000);
}

export const today = new Date().toISOString().split('T')[0];