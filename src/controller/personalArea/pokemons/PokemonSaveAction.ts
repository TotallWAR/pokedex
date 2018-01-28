import {Context} from "koa";
import {getManager} from "typeorm";
import {Pokemon} from "../../../entity/Pokemon";

/**
 * Saves given pokemon.
 */
export async function pokemonSaveAction(context: Context) {

    // get a pokemon  repository to perform operations with pokemons
    const postRepository = getManager().getRepository(Pokemon);

    // create a real pokemon object from pokemon json object sent over http
    const newPokemon = postRepository.create(context.request.body);

    // save received pokemon
    await postRepository.save(newPokemon);

    // return saved pokemon back
    context.body = newPokemon;
}