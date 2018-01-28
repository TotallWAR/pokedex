import endpointsConfig from '../config/apiEndpoints'
import request = require('koa2-request');
import {removeNullableProperties} from './global.helper.service'

// for using mock when offline development
import pokemonsMock from '../mock/allPokemons.mock'
import pokemonInfoMock from '../mock/pokemonInfo.mock'

export default class PokemonService {
    static async getPokemons(): Promise<any> {
        // mock result for OFFLINE development
        // return new Promise((resolve, reject) => {
        //
        //     setTimeout(() => {
        //         resolve({
        //             status: 200,
        //             data: pokemonsMock
        //         });
        //     }, 500);
        // });
        try {
            let options = {
                url: endpointsConfig.pokemonApi.getAllPokemons,
                method: 'get',
                headers: {
                    'User-Agent': 'request',
                    'content-type': 'application/json',
                    'charset': 'UTF-8'
                },
                json: true,
            };
            let result = await request(options);
            return removeNullableProperties(result.body);
        }
        catch (e) {
            console.log(e);
            throw new Error(e);
        }
    }

    static async getPokemonInfo(pokemonId): Promise<any> {
        // mock result for OFFLINE development
        // return new Promise((resolve, reject) => {
        //
        //     setTimeout(() => {
        //         resolve({
        //             status: 200,
        //             data: pokemonInfoMock
        //         });
        //     }, 10);
        // });
        try {
            let options = {
                url: `${endpointsConfig.pokemonApi.getPokemonById}/${pokemonId}`,
                method: 'get',
                headers: {
                    'User-Agent': 'request',
                    'content-type': 'application/json',
                    'charset': 'UTF-8'
                },
                json: true,
            };
            let result = await request(options);
            return result.body;
        }
        catch (e) {
            console.log(e);
            throw new Error(e);
        }
    }
}
