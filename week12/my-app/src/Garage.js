function Car(props){
    return(
        <h2>I am a {props.brand}!</h2>
    );
}
function Car2(props){
    return(
        <h2>I am a {props.brand.model}!</h2>
    );
}
function Car3(props){
    return(
        <li>I am a {props.brand}!!</li>
    );
}

function Garage(props){
    let carInfo ={name : "FORD", model : "MUSTANG"};
    let carName = "Ford2";
    let array_car = [
        { id : 1, brand : "Ford!!"}
        ,{ id : 2, brand : "Audi!1"}
        ,{ id : 3, brand : "M~!!"}
    ];
   
    return(
        <div>
            <h1>WHo lives in my GARAGE?</h1>
            <Car brand="Ford1"/>
            <Car brand={carName} />
            <Car2 brand={carInfo} />
            <ol>
                {array_car.map((car) => <Car3 key={car.id} brand={car.brand} />)}
            </ol>
        </div>
    );
}

export default Garage;