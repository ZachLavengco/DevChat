import { doc, setDoc, updateDoc, arrayUnion, arrayRemove, addDoc, collection, getCountFromServer, Timestamp} from "firebase/firestore"; 
import { getFirestore } from "firebase/firestore";
import {app, auth} from "../firebase"
import Pokedex from 'pokedex-promise-v2';

// expected behavior:
//     The send command will construct a Message (see interfaces/message.ts) and update
//     the db with a new document for that message. 
// */

// export default interface Message {
//     id: number,
//     user: string,
//     message: string,  
// }

export async function send (args: string[], incomingChat) {

    // An example of send command for now is send saurav | this is some message!
    // Works for send saurav|this is some message! as well! Done randomly, may lack coverage.
    
    let joinedIncomingCommand = args.join(" ")
    const chatID = incomingChat[1];
    // let indexofDelimiter = joinedIncomingCommand.indexOf("|")
    // let receivingEntity = joinedIncomingCommand.substring(0, indexofDelimiter).trim()
    let message = joinedIncomingCommand
    
    let sendingEntity = auth.currentUser.displayName;
    // Adding document below
    const incomingData = [sendingEntity, message]
    const db = getFirestore(app);

    // 3rd party APIs
    const P = new Pokedex();

    let data = {"sender": sendingEntity, "message": message, "timestamp" : Timestamp.now()};
    try{
        const countDocs = await getCountFromServer(collection(db, "groupchat"));

        // if user is using pokeapi
        if (args[0] == "pokemon") {
            let response = null;
            try {
                response = await P.getPokemonByName(args[1])
            }
            catch(err) {
                return `Pokemon ${args[1]} does not exist.`
            }
            let pokemonData = "PokemonInfo\n\tname: " + response["name"] + "\n\tid: " + response["id"] + "\n\theight: " + response["height"] + "\n\tweight: " + response["weight"] + "\n\tprimary type " + response["types"][0]["type"]["name"]
                    if (response["types"].length > 1) {
                        pokemonData += "\n\tsecondary type: " + response["types"][1]["type"]["name"]
                    } else {
                        pokemonData += "\n\tsecondary type: none"
                    }

            data['message'] = pokemonData;
        }

        // if user is using weather api
        if (args[0] == "weather") {
            let weatherLocation = args[1]
            let apiCall = 'https://api.weatherapi.com/v1/current.json?key='+process.env.NEXT_PUBLIC_WEATHER_APIKEY+'&q='+weatherLocation+'&aqi=no'
            data["message"] = await fetch(apiCall)
                .then(response => response.json())
                    .then(weatherInfo => {
                        let weatherData = "WeatherInfo\n\tlocation: " + weatherInfo["location"]["name"] + ", " + weatherInfo["location"]["region"] + "\n\tcondition: " + weatherInfo["current"]["condition"]["text"] + "\n\ttemp(F): " + weatherInfo["current"]["temp_f"] + "\n\twind(mph): " + weatherInfo["current"]["wind_mph"] + "\n\tprecipitation(in): " + weatherInfo["current"]["precip_in"] + "\n\thumidity: " + weatherInfo["current"]["humidity"]
                        
                        //console.log(data["message"])
                        return weatherData
                    })
                    .catch((err) => {
                        return null
                    })
            if (data["message"] == null) {
                return "Location does not exist."
            }
        }
        
        // if user is using brewery api
        if (args[0] == "brewery") {
            let breweryLocation = args[1]
            let apiCall = 'https://beermapping.com/webservice/locquery/'+process.env.NEXT_PUBLIC_BREWERY_APIKEY+"/"+breweryLocation+'&s=json'
            data["message"] = await fetch(apiCall)
                .then(response => response.json())
                    .then(breweryInfo => {
                        let breweryData = "BreweryInfo\n\tname: " + breweryInfo[0]["name"] + "\n\tlocation: " + breweryInfo[0]["city"] + ", " + breweryInfo[0]["country"] + "\n\taddress: " + breweryInfo[0]["street"] + "\n\toverall score: " + breweryInfo[0]["overall"] + "\n\twebsite: " + breweryInfo[0]["url"]
                        //console.log(breweryInfo)
                        return breweryData
                    })
                    .catch((err) => {
                        return null
                    })
            if (data["message"] == null) {
                return "Location does not exist."
            }
        }

        const messageCollectionRef = collection(db, "chats", chatID, "messages");
        await addDoc(messageCollectionRef, data)
        // await updateDoc(doc(db, "chats", chatID), {
        //     messages: arrayUnion(data)
        // })
        //console.log(chatID);
    }catch(error){
        console.log(error)
    }
}
