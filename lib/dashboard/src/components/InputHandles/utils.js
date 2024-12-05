

/**
 * Helper function that goes over the input blocks
 * and separates them based on their input type. This
 * will help in rendering the input handles properly.
 */
export const prepareInputBlock = (input) => {
    let user_input = []
    let uploads = []
    let urls = []

    for (let i = 0; i < input.length; i++) {
        if (input[i].input_type === "text"){
            user_input.push(input[i])
        }
        else if (input[i].input_type === "file"){
            uploads.push(input[i])
        }
        else if (input[i].input_type === "url"){
            urls.push(input[i])
        }
    }

    return {user_input, uploads, urls}
}