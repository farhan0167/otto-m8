
/**
 * Given an array of input objects, create an object where
 * each input name is a key, and the value is an empty string.
 * This is used to set the initial state of the input handles
 * which is also used as a payload the backend expects.
 *
 * @param {object[]} input - An array of input objects
 * @returns {object} A new object with input names as keys
 */
export const createInputPayload = (input) => {
    let payload = {}
    for (let i = 0; i < input.length; i++) {
        payload[input[i].name] = ''
    }
    return payload
}