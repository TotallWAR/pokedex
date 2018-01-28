import {Context} from "koa";
import {getManager} from "typeorm";
import {Pokemon} from "../../../entity/Pokemon";

/**
 * Loads post by a given id.
 */
export async function getPokemonByIdAction(context: Context) {

    // get a pokemon repository to perform operations with pokemon
    const pokemonRepository = getManager().getRepository(Pokemon);

    // load a pokemon by a given pokemon id
    const pokemon = await pokemonRepository.findOneById((context as any).params.id);

    // if pokemon was not found return 404 to the client
    if (!pokemon) {
        context.status = 404;
        return;
    }

    // return loaded pokemon
    context.body = pokemon;
}