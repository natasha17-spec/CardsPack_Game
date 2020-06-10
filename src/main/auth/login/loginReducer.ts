import {AppStateType, InferActionTypes} from "../../bll/store/store";
import {ThunkAction, ThunkDispatch} from "redux-thunk";
import {api} from "../../dal/api";
import {repository} from "../../helpers/repos_localStorrage/Token";

const initialState = {
    email: null,
    login: null,
    isFetching: false,
    isAuth: false,
    token: '',
    rememberMe: false,
    errorServerMessage: '',
    _id: ''
}
type InitialStateType = typeof initialState

export const loginReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'cards2u/main/auth/AUTH_ME':
            return {
                ...state,
                isAuth: action.isAuth, errorServerMessage: action.errorServerMessage, _id: action._id
            }
        case "cards2u/main/auth/IS_FETCHING":
            return {
                ...state,
                isFetching: action.isFetching
            }
        default:
            return state
    }
}
const actions = {
    loginAuthMeSuccess: (isAuth: boolean, errorServerMessage: string, _id: string) => ({
        type: 'cards2u/main/auth/AUTH_ME', isAuth, errorServerMessage, _id
    } as const),

    loginIsFetching: (isFetching: boolean) => ({
        type: 'cards2u/main/auth/IS_FETCHING',
        isFetching
    } as const),
}
type ActionsType = InferActionTypes<typeof actions>
type ThunkType = ThunkAction<void, AppStateType, unknown, ActionsType>
type DispatchType = ThunkDispatch<AppStateType, unknown, ActionsType>

//!Для усовершенстования логина. Показывает кнопку "login out". Дает возможность вылогиниться.
// export const logout = (): ThunkType => async (dispatch: DispatchType) => {
//     debugger
//     let response = await api.logout()
//     if (response.data.status === 200) {
//         dispatch(loginAuthMeSuccess(null, null, false));
//     }
// };



export const login = (email: string, password: string, rememberMe: boolean): ThunkType =>
    async (dispatch: DispatchType) => {
        try {
            dispatch(actions.loginIsFetching(true))
            const result = await api.login(email, password, rememberMe)
            dispatch(actions.loginAuthMeSuccess(result.data.success, "", result.data._id));
            repository.saveToken(result.data.token,result.data.tokenDeathTime)
            repository.getToken()

            dispatch(actions.loginIsFetching(false))
        } catch (e) {
            dispatch(actions.loginAuthMeSuccess(false, e.response.data.error, ''))
            dispatch(actions.loginIsFetching(false))
        }
    }

