export const vary = (val, [min, max]) => {
    return (val - min) / (max - min)
}

export const shuffle = (arr) => {
    for (let i = arr.length; i > 0; i--) {
        const pos = Math.floor(Math.random() * i)
        const temp = arr[pos]
        arr[pos] = arr[i - 1]
        arr[i - 1] = temp
    }
    return arr
}
