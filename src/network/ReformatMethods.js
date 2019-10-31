/**
 * Verander elk eerste letter naar een hoofdletter
 * @param text
 * @returns {string}
 */
export function firstLetterCapital(text) {
    return text.toLowerCase()
        .split(' ')
        .map(s => {
            if (!s.startsWith("ij")) {
                return s.charAt(0).toUpperCase() + s.substring(1)
            } else {
                return s.charAt(0).toUpperCase() + s.charAt(1).toUpperCase() + s.substring(2)
            }
        })
        .join(' ');
}

/**
 * Haalt alles voor de # weg
 * @param url
 * @returns {*|void|string}
 */
export function stripUrlToType(url) {
    return url.replace(/.*#/, "");
}

/**
 * Seperate de string gebasseerd op uppercase.
 * @param string
 * @returns {string}
 */
export function seperateUpperCase(string) {
    string = string.split(/(?=[A-Z])/);
    string.forEach((res, index, arr) => {

            if (index !== 0) {
                arr[index] = arr[index].charAt(0).toLowerCase() + arr[index].slice(1)
            }
        }
    )

    return string.join(" ");
}

/**
 * Verandert een 1 en 0 naar ja en nee.
 * @param string
 * @returns {string}
 */
export function veranderNaarJaNee(string) {
    if (string === "1") {
        return "ja";
    }
    return "nee";
}

