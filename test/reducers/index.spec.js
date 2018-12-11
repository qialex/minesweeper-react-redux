import { ADD_ARTICLE, EDIT_ARTICLE, DELETE_ARTICLE } from "../../src/js/constants/action-types";
import { addArticle, editArticle, deleteArticle } from "../../src/js/actions/index";
import rootReducer from '../../src/js/reducers';
import L from "../../src/js/localization/Localization";
import GameSettings from "../../src/js/models/GameSettings";

describe('rootReducer', () => {
    it('should return the initial state', () => {

        const gameSettings = new GameSettings().getData();

        const initState = {
            globalSettings: {
                language: L.getLanguage(),
            },
            gameSettings: new GameSettings().getData(),
            game: {
                fields: undefined,
                time: 0,
                flags: 0,
                started: false,
                finished: false,
                won: false,
            }
        };

        expect(rootReducer(undefined, {})).toEqual(initState)
    });

    // it('should return the state with new article on add', () => {
    //
    //     const article = {
    //         id: uuidv1(),
    //         title: 'Test title'
    //     };
    //
    //     const action = addArticle(article);
    //
    //     expect(rootReducer(undefined, action)).toEqual({
    //         articles: [article]
    //     })
    // });
    //
    // it('should return the state with updated article on edit', () => {
    //
    //     const article = {
    //         id: uuidv1(),
    //         title: 'initial title'
    //     };
    //
    //     const expectedArticle = {...article, title: 'new title'};
    //
    //     const action = editArticle(expectedArticle);
    //
    //     const initialState = {
    //         articles: [article]
    //     };
    //
    //     expect(rootReducer(initialState, action)).toEqual({
    //         articles: [expectedArticle]
    //     })
    // });
    //
    // it('should return the state without the article on delete', () => {
    //
    //     const article = {
    //         id: uuidv1(),
    //         title: 'Test title'
    //     };
    //
    //     const action = deleteArticle(article);
    //
    //     const initialState = {
    //         articles: [article]
    //     };
    //
    //     expect(rootReducer(initialState, action)).toEqual({
    //         articles: []
    //     })
    // });
});