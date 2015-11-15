export function concatAll(collection) {
    return collection
        .reduce((cur, acc) => acc.concat(cur));
}