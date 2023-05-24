import '../../App.css'


function CountryList({ 
  countries,
  handleChange,
  selectedOption,
  group,
  group1CountryValue,
  group2CountryValue,
  group3CountryValue,
  group4CountryValue,
  group5CountryValue,
  group6CountryValue,
  group7CountryValue,
  group8CountryValue,
}) {
  return (
    <ul>
      {countries.map((country) => (
        <li key={country.code}>
          <input 
            type="checkbox" 
            value={country.code}
            onChange={handleChange}
            className='country'
            checked={
              group === 1 ? group1CountryValue.includes(country.code) : 
              group === 2 ? group2CountryValue.includes(country.code) : 
              group === 3 ? group3CountryValue.includes(country.code) : 
              group === 4 ? group4CountryValue.includes(country.code) :
              group === 5 ? group5CountryValue.includes(country.code) :
              group === 6 ? group6CountryValue.includes(country.code) :
              group === 7 ? group7CountryValue.includes(country.code) :
              group8CountryValue.includes(country.code)    
          }                            
          disabled={
          selectedOption.includes(country.code) &&
          ((group !== 1 && group1CountryValue.includes(country.code)) ||
          (group !== 2 && group2CountryValue.includes(country.code)) ||
          (group !== 3 && group3CountryValue.includes(country.code)) ||
          (group !== 4 && group4CountryValue.includes(country.code)) ||
          (group !== 5 && group5CountryValue.includes(country.code)) ||
          (group !== 6 && group6CountryValue.includes(country.code)) ||
          (group !== 7 && group7CountryValue.includes(country.code)) ||
          (group !== 8 && group8CountryValue.includes(country.code)))
        }

            />
          <label>{country.name}</label>
        </li>
      ))}
    </ul>
  );
}

export default CountryList;