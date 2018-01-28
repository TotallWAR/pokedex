import {Context} from "koa";
import {getManager} from "typeorm";
import {Pokemon} from "../../../entity/Pokemon";
import {User} from "../../../entity/User";
import {getCurrentUser} from '../../../service/global.helper.service';
import pokemonService from '../../../service/pokemon.service';

/**
 * Loads all pokemons from the database.
 */
export async function getFavouritePokemonsAction(context: Context) {
    try {
    // get a pokemon repository to perform operations with pokemon
    const userRepository = getManager().getRepository(User);
    let {pageNumber, amount} = context.params;
    amount = parseInt(amount, 10);
    pageNumber = parseInt(pageNumber, 10);

    // getting current user and taking his relations
    let user: User = await getCurrentUser(context);
    const currentUserWithRelations = await userRepository.findOneById(user.id, {relations: ["pokemons"]});

    // take certain amount of pokemons according to pagination
    let pokemons = currentUserWithRelations.pokemons.slice((pageNumber - 1) * amount, pageNumber * amount);

    let promises = pokemons.map(async (pokemon: any) => {
        let response: any = await pokemonService.getPokemonInfo(pokemon.name);
        delete response.moves;
        delete response.game_indices;
        pokemon.info = response;
        return pokemon;
    });

    // waiting for all promises to be resolved
    pokemons = await Promise.all(promises);

    // return loaded pokemon
    context.status = 200;
    context.body = {
        favouritePokemons: pokemons,
        count: currentUserWithRelations.pokemons.length
    };
    } catch (err) {
        console.log(err);
        throw err
    }
}
