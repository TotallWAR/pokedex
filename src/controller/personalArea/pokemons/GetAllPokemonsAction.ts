import {Context} from "koa";
import {getManager} from "typeorm";
import {Pokemon} from "../../../entity/Pokemon";
import pokemonService from '../../../service/pokemon.service';

/**
 * Loads pokemons amount through api
 */
export async function getAllPokemonsAction(context: Context) {
    try {
        let {pageNumber, amount} = context.params;
        amount = parseInt(amount, 10);
        pageNumber = parseInt(pageNumber, 10);
        let response: any = await pokemonService.getPokemons();
        let {results, count}: any = response;
        //depend on page number we send needed pokemons
        results = results.slice((pageNumber - 1) * amount, (pageNumber) * amount);
        let pokemons = [];
        let promises = results.map(async (pokemon) => {
            let response: any = await pokemonService.getPokemonInfo(pokemon.name);
            delete response.moves;
            delete response.game_indices;
            pokemon.info = response;
            return pokemon;
        });

        pokemons = await Promise.all(promises);

        // return loaded pokemons
        context.status = 200;
        context.body = {
            pokemons: pokemons,
            totalCount: count
        };
        return;
    } catch (err) {
        context.status = 500;
        throw new Error(err);
    }
}