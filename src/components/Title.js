import './App.css'
function Title({ handleMapTitleValueChange }) {
    const handleChange = (event) => {
        handleMapTitleValueChange(event.target.value)
    }
    
    return(
        <div>
            <input
                placeholder="Map's title"
                className='map-title'
                onChange={handleChange}
                maxLength='30'
                type='text'
            ></input>
        </div>
    )
}
export default Title