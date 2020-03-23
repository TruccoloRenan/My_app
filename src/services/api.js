import Axios from 'axios';
import { AsyncStorage } from 'AsyncStorage';

const api = Axios.create({
    baseURL: 'https:app.helpertecnologia.com.br/'
});

export async function gethelpers(){
    let validToken = "";
    validToken = await retriveData(validToken);
    return new Promise((resolve, reject) => {

        //console.log(validToken + " token");

        return api.get('/api/helper' , {
            headers: {
                "Authorization": `Bearer ${validToken}`,
            },
        }).then(res => {
            const helper = res.data;
            resolve(helper);
        }).catch(error => {
            reject(error);
        });
    });
}

const retriveData = async (validToken) => {
    try{
        let value = await AsyncStorage.getItem('@api:token');

        if (value !== null) {
            validToken = value;
            return validToken;
        }
    }catch (e) {
        //console.log(e);
    }
};

export default api;