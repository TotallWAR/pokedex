import {Context} from "koa";
import pokemonService from '../../../service/pokemon.service';

/**
 * search pokemons
 */
export async function searchPokemonsAction(context: Context) {
    try {
        let response: any = await pokemonService.getPokemons();
        let {results}: any = response;
        let {name, amount, pageNumber} = context.params;

        // filter with search phrase
        let reg = new RegExp(`${name.toLowerCase()}`);
        let pokemons = results.filter(el => el.name.match(reg));

        // remember total amount for pagination
        let allMatchedPokemonsAmount = pokemons.length;

        amount = parseInt(amount, 10);
        pageNumber = parseInt(pageNumber, 10);
        pokemons = pokemons.slice((pageNumber - 1) * amount, pageNumber * amount);

        let promises = pokemons.map(async (pokemon) => {
            let response: any = await pokemonService.getPokemonInfo(pokemon.name);
            delete response.moves;
            delete response.game_indices;
            pokemon.info = response;
            return pokemon;
        });

        //waiting for all promises to be resolved
        pokemons = await Promise.all(promises);
        // return loaded pokemon
        context.status = 200;
        context.body = {
            pokemons: pokemons,
            totalCount: allMatchedPokemonsAmount
        };

    } catch (err) {
        console.log(err);
        throw new Error(err);
    }
}