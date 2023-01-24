import "./WorldStates"
import "./Countries"
import "./Inputs"



function ColorFunctions() {
    var countries = document.getElementsByClassName('country')
    
  
     
    var selectedColor = document.getElementById('selectColors')

   
    for (var i = 0; i < countries.length; i++) {
        
       
            console.log(countries[i].checked)
        
     }

        // if(is.checked == true) {
        //      document.getElementById('is').style.fill= selectedColor.innerText
        // } else {
        //     document.getElementById('is').style.fill='#c0c0c0'

        // }
        //     if(at.checked == true) {
        //         document.getElementById('at').style.fill=selectedColor.value
                
        //     } else {
        //         document.getElementById('at').style.fill='#c0c0c0'

        //     }
        
        
     
    
}



export default ColorFunctions