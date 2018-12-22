import { LANGUAGE_CHANGED } from "../../src/js/constants/action-types";
import { globalChangeLanguage } from "../../src/js/actions/index";
import { initialState, gameInitial, rootReducer } from '../../src/js/reducers';
import L from "../../src/js/localization/Localization";
import GameSettings from "../../src/js/models/GameSettings";

describe('rootReducer', () => {

    it('should return the initial state', () => {

        // initialState exist
        expect(initialState).toBeDefined();

        // .globalSettings exist
        expect(initialState.globalSettings).toBeDefined();

        // .globalSettings.language exist
        expect(initialState.globalSettings.language).toBeDefined();

        // .gameSettings exist
        expect(initialState.gameSettings).toBeDefined();

        // .gameSettings instanceof GameSettings
        expect(initialState.gameSettings instanceof GameSettings).toBeTruthy();

        // .game exist
        expect(initialState.game).toBeDefined();

        // .game is equal to gameInitial
        expect(initialState.game).toEqual(gameInitial);

        // .fields exist
        expect(gameInitial.fields).toBeDefined();

        // .fields.length is 0
        expect(gameInitial.fields.length).toBe(0);

        // .time exist
        expect(gameInitial.time).toBeDefined();

        // .time is 0
        expect(gameInitial.time).toBe(0);

        // .flags exist
        expect(gameInitial.flags).toBeDefined();

        // .flags is 0
        expect(gameInitial.flags).toBe(0);

        // .started exist
        expect(gameInitial.started).toBeDefined();

        // .started is false
        expect(gameInitial.started).toBe(false);

        // .finished exist
        expect(gameInitial.finished).toBeDefined();

        // .finished is false
        expect(gameInitial.finished).toBe(false);

        // .won exist
        expect(gameInitial.won).toBeDefined();

        // .won is false
        expect(gameInitial.won).toBe(false);

        // should be equal to initial state
        expect(rootReducer(undefined, {})).toEqual(initialState)
    });

    it('should return the state with changed language', () => {

        // looping available languages
        L.getAvailableLanguages().map(languageCode => {

            // creating action to change language
            const action = globalChangeLanguage(languageCode);

            // state language to be equal to current language
            expect(rootReducer(undefined, action).globalSettings.language).toEqual(languageCode)
        })
    });

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