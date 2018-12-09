import { ADD_ARTICLE, EDIT_ARTICLE, DELETE_ARTICLE } from "../../src/js/constants/action-types";
import { addArticle, editArticle, deleteArticle } from "../../src/js/actions/index";
import uuidv1 from 'uuid';
describe('actions', () => {
    it('should create an action to add an article', () => {
        const article = {
            id: uuidv1(),
            title: 'Test title'
        }
        const expectedAction = {
            type: ADD_ARTICLE,
            payload: article
        }
        expect(addArticle(article)).toEqual(expectedAction)
    })
    it('should create an action to edit an article', () => {
        const article = {
            id: uuidv1(),
            title: 'Test title'
        }
        const expectedAction = {
            type: EDIT_ARTICLE,
            payload: article
        }
        expect(editArticle(article)).toEqual(expectedAction)
    })
    it('should create an action to delete an article', () => {
        const article = {
            id: uuidv1(),
            title: 'Test title'
        }
        const expectedAction = {
            type: DELETE_ARTICLE,
            payload: article
        }
        expect(deleteArticle(article)).toEqual(expectedAction)
    })
})