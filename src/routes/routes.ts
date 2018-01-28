import {getAllPokemonsAction} from "../controller/personalArea/pokemons/GetAllPokemonsAction";
import {getPokemonByIdAction} from "../controller/personalArea/pokemons/GetPokemonByIdAction";
import {getFavouritePokemonsAction} from "../controller/personalArea/pokemons/GetFavouritePokemonsAction";
import {pokemonSaveAction} from "../controller/personalArea/pokemons/PokemonSaveAction";
import {getIndexPageAction} from "../controller/GetIndexPageAction";
import {checkUserAuth} from '../controller/user/CheckAuthAction';
import {loginUser} from '../controller/user/LoginUserAction';
import {registerUser} from '../controller/user/RegisterUserAction';
import {addToFavouriteAction} from '../controller/personalArea/pokemons/addToFavouriteAction';
import {deleteFavouriteAction} from '../controller/personalArea/pokemons/DeleteFavouriteAction';
import {searchPokemonsAction} from '../controller/personalArea/pokemons/SearchPokemonsAction';

/**
 * All application routes.
 */
export const AppRoutes = [
    //======= START index routes =======
    {
        path: "/",
        method: "get",
        action: getIndexPageAction
    },
    {
        path: "/personalArea",
        method: "get",
        action: getIndexPageAction
    },
    //======= END index routes =======

    // ======= START pokemon routes =======
    {
        path: "/personalArea/pokemons/getPokemons/:pageNumber/:amount",
        method: "get",
        action: getAllPokemonsAction
    },
    {
        path: "/personalArea/pokemons/favourite/:pageNumber/:amount",
        method: "get",
        action: getFavouritePokemonsAction
    },
    {
        path: "/personalArea/pokemons/favourite/add",
        method: "put",
        action: addToFavouriteAction
    },
    {
        path: "/personalArea/pokemons/favourite/delete/:pokemonName/:pageNumber/:amount",
        method: "delete",
        action: deleteFavouriteAction
    },
    {
        path: "/personalArea/pokemons/:id",
        method: "get",
        action: getPokemonByIdAction
    },
    {
        path: "/personalArea/pokemons/search/:name/:pageNumber/:amount",
        method: "get",
        action: searchPokemonsAction
    },
    // ======= END pokemon routes =======

    // ======= START user routes =======
    {
        path: "/register",
        method: "post",
        action: registerUser
    },
    {
        path: "/login",
        method: "post",
        action: loginUser
    },
    {
        path: "/checkAuth",
        method: "get",
        action: checkUserAuth
    },
    // ======= END user routes =======

];