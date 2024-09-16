import React,{useState} from "react"
import Popup from "./popup.jsx"
import "./clabs.css"
import axios from "axios"
export default function Clabs(){
    const schemaOption = [
        {id:1, label : "First Name", Value : "first_name"},
        {id:2, label : "Last Name", Value : "last_name"},
        {id:3, label : "Gender", Value : "gender"},
        {id:4, label : "Age", Value : "age"},
        {id:5, label : "Account Name", Value : "account_name"},
        {id:6, label : "City", Value : "city"},
        {id:7, label : "State", Value : "state"}
    ]
    const [schema, setSchema] = useState([]);
    const [selectSchema, setSelectSchema] = useState(schemaOption);
    const [segmentName, setSegmentName] = useState("");
    const [toggle, setToggle] = useState(true);
    console.log(schema);
    console.log(selectSchema);

    const handleSelect = () =>{
        const selectedElement = document.getElementById("select");
        const selectedValue = selectedElement.value;
        console.log(!schema.includes(selectedValue));
        console.log(selectedValue);
        if(selectedValue && !schema.includes(selectedValue)){
            const newSchema = schemaOption.find((e)=>e.label === selectedValue);
            setSchema(prev => [...prev, newSchema].sort((a,b)=> {return a.id-b.id} ));

            setSelectSchema(selectSchema.filter((s)=> s.label !== selectedValue));
            selectedElement.value = "";

        }
    }

    const handleSelectedSchema = (e,index,preValue) =>{
        const newSchema = e.target.value;
        const newSchemaValue = schemaOption.find((v)=> v.label === newSchema);
        console.log(newSchemaValue);
         setSchema(prev => {
             const updatedSchema = [...prev];
             updatedSchema[index] = newSchemaValue;
             return updatedSchema;
         })
        // const newIndex = selectSchema.findIndex(i => i.label === newSchema)
        // selectSchema[newIndex] = preValue;

        setSelectSchema(prevSelectSchema => {
            const updatedSelectSchema = [...prevSelectSchema];
            const existingIndex = updatedSelectSchema.findIndex(i => i.label === newSchema);
            if (existingIndex !== -1) {
                updatedSelectSchema[existingIndex] = preValue;
            }
            return updatedSelectSchema.sort((a, b) => a.id - b.id);
        });

    }
   
    const handleRemove  = (remove) =>{
        setSchema(schema.filter(s => s.label !== remove.label))
        setSelectSchema([...selectSchema,remove].sort((a,b)=> {return a.id-b.id} ));
    }

    const handleSubmit = async() =>{
        const formatedSchema = schema.map((s)=> ({[s.Value] : s.label}));
        
        const segment = {
            segment_name : segmentName,
            schema : formatedSchema
        }
        console.log(JSON.stringify(segment,null,2))
        try{
            const res = await axios.post("https://webhook.site/8af36df4-ad2a-4831-8fc1-48f9c1481497/",segment, {headers:{ 'Content-Type': 'application/json'}})
            console.log(res);
        }
        catch(err){
            console.log(err.message);
        }
        setSegmentName("");
        setSchema([]);
        setSelectSchema(schemaOption);

        

    }
    return(
        <div class="clabs-container">
            <button className="open" onClick={()=>setToggle(!toggle)}>Save Segment</button>
            <Popup toggle={toggle} setToggle={setToggle} opened={true}>
                <div className='s-name'>
                    <label>Enter the Name of the Segment</label>
                    <input type="text" value = {segmentName} placeholder='Name of the segment' onChange={e=>setSegmentName(e.target.value)}/>
                </div>
                <p className="p-text">To save your segment, you need to add the schemas to build the query</p>
                <div className="popup-mid">
                    {schema.length > 0 ? (schema.map((sch,index) => (
                        <div key={index}>
                            <select className="s-select" value={sch.label} onChange={(e)=>handleSelectedSchema(e,index,sch)}>
                                    <option value="">Select Segment</option>
                                    <option value={sch.label}>{sch.label}</option>
                                    {selectSchema.map((ss,index)=>
                                        (<option key={index} value={ss.label} >{ss.label}</option>)
                                    )}
                            
                            </select>
                            <span className="s-remove"><button onClick={()=>handleRemove(sch)}>--</button></span>
                       </div>
                    ))):null}
                </div>
                <select id="select">
                    <option>Add Segment</option>
                    {selectSchema.map((s,index)=>
                        (<option key={index} value={s.value}>{s.label}</option>)
                    )}
                </select>
                
                <a onClick={handleSelect}>+ Add new schema</a>

                <button className="save" onClick={handleSubmit}>Save the Segment</button>
            </Popup>
        </div>
    )
}