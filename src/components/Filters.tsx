import {
    Button,

} from "@mui/material";
import {useState} from "react";

const Filters = () => {
    const [value, setValue] = useState<string>('Категория')
    let locationOptions: Map<string, any> = new Map([
        ['ключ1', new Map<string, string>([['ключ11', 'значение11'], ['ключ12', 'значение12']])],
        ['ключ2', 'значение2'],
        ['ключ3', 'значение3']
    ])
    const e = (k: string) => {
        const c = locationOptions.get(k)
        let f: any = []
        if (typeof c === 'string') {
            f.push(<option key={c}>{c}</option>)
        } else {
            for (const kElement of c) {
                f.push(<option key={kElement[0]}>{kElement[0]}</option>)
            }
        }
        return f
    }
    const d = () => Array.from(locationOptions.keys()).map(k => (
        <optgroup label={k} key={k}>
            {e(k)}
        </optgroup>
    ))
    return (
        <div className="flex mb-10 bg-[#00AAFF]">
            <select className="w-96" value={value} onChange={(e) => setValue(e.currentTarget.value)}>
                <option disabled>Категория</option>
                {d()}
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