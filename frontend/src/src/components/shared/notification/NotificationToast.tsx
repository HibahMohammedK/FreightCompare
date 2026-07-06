import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { NotificationTypeIcon } from "./NotificationTypeIcon";
import { notificationAudio } from "../../../services/notificationAudio";

import {
    useAppDispatch,
    useAppSelector,
} from "../../../hooks/redux";

import {
    hideLatestNotification,
} from "../../../redux/notificationSlice";

export const NotificationToast: React.FC = () => {

    const dispatch = useAppDispatch();

    const notification = useAppSelector(
        (state) => state.notification.latestNotification
    );

   

    useEffect(() => {

        if (!notification) {
            return;
        }

        notificationAudio.play();

        const timer = setTimeout(() => {

            dispatch(
                hideLatestNotification()
            );

        }, 4000);

        return () => clearTimeout(timer);

    }, [notification, dispatch]);

    return (

        <AnimatePresence>

            {notification && (

                <motion.div
                    initial={{
                        opacity: 0,
                        x: 300,
                    }}
                    animate={{
                        opacity: 1,
                        x: 0,
                    }}
                    exit={{
                        opacity: 0,
                        x: 300,
                    }}
                    transition={{
                        duration: 0.3,
                    }}
                    className="
                        fixed
                        top-20
                        right-6
                        z-[9999]
                        w-80
                        bg-white
                        rounded-xl
                        shadow-xl
                        border
                        border-border-light
                        p-4
                    "
                >

                    <div className="flex gap-3">

                        <div className="
                            w-10
                            h-10
                            rounded-full
                            bg-primary-light
                            flex
                            items-center
                            justify-center
                        ">
                            <NotificationTypeIcon
                                type={notification.type}
                            />
                        </div>

                        <div className="flex-1">

                            <h4 className="font-semibold text-sm">
                                {notification.title}
                            </h4>

                            <p className="text-xs text-text-medium mt-1">
                                {notification.message}
                            </p>

                        </div>

                    </div>

                </motion.div>

            )}

        </AnimatePresence>

    );

};
