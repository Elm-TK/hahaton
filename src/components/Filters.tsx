import {
    Button,

} from "@mui/material";
import {useState} from "react";

const Filters = () => {
    const [value, setValue] = useState<string>("Категория")

    let locationOptions: Map<string, any> = new Map([
        ['ключ1', new Map<string, any>([['ключ11', new Map<string, any>([['ключ111', 'значение111'], ['ключ112', 'значение112']])], ['ключ12', 'значение12']])],
        ['ключ2', 'значение2'],
        ['ключ3', 'значение3']
    ])

    const [currMap, setCurrMap] = useState<Map>(locationOptions)


    const e = (k: string) => {
        const c = currMap.get(k)
        let f: any = []
        if (typeof c === 'string') {
            f.push(<option value={k}  key={c}>{c}</option>)
        } else {
            for (const kElement of c) {
                f.push(<option value={k} key={kElement[0]}>{kElement[0]}</option>)
            }
        }
        return f
    }

    const changeLocation = (e) => {
        setValue(e.target.value)
        setCurrMap(currMap.get(e.target.value))

    }

    const d = (a) => Array.from(a.keys()).map(k => (
        <optgroup label={k} key={k}>
            {e(k)}
        </optgroup>
    ))
    return (
        <div className="flex mb-10 bg-[#00AAFF]">
            <select className="w-96" value={value} onChange={(e) => changeLocation(e)}>

                <option disabled>Категория</option>
                <option>{value}</option>
                {d(currMap)}
            </select>
            <Button variant="contained"
                    style={{
                        backgroundColor: "#00AAFF",
                        color: "#000000",
                        // padding: "18px 36px"
                    }}
            >Найти</Button>
        </div>
    );
};

export default Filters;