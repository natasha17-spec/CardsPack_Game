import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from "react-redux";
import {AppStateType} from "../../bll/store/store";
import GetUsers from "./getUsers";
import {actions, getUser} from "../bll/getUserReducer";
import s from "./getUser.module.css";
// @ts-ignore
import _ from 'lodash'
import {UserType} from "../../types/entities";
// @ts-ignore
import ReactPaginate from 'react-paginate';


type UsersPropsType = {
    sort: 'asc' | 'desc'
    data: UserType[]
    sortField: string
}

const GetUsersContainer: React.FC = (props) => {
        const {users, pageCount, page, totalUsersCount} = useSelector((state: AppStateType) => state.getUserReducer)
        const dispatch = useDispatch()
        const [data, setOrderedUser] = useState<UsersPropsType>({
            data: [],
            sort: 'asc',
            sortField: 'id'
        })

        const pageChangedHandler = (page: { selected: number }) => {
            dispatch(actions.setPage(page.selected + 1))
        }
        useEffect(() => {
            dispatch(getUser(page, pageCount))
        }, [page, pageCount])

        useEffect(() => {
            setOrderedUser({
                ...data,
                data: users,
            })
        }, [users])
        const onSort = (sortField: any) => {
            const clonedData = users.concat()
            const sortType = data.sort === 'asc' ? 'desc' : 'asc'
            const orderedUser = _.orderBy(clonedData, sortField, sortType)
            setOrderedUser({
                data: orderedUser,
                sort: sortType,
                sortField: sortField
            })
        }

        const pageCountSize = Math.ceil(totalUsersCount / pageCount)
        // const displayData = _.chunk(data.data,pageSize)
        // @ts-ignore
        // @ts-ignore
        return (
            <div className={s.get_users_container}>
                <ReactPaginate
                    previousLabel={'<'}
                    nextLabel={'>'}
                    breakLabel={'...'}
                    breakClassName={'break-me'}
                    pageCount={pageCountSize}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={pageChangedHandler}
                    containerClassName={'pagination'}
                    activeClassName={'active'}
                    pageClassName='page-item'
                    pageLinkClassName='page-link'
                    previousClassName='page-item'
                    nextClassName='page-item'
                    previousLinkClassName="page-link"
                    nextLinkClassName="page-link"
                />
                <GetUsers
                    users={data.data}
                    onSort={onSort}
                    sort={data.sort}
                    sortField={data.sortField}

                />
            </div>
        );
    }
;

export default GetUsersContainer;