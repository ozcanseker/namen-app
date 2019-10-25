let st = "AaaaaAaaa";
seperateUpperCase(st);
console.log();

function seperateUpperCase(string) {
    string = string.split(/(?=[A-Z])/);
    string.forEach((res, index, arr) => {

        if (index !== 0) {
                arr[index] = arr[index].charAt(0).toLowerCase() + arr[index].slice(1)
            }
        }
    )

    string = string.join(" ");
    console.log(string);
}