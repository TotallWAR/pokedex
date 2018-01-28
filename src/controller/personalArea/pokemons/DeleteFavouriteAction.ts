import {Context} from "koa";
import {getManager} from "typeorm";
import {Pokemon} from "../../../entity/Pokemon";
import {User} from "../../../entity/User";
import {getCurrentUser} from '../../../service/global.helper.service';
import pokemonService from '../../../service/pokemon.service';

/**
 * Delete given pokemon from favourite.
 */
export async function deleteFavouriteAction(context: Context) {
    try {
        // get a pokemon and user repository to perform operations with pokemons and users
        const userRepository = getManager().getRepository(User);
        let {pageNumber, amount} = context.params;
        amount = parseInt(amount, 10);
        pageNumber = parseInt(pageNumber, 10);

        // getting current user and taking his relations
        let user: User = await getCurrentUser(context);
        const currentUserWithRelations = await userRepository.findOneById(user.id, {relations: ["pokemons"]});
        currentUserWithRelations.pokemons = currentUserWithRelations.pokemons
            .filter(el => el.name !== context.params.pokemonName);

        await userRepository.save(currentUserWithRelations);

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
        if (err.code && parseInt(err.code, 10) === 23505) {
            context.status = 409;
            context.body = 'Pokemon is already added to favourite ones';
            return
        }
        throw new Error(err);
    }
}