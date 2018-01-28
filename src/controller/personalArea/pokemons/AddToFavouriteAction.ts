import {Context} from "koa";
import {getManager} from "typeorm";
import {Pokemon} from "../../../entity/Pokemon";
import {User} from "../../../entity/User";
import {getCurrentUser} from '../../../service/global.helper.service';

/**
 * Saves given pokemon to favourite.
 */
export async function addToFavouriteAction(context: Context) {
    try {
        // get a pokemon and user repository to perform operations with pokemons and users
        const pokemonRepository = getManager().getRepository(Pokemon);
        const userRepository = getManager().getRepository(User);

        // getting current user and taking his relations
        let user: User = await getCurrentUser(context);
        const currentUserWithRelations = await userRepository.findOneById(user.id, {relations: ["pokemons"]});

        let newPokemon: Pokemon = null;
        let existingPokemon: Pokemon = await pokemonRepository.findOne({name: context.request.body.pokemonName});
        if (!existingPokemon) {
            // add new pokemon
            newPokemon = new Pokemon();
            newPokemon.name = context.request.body.pokemonName;
            await pokemonRepository.save(newPokemon);

            // if user does not already have this pokemon we add new one
            if (currentUserWithRelations.pokemons.every(el => el.name !== newPokemon.name)) {
                currentUserWithRelations.pokemons.push(newPokemon);
                await userRepository.save(currentUserWithRelations);
            } else {
                let err: any = new Error();
                err.code = 23505;
                throw err
            }
        } else {
            // add existing pokemon
            if (currentUserWithRelations.pokemons.every(el => el.name !== existingPokemon.name)) {
                currentUserWithRelations.pokemons.push(existingPokemon);
                await userRepository.save(currentUserWithRelations);
            } else {
                let err: any = new Error();
                err.code = 23505;
                throw err
            }
        }
        // return saved pokemon back
        context.status = 200;
        context.body = currentUserWithRelations.pokemons;
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