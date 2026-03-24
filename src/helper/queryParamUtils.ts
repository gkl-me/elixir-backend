import {ParsedQs} from 'qs'

export function extractStringQueryParams<T extends string>(
    query: Partial<Record<string,string | ParsedQs | (string | ParsedQs)[]>>,
    keys:T[]  
):Partial<Record<T,string>>|undefined{
    const result:Partial<Record<T,string>> = {}

    let hasValidParam = false;

    for(const key of keys){
        const value = query[key]

        if(typeof value==='string'){
            result[key] = value
            hasValidParam = true
        }else if(Array.isArray(value) && typeof value[0]==='string'){
            result[key] = value[0]
            hasValidParam = true
        }
    }

    return hasValidParam?result : undefined

}