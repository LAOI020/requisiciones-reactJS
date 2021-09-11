
const baseUrl = process.env.REACT_APP_API_URL;


const helperFetch = (endPoint, data, method) => {
    const url = `${baseUrl}/${endPoint}`;

    return fetch(url, {
        method,
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify(data)
    });
}


export {
    helperFetch
}