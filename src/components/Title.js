import './App.css'
function Title({ handleMapTitleValueChange }) {
    const handleChange = (event) => {
        handleMapTitleValueChange(event.target.value)
    }
    
    return(
        <div>
            <input
                placeholder="Your map title here"
                className='map-title'
                onChange={handleChange}
                maxLength='33'
                type='text'
            ></input>
        </div>
    )
}
export default Title