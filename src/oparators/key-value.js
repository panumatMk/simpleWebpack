import {filter, map} from "rxjs";

export function keyValue(config) {
    return (source) => {
        return source.pipe(
            filter((event) => event.code === config.key),
            map(() => {
                if(event.shiftKey){
                    return config.value * 10;
                }else if (event.altKey){
                    return config.value * 100;
                }
                return config.value;
            })
        )
    }
}