import "./components/WorldStates"
import "./components/Countries"
import "./components/Legend-1"
import './components/Legend-2'
import './components/Navigator'




function ColorFunctions() {
    

     
        
    
    
    for (var i = 0; i < countries.length; i++) {
        
      var countries = document.getElementsByClassName('country')

        var uncheckedValue = countries[i].checked === false
     
       
         for (var i = 0; i < legend1CountryValue.length; i++) {
             document.getElementById(legend1CountryValue[i]).style.fill = colorValue
         }
             var countries = document.querySelectorAll('.country')
     
             for (var i = 0; i < countries.length; i++) {
     
                 if (countries[i].checked == false) {
                     document.getElementById(countries[i].value).style.fill = '#c0c0c0'
             }
           
            }
          

  

        } if (countries[i].checked == false) {
                uncheckedValue =countries[i].value
                document.getElementById(uncheckedValue).style.fill = '#c0c0c0'
        }

        
     }


    
   


export default ColorFunctions