const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// "Oct 12"
export const shortDate = (d: Date) => `${MONTHS[d.getMonth()]} ${d.getDate()}`;

// "Oct 12, 2026"
export const longDate = (d: Date) => `${shortDate(d)}, ${d.getFullYear()}`;
