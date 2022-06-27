const countriesList = document.getElementById("nations")

let countries;




fetch("https://restcountries.com/v2/all")
    .then(res => res.json())
    .then(data => initialize(data))
    .catch(err => console.log("Error", err))

function initialize(countriesData) {
    countries = countriesData;
    let options = "";
    for(let i=0; i<countries.length; i++){
        
        options+= ` <option value="${countries[i].alpha2Code}">${countries[i].name}(${countries[i].alpha2Code})</option>`
      
    }

countriesList.innerHTML = options;



}

function displayCountryInfo(countryByCode){
    const countryData = countries.find(countries => countries.alpha2Code === countryByCode);
    console.log(countryData)
    document.getElementById("cap").innerHTML = countryData.capital;
    document.getElementById("dia").innerHTML = countryData.callingCodes[0];
    document.getElementById("pop").innerHTML = countryData.population.toLocaleString("en-US");
    document.getElementById("cu").innerHTML = countryData.currencies[0].name + " " +countryData.currencies[0].symbol;
    document.getElementById("reg").innerHTML = countryData.region;
    document.getElementById("sub").innerHTML = countryData.subregion;
    document.querySelector("#innerFlag img").src = countryData.flags.png;
    document.querySelector("#innerFlag img").alt = `Flag of${countryData.name}`;
}

countriesList.addEventListener("change", function(event){
    
    displayCountryInfo(event.target.value);
})

function myFunction(){
    alert("Oops, seems like you messed up.")
}

// setTimeout(() => {
//     console.log(countries)
// },2000);

// fetch("https://restcountries.com/v3.1/all")
// .then(function(res){
//     // console.log(res)
//   return res.json();
// })
// .then(function(data){
//     // console.log(data);
//     initialize(data)
// })
// .catch(function(err){
//     console.log("Error:" + err)
// })

