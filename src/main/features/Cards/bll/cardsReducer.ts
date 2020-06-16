import {CardType} from "../../../types/entities";
import {AppStateType, InferActionTypes} from "../../../bll/store/store";
import {ThunkAction, ThunkDispatch} from "redux-thunk";
import {ardsApi} from "../dal/сardsApi";
import {repository} from "../../../helpers/repos_localStorage/Token";


const initialState = {
  cards: [] as Array<CardType>,
  isFetching: false,
  isSuccess: false,
  page: 1,
  pageCount: 10,
  cardsTotalCount: 0


}

type initialStateType = typeof initialState;

export const CardsReducer = (state = initialState, action: ActionsType): initialStateType => {
  switch (action.type) {
    case "CARDS_REDUCER/SET_CARDS":
      return {
        ...state,
        cards: action.cards
      }
    case "CARDS_REDUCER/IS_FETCHING":
      return {
        ...state,
        isFetching: action.isFetching
      }

    case  "CARDS_REDUCER/SET_SUCCESS":
      return {
        ...state,
        isSuccess: action.isSuccess
      }
    /*       case  "CARDS_REDUCER/SET_CARDS_DATA":
           return {
               ...state,
...action.payload
           }*/

    default:
      return state;

  }

}

const actions = {
  setCards: (cards: Array<CardType>) => ({type: 'CARDS_REDUCER/SET_CARDS', cards} as const),
  set_Fetching: (isFetching: boolean) => ({type: "CARDS_REDUCER/IS_FETCHING", isFetching} as const),
  set_Success: (isSuccess: boolean) => ({type: "CARDS_REDUCER/SET_SUCCESS", isSuccess} as const),
  /* set_Cards_Count: (cardsTotalCount:number ,page:number,pageCount:number) =>
       ({type: "CARDS_REDUCER/SET_CARDS_DATA", payload:{cardsTotalCount,page,pageCount}} as const),
*/
}

type ActionsType = InferActionTypes<typeof actions>


type ThunkType = ThunkAction<void, AppStateType, unknown, ActionsType>
type DispatchType = ThunkDispatch<AppStateType, unknown, ActionsType>

export const get_Cards = (cardsPack_id: string): ThunkType =>
  async (dispatch: DispatchType, getState: () => AppStateType) => {
    try {
      dispatch(actions.set_Fetching(true));
      let token = repository.getToken();
      const res = await ardsApi.getCards(cardsPack_id, token);
      dispatch(actions.setCards(res.data.cards));
      dispatch(actions.set_Fetching(false));
      repository.saveToken(res.data.token, res.data.tokenDeathTime);
    } catch (e) {
      repository.saveToken(e.response.data.token, e.response.data.tokenDeathTime);
    }

  }
type Card = { cardsPack_id: string }
type UpdateType = { _id: string, answer: string }

export const add_Card = ({cardsPack_id}: Card): ThunkType =>
  async (dispatch: DispatchType, getState: () => AppStateType) => {
    try {
      let token = repository.getToken();
      const res = await ardsApi.addCard({cardsPack_id}, token);
      repository.saveToken(res.data.token, res.data.tokenDeathTime);
      dispatch(actions.set_Success(res.data.success))
      dispatch(get_Cards(cardsPack_id))
    } catch (e) {
      repository.saveToken(e.response.data.token, e.response.data.tokenDeathTime);
    }
  }

export const delete_Card = (card_id: string, cardsPack_id: string): ThunkType =>
  async (dispatch: DispatchType, getState: () => AppStateType) => {
    try {
      let token = repository.getToken();
      const res = await ardsApi.deleteCard(card_id, token);
      repository.saveToken(res.data.token, res.data.tokenDeathTime);
      dispatch(actions.set_Success(res.data.success))
      dispatch(get_Cards(cardsPack_id))
    } catch (e) {
      repository.saveToken(e.response.data.token, e.response.data.tokenDeathTime);
    }
  }

export const update_Card = ({_id, answer}: UpdateType, cardsPack_id: string): ThunkType =>
  async (dispatch: DispatchType, getState: () => AppStateType) => {
    try {
      let token = repository.getToken();
      const res = await ardsApi.updateCard({_id, answer}, token);
      repository.saveToken(res.data.token, res.data.tokenDeathTime);
      dispatch(actions.set_Success(res.data.success))
      dispatch(get_Cards(cardsPack_id))
    } catch (e) {
      repository.saveToken(e.response.data.token, e.response.data.tokenDeathTime);
    }
  }
export const setCardGrade = (newCardGrade: { _id: string, grade: number, shots: number }): ThunkType =>
  async (dispatch: DispatchType) => {
    try {
      let token = repository.getToken();
      const res = await ardsApi.updateCard(newCardGrade, token);
      repository.saveToken(res.data.token, res.data.tokenDeathTime);
      dispatch(actions.set_Success(res.data.success))
    } catch (e) {
      repository.saveToken(e.response.data.token, e.response.data.tokenDeathTime);
    }
  }


