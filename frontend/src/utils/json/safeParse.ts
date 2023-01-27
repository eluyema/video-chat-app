const safeParse = (rawText: string): { displayName?: string } => {
    try{
        const obj = JSON.parse(rawText);
        return obj;
    } catch (e) {
        return {};
    }
}

export {safeParse};
