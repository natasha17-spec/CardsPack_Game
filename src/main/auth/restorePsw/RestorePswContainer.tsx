import React from 'react';
import RestorePassword from "./RestorePassword";
import {useDispatch, useSelector} from "react-redux";
import {AppStateType} from "../../bll/store/store";
import {useForm} from "react-hook-form";
import {restorePswFormSchema} from "./restorePswFormShema";
import {send_Email} from "./restorePswReducer";
import {NEW_PSW_PATH, RESTORE_PSW_PATH} from "../../ui/components/routes/Routes";
import {Redirect} from 'react-router-dom';
import styles from './RestorePassword.module.css';


type RestorePasswordFormDataType = {
    email: string
}

export type RegisterType = ReturnType<typeof useForm>['register'];
export type ErrorType = ReturnType<typeof useForm>['errors'];


const RestorePswContainer: React.FC = () => {
    const html1 = `<a href='http://localhost:3000/#/${NEW_PSW_PATH}/`;

    const html2 = `'>reset-password-link</a>`;

    const {isSuccess, messageAboutError, isFetching} = useSelector((state: AppStateType) => state.restorePsw);

    const dispatch = useDispatch();

    const {register, handleSubmit, errors, reset} = useForm<RestorePasswordFormDataType>({
        mode: "onBlur",
        validationSchema: restorePswFormSchema
    });

    const onSubmit = handleSubmit((data) => {
        dispatch(send_Email(data.email, html1, html2));
        reset();
    })

    return (
        <div className={styles.container_restorePassword}>
            {isSuccess ?
                <span>Password recovery link sent to the specified email</span>
                :
                <RestorePassword
                    register={register}
                    errors={errors}
                    onSubmit={onSubmit}
                    messageAboutError={messageAboutError}
                    isFetching={isFetching}
                />
            }
        </div>
    );
};
export default RestorePswContainer;