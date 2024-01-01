export const request = async (url: string, token: string, userHeaders: any = {}, method: string = "get", body: any = {}) => {
    const data: any = {
        method,
        headers: {
            Authorization: `Bearer ${token}`,
            ...userHeaders
        }
    }

    if (method.toLowerCase() == "post") {
        data.body = body
    }

    const response = await fetch(url, data)
    const ok = response.ok

    const json = await response.json()
    return { ok, data: json.data }
}