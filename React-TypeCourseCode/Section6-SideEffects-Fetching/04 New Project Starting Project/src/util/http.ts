export async function get(url: string){
    const response = await fetch(url);

    if(!response.ok){
        throw new Error('Failed to fetch data.');
    }

    // Success Response
    const data = response.json() as unknown;
    return data;
    

}