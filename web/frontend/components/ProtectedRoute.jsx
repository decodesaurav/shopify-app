import {useAuthenticatedFetch} from "../hooks";
import {useNavigate} from 'react-router-dom';
import React from "react";
import SkeletonPageComponent from "./Skeleton/SkeletonPageComponent.jsx";
import i18next from "../i18n.js";

export function ProtectedRoute({path, children}) {
    const navigate = useNavigate();
    const fetch = useAuthenticatedFetch()

    const fetchConnection = async () => {
        const res = await fetch("/api/check-pricing-status");
        return res.json()
    }

	fetchConnection().then((data) => {
		if(data.redirectToPricing) {
			return navigate('/pricing-plan', {state: false})
		}
    })

    if (path === '/welcome') {
        return children
    } else {
        return (<SkeletonPageComponent/>)
    }
}
